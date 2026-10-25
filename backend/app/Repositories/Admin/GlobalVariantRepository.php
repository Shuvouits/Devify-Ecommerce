<?php

namespace App\Repositories\Admin;

use App\Models\GlobalVariant;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class GlobalVariantRepository implements GlobalVariantRepositoryInterface
{
    /*
    |--------------------------------------------------------------------------
    | Paginated List
    |--------------------------------------------------------------------------
    */

    public function paginate(
        array $filters = []
    ): LengthAwarePaginator {
        $query = GlobalVariant::query()
            ->with([
                'options',
                'creator:id,name,email',
            ]);

        if (
            !empty(
                $filters['search']
            )
        ) {
            $search = trim(
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
                            'slug',
                            'like',
                            "%{$search}%"
                        )
                        ->orWhereHas(
                            'options',
                            function ($query) use ($search) {
                                $query->where(
                                    'value',
                                    'like',
                                    "%{$search}%"
                                );
                            }
                        );
                }
            );
        }

        if (
            array_key_exists(
                'is_active',
                $filters
            ) &&
            $filters['is_active'] !== null
        ) {
            $query->where(
                'is_active',
                filter_var(
                    $filters['is_active'],
                    FILTER_VALIDATE_BOOLEAN
                )
            );
        }

        if (
            !empty(
                $filters['visual_type']
            )
        ) {
            $query->where(
                'visual_type',
                $filters['visual_type']
            );
        }

        $allowedSorts = [
            'name',
            'display_order',
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
                : 'display_order';

        $sortDirection =
            strtolower(
                $filters['sort_direction'] ??
                'asc'
            ) === 'desc'
                ? 'desc'
                : 'asc';

        $perPage =
            min(
                max(
                    (int) (
                        $filters['per_page'] ??
                        20
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
                'asc'
            )
            ->paginate(
                $perPage
            );
    }


    /*
    |--------------------------------------------------------------------------
    | All Ordered
    |--------------------------------------------------------------------------
    */

    public function getAllOrdered(): Collection
    {
        return GlobalVariant::query()
            ->with([
                'options',
            ])
            ->orderBy(
                'display_order'
            )
            ->orderBy(
                'name'
            )
            ->get();
    }


    /*
    |--------------------------------------------------------------------------
    | Find
    |--------------------------------------------------------------------------
    */

    public function findOrFail(
        int $id
    ): GlobalVariant {
        return GlobalVariant::query()
            ->with([
                'options',
                'creator:id,name,email',
            ])
            ->findOrFail(
                $id
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Create
    |--------------------------------------------------------------------------
    */

    public function create(
        array $data
    ): GlobalVariant {
        return GlobalVariant::create(
            $data
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Update
    |--------------------------------------------------------------------------
    */

    public function update(
        GlobalVariant $globalVariant,
        array $data
    ): GlobalVariant {
        $globalVariant->update(
            $data
        );

        return $globalVariant->fresh([
            'options',
            'creator:id,name,email',
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    public function delete(
        GlobalVariant $globalVariant
    ): bool {
        return (bool)
            $globalVariant->delete();
    }


    public function syncOptions(
    GlobalVariant $globalVariant,
    array $options
): GlobalVariant {
    $existingOptions = $globalVariant
        ->options()
        ->get()
        ->keyBy('id');

    $keptOptionIds = [];

    foreach ($options as $index => $option) {
        $optionModel = null;

        /*
        |--------------------------------------------------------------------------
        | Match Existing Option By ID
        |--------------------------------------------------------------------------
        |
        | Edit form থেকে option ID এলে সেই একই database row update হবে।
        | এতে Product Variant ভবিষ্যতে এই option ID reference করলেও ID বদলাবে না।
        |
        */

        if (!empty($option['id'])) {
            $optionId = (int) $option['id'];

            if ($existingOptions->has($optionId)) {
                $optionModel = $existingOptions->get($optionId);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Fallback Match By Value
        |--------------------------------------------------------------------------
        |
        | পুরনো frontend বা API payload-এ ID না থাকলেও একই value থাকলে
        | existing option preserve করার চেষ্টা করবে।
        |
        */

        if (!$optionModel) {
            $optionValue = strtolower(
                trim($option['value'])
            );

            $optionModel = $existingOptions
                ->first(function ($existingOption) use (
                    $optionValue,
                    $keptOptionIds
                ) {
                    return !in_array(
                        $existingOption->id,
                        $keptOptionIds,
                        true
                    ) &&
                    strtolower(
                        trim($existingOption->value)
                    ) === $optionValue;
                });
        }

        $optionData = [
            'value' =>
                $option['value'],

            'color_hex' =>
                $option['color_hex'] ??
                null,

            'display_order' =>
                $option['display_order'] ??
                $index + 1,

            'is_active' =>
                $option['is_active'] ??
                true,
        ];

        /*
        |--------------------------------------------------------------------------
        | Update Existing Option
        |--------------------------------------------------------------------------
        */

        if ($optionModel) {
            $optionModel->update(
                $optionData
            );

            $keptOptionIds[] =
                $optionModel->id;

            continue;
        }

        /*
        |--------------------------------------------------------------------------
        | Create New Option
        |--------------------------------------------------------------------------
        */

        $newOption = $globalVariant
            ->options()
            ->create(
                $optionData
            );

        $keptOptionIds[] =
            $newOption->id;
    }

    /*
    |--------------------------------------------------------------------------
    | Remove Deleted Options
    |--------------------------------------------------------------------------
    */

    $globalVariant
        ->options()
        ->whereNotIn(
            'id',
            $keptOptionIds
        )
        ->delete();

    return $globalVariant->fresh([
        'options',
        'creator:id,name,email',
    ]);
}


    /*
    |--------------------------------------------------------------------------
    | Stats
    |--------------------------------------------------------------------------
    */

    public function countAll(): int
    {
        return GlobalVariant::query()
            ->count();
    }


    public function countActive(): int
    {
        return GlobalVariant::query()
            ->where(
                'is_active',
                true
            )
            ->count();
    }


    /*
    |--------------------------------------------------------------------------
    | Max Display Order
    |--------------------------------------------------------------------------
    */

    public function getMaxDisplayOrder(): int
    {
        return (int)
            GlobalVariant::query()
                ->max(
                    'display_order'
                );
    }



}
