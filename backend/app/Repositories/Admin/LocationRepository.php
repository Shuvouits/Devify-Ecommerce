<?php

namespace App\Repositories\Admin;

use App\Models\Location;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class LocationRepository implements LocationRepositoryInterface
{
    public function paginate(
        array $filters = []
    ): LengthAwarePaginator {
        $query =
            Location::query()
                ->with([
                    'creator:id,name,email',
                ]);

        if (
            !empty(
                $filters['search']
            )
        ) {
            $search =
                trim(
                    $filters['search']
                );

            $query->where(
                function ($query) use ($search) {
                    $query
                        ->where(
                            'name',
                            'like',
                            "%{$search}%"
                        )
                        ->orWhere(
                            'address',
                            'like',
                            "%{$search}%"
                        );
                }
            );
        }

        $filter =
            $filters['filter'] ??
            'all';

        if (
            $filter ===
            'active'
        ) {
            $query->where(
                'status',
                'active'
            );
        }

        if (
            $filter ===
            'inactive'
        ) {
            $query->where(
                'status',
                'inactive'
            );
        }

        if (
            $filter ===
            'default'
        ) {
            $query->where(
                'is_default',
                true
            );
        }

        if (
            !empty(
                $filters['status']
            )
        ) {
            $query->where(
                'status',
                $filters['status']
            );
        }

        if (
            array_key_exists(
                'can_collect',
                $filters
            ) &&
            $filters['can_collect'] !== null
        ) {
            $query->where(
                'can_collect',
                filter_var(
                    $filters['can_collect'],
                    FILTER_VALIDATE_BOOLEAN
                )
            );
        }

        if (
            array_key_exists(
                'ships_online_orders',
                $filters
            ) &&
            $filters['ships_online_orders'] !== null
        ) {
            $query->where(
                'ships_online_orders',
                filter_var(
                    $filters['ships_online_orders'],
                    FILTER_VALIDATE_BOOLEAN
                )
            );
        }

        if (
            array_key_exists(
                'sells_over_counter',
                $filters
            ) &&
            $filters['sells_over_counter'] !== null
        ) {
            $query->where(
                'sells_over_counter',
                filter_var(
                    $filters['sells_over_counter'],
                    FILTER_VALIDATE_BOOLEAN
                )
            );
        }

        if (
            array_key_exists(
                'receives_returns',
                $filters
            ) &&
            $filters['receives_returns'] !== null
        ) {
            $query->where(
                'receives_returns',
                filter_var(
                    $filters['receives_returns'],
                    FILTER_VALIDATE_BOOLEAN
                )
            );
        }

        $allowedSorts = [
            'name',
            'status',
            'delivery_order',
            'created_at',
            'updated_at',
        ];

        $sortBy =
            in_array(
                $filters['sort_by'] ?? '',
                $allowedSorts,
                true
            )
                ? $filters['sort_by']
                : 'created_at';

        $sortDirection =
            strtolower(
                $filters['sort_direction'] ??
                'desc'
            ) === 'asc'
                ? 'asc'
                : 'desc';

        $perPage =
            min(
                max(
                    (int) (
                        $filters['per_page'] ??
                        15
                    ),
                    1
                ),
                100
            );

        return $query
            ->orderBy(
                $sortBy,
                $sortDirection
            )
            ->orderBy(
                'id',
                'desc'
            )
            ->paginate(
                $perPage
            );
    }


    public function findOrFail(
        int $id
    ): Location {
        return Location::query()
            ->with([
                'creator:id,name,email',
            ])
            ->findOrFail(
                $id
            );
    }


    public function create(
        array $data
    ): Location {
        return Location::create(
            $data
        );
    }


    public function update(
        Location $location,
        array $data
    ): Location {
        $location->update(
            $data
        );

        return $location->fresh([
            'creator:id,name,email',
        ]);
    }


    public function delete(
        Location $location
    ): bool {
        return (bool)
            $location->delete();
    }


    public function clearDefaultExcept(
        ?int $exceptId = null
    ): void {
        Location::query()
            ->when(
                $exceptId,
                fn ($query) =>
                    $query->where(
                        'id',
                        '!=',
                        $exceptId
                    )
            )
            ->where(
                'is_default',
                true
            )
            ->update([
                'is_default' =>
                    false,
            ]);
    }


    public function getActiveForDeliveryOrder(): Collection
    {
        return Location::query()
            ->where(
                'status',
                'active'
            )
            ->orderByRaw(
                'delivery_order IS NULL'
            )
            ->orderBy(
                'delivery_order'
            )
            ->orderBy(
                'name'
            )
            ->get();
    }


    public function updateDeliveryOrder(
        int $id,
        int $deliveryOrder
    ): bool {
        return Location::query()
            ->where(
                'id',
                $id
            )
            ->update([
                'delivery_order' =>
                    $deliveryOrder,
            ]) > 0;
    }


    public function countAll(): int
    {
        return Location::query()
            ->count();
    }


    public function countByStatus(
        string $status
    ): int {
        return Location::query()
            ->where(
                'status',
                $status
            )
            ->count();
    }
}
