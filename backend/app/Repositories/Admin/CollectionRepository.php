<?php

namespace App\Repositories\Admin;

use App\Models\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection as SupportCollection;

class CollectionRepository implements CollectionRepositoryInterface
{
    /*
    |--------------------------------------------------------------------------
    | Paginated List
    |--------------------------------------------------------------------------
    */

    public function paginate(
        array $filters = []
    ): LengthAwarePaginator {
        $query = Collection::query()
            ->with([
                'creator:id,name,email',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */

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
                            'title',
                            'like',
                            "%{$search}%"
                        )
                        ->orWhere(
                            'slug',
                            'like',
                            "%{$search}%"
                        )
                        ->orWhere(
                            'description',
                            'like',
                            "%{$search}%"
                        );
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Status Filter
        |--------------------------------------------------------------------------
        */

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

        /*
        |--------------------------------------------------------------------------
        | Kind Filter
        |--------------------------------------------------------------------------
        */

        if (
            !empty(
                $filters['kind']
            )
        ) {
            $query->where(
                'kind',
                $filters['kind']
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Collection Type Filter
        |--------------------------------------------------------------------------
        */

        if (
            !empty(
                $filters['collection_type']
            )
        ) {
            $query->where(
                'collection_type',
                $filters['collection_type']
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Publishing Filters
        |--------------------------------------------------------------------------
        */

        if (
            array_key_exists(
                'publish_online_store',
                $filters
            ) &&
            $filters['publish_online_store'] !== null
        ) {
            $query->where(
                'publish_online_store',
                filter_var(
                    $filters['publish_online_store'],
                    FILTER_VALIDATE_BOOLEAN
                )
            );
        }

        if (
            array_key_exists(
                'publish_point_of_sale',
                $filters
            ) &&
            $filters['publish_point_of_sale'] !== null
        ) {
            $query->where(
                'publish_point_of_sale',
                filter_var(
                    $filters['publish_point_of_sale'],
                    FILTER_VALIDATE_BOOLEAN
                )
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Sorting
        |--------------------------------------------------------------------------
        */

        $allowedSorts = [
            'title',
            'display_position',
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
                : 'display_position';

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

    public function getAllOrdered(): SupportCollection
    {
        return Collection::query()
            ->with([
                'creator:id,name,email',
            ])
            ->orderBy(
                'display_position'
            )
            ->orderBy(
                'title'
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
): Collection {
    return Collection::query()
        ->with([
            'creator:id,name,email',

            'products' => function ($query) {
                $query
                    ->orderByPivot(
                        'display_order'
                    );
            },

            'products.category:id,name,slug',
            'products.media',
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
    ): Collection {
        return Collection::create(
            $data
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Update
    |--------------------------------------------------------------------------
    */

    public function update(
        Collection $collection,
        array $data
    ): Collection {
        $collection->update(
            $data
        );

        return $collection->fresh([
            'creator:id,name,email',
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    public function delete(
        Collection $collection
    ): bool {
        return (bool)
            $collection->delete();
    }


    /*
    |--------------------------------------------------------------------------
    | Stats
    |--------------------------------------------------------------------------
    */

    public function countAll(): int
    {
        return Collection::query()
            ->count();
    }


    public function countByStatus(
        string $status
    ): int {
        return Collection::query()
            ->where(
                'status',
                $status
            )
            ->count();
    }


    /*
    |--------------------------------------------------------------------------
    | Max Display Position
    |--------------------------------------------------------------------------
    */

    public function getMaxDisplayPosition(): int
    {
        return (int)
            Collection::query()
                ->max(
                    'display_position'
                );
    }

        /*
    |--------------------------------------------------------------------------
    | Sync Products
    |--------------------------------------------------------------------------
    */

    public function syncProducts(
        Collection $collection,
        array $productIds
    ): void {
        $syncData = [];

        foreach (
            array_values($productIds) as $index => $productId
        ) {
            $syncData[$productId] = [
                'display_order' => $index + 1,
            ];
        }

        $collection
            ->products()
            ->sync($syncData);
    }


}
