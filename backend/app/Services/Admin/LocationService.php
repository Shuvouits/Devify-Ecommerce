<?php

namespace App\Services\Admin;

use App\Models\Location;
use App\Repositories\Admin\LocationRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class LocationService
{
    public function __construct(
        protected LocationRepositoryInterface $locationRepository
    ) {
    }


    /*
    |--------------------------------------------------------------------------
    | Location List
    |--------------------------------------------------------------------------
    */

    public function getLocations(
        array $filters = []
    ): LengthAwarePaginator {
        return $this->locationRepository
            ->paginate($filters);
    }


    /*
    |--------------------------------------------------------------------------
    | Location Stats
    |--------------------------------------------------------------------------
    */

    public function getLocationStats(): array
    {
        return [
            'total' =>
                $this->locationRepository
                    ->countAll(),

            'active' =>
                $this->locationRepository
                    ->countByStatus('active'),

            'inactive' =>
                $this->locationRepository
                    ->countByStatus('inactive'),
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | Single Location
    |--------------------------------------------------------------------------
    */

    public function getLocation(
        int $id
    ): Location {
        return $this->locationRepository
            ->findOrFail($id);
    }


    /*
    |--------------------------------------------------------------------------
    | Create Location
    |--------------------------------------------------------------------------
    */

    public function createLocation(
        array $data,
        ?int $userId = null
    ): Location {
        return DB::transaction(
            function () use ($data, $userId) {
                $makeDefault =
                    (bool) (
                        $data['is_default'] ??
                        false
                    );

                /*
                |--------------------------------------------------------------------------
                | First Location Becomes Default Automatically
                |--------------------------------------------------------------------------
                */

                if (
                    Location::query()->count() === 0
                ) {
                    $makeDefault = true;
                }

                /*
                |--------------------------------------------------------------------------
                | Default Location Must Be Active
                |--------------------------------------------------------------------------
                */

                if ($makeDefault) {
                    $data['status'] = 'active';

                    $this->locationRepository
                        ->clearDefaultExcept();
                }

                /*
                |--------------------------------------------------------------------------
                | Delivery Order
                |--------------------------------------------------------------------------
                */

                if (
                    ($data['status'] ?? 'active') === 'active' &&
                    empty($data['delivery_order'])
                ) {
                    $data['delivery_order'] =
                        $this->getNextDeliveryOrder();
                }

                $data['is_default'] =
                    $makeDefault;

                $data['created_by'] =
                    $userId;

                return $this->locationRepository
                    ->create($data);
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Update Location
    |--------------------------------------------------------------------------
    */

    public function updateLocation(
        int $id,
        array $data
    ): Location {
        return DB::transaction(
            function () use ($id, $data) {
                $location =
                    $this->getLocation($id);

                $makeDefault =
                    array_key_exists(
                        'is_default',
                        $data
                    )
                        ? (bool) $data['is_default']
                        : $location->is_default;

                $nextStatus =
                    $data['status'] ??
                    $location->status;

                /*
                |--------------------------------------------------------------------------
                | Default Location Cannot Lose Default Status Directly
                |--------------------------------------------------------------------------
                */

                if (
                    $location->is_default &&
                    !$makeDefault
                ) {
                    throw ValidationException::withMessages([
                        'is_default' => [
                            'Set another location as default before removing the default status from this location.',
                        ],
                    ]);
                }

                /*
                |--------------------------------------------------------------------------
                | Default Location Cannot Be Inactive
                |--------------------------------------------------------------------------
                */

                if (
                    $location->is_default &&
                    $nextStatus === 'inactive'
                ) {
                    throw ValidationException::withMessages([
                        'status' => [
                            'The default location cannot be made inactive. Set another location as default first.',
                        ],
                    ]);
                }

                /*
                |--------------------------------------------------------------------------
                | Making This Location Default
                |--------------------------------------------------------------------------
                */

                if ($makeDefault) {
                    $data['status'] =
                        'active';

                    $data['is_default'] =
                        true;

                    $this->locationRepository
                        ->clearDefaultExcept(
                            $location->id
                        );
                }

                /*
                |--------------------------------------------------------------------------
                | Delivery Order
                |--------------------------------------------------------------------------
                */

                $resolvedStatus =
                    $data['status'] ??
                    $location->status;

                if (
                    $resolvedStatus === 'active' &&
                    empty(
                        $data['delivery_order'] ??
                        $location->delivery_order
                    )
                ) {
                    $data['delivery_order'] =
                        $this->getNextDeliveryOrder();
                }

                if (
                    $resolvedStatus === 'inactive'
                ) {
                    $data['delivery_order'] =
                        null;
                }

                $updatedLocation =
                    $this->locationRepository
                        ->update(
                            $location,
                            $data
                        );

                /*
                |--------------------------------------------------------------------------
                | Resequence After Inactivation
                |--------------------------------------------------------------------------
                */

                if (
                    $resolvedStatus === 'inactive'
                ) {
                    $this->resequenceDeliveryOrder();
                }

                return $updatedLocation;
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Location
    |--------------------------------------------------------------------------
    */

    public function deleteLocation(
        int $id
    ): bool {
        $location =
            $this->getLocation($id);

        if (
            $location->is_default
        ) {
            throw ValidationException::withMessages([
                'location' => [
                    'The default location cannot be deleted. Set another location as default first.',
                ],
            ]);
        }

        $deleted =
            $this->locationRepository
                ->delete($location);

        if ($deleted) {
            $this->resequenceDeliveryOrder();
        }

        return $deleted;
    }


    /*
    |--------------------------------------------------------------------------
    | Set Default Location
    |--------------------------------------------------------------------------
    */

    public function setDefaultLocation(
        int $id
    ): Location {
        return DB::transaction(
            function () use ($id) {
                $location =
                    $this->getLocation($id);

                $this->locationRepository
                    ->clearDefaultExcept(
                        $location->id
                    );

                return $this->locationRepository
                    ->update(
                        $location,
                        [
                            'is_default' => true,
                            'status' => 'active',
                            'delivery_order' =>
                                $location->delivery_order
                                    ?: $this->getNextDeliveryOrder(),
                        ]
                    );
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Active Locations For Delivery Order
    |--------------------------------------------------------------------------
    */

    public function getDeliveryOrderLocations(): Collection
    {
        return $this->locationRepository
            ->getActiveForDeliveryOrder();
    }


    /*
    |--------------------------------------------------------------------------
    | Reorder Locations
    |--------------------------------------------------------------------------
    */

    public function reorderLocations(
        array $locations
    ): Collection {
        return DB::transaction(
            function () use ($locations) {
                $order = 1;

                foreach (
                    $locations as $locationId
                ) {
                    $location =
                        $this->locationRepository
                            ->findOrFail(
                                (int) $locationId
                            );

                    if (
                        $location->status !== 'active'
                    ) {
                        continue;
                    }

                    $this->locationRepository
                        ->updateDeliveryOrder(
                            $location->id,
                            $order
                        );

                    $order++;
                }

                return $this->locationRepository
                    ->getActiveForDeliveryOrder();
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Next Delivery Order
    |--------------------------------------------------------------------------
    */

    private function getNextDeliveryOrder(): int
    {
        $maxOrder =
            Location::query()
                ->where(
                    'status',
                    'active'
                )
                ->max(
                    'delivery_order'
                );

        return ((int) $maxOrder) + 1;
    }


    /*
    |--------------------------------------------------------------------------
    | Resequence Delivery Order
    |--------------------------------------------------------------------------
    */

    private function resequenceDeliveryOrder(): void
    {
        $locations =
            $this->locationRepository
                ->getActiveForDeliveryOrder();

        foreach (
            $locations as $index => $location
        ) {
            $this->locationRepository
                ->updateDeliveryOrder(
                    $location->id,
                    $index + 1
                );
        }
    }
}
