<?php

namespace App\Repositories\Admin;

use App\Models\Category;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class CategoryRepository implements CategoryRepositoryInterface
{
    public function paginate(
        array $filters = []
    ): LengthAwarePaginator {
        $query =
            Category::query()
                ->with([
                    'parent:id,name,parent_id',
                ]);


        /*
        |--------------------------------------------------------------------------
        | Filter
        |--------------------------------------------------------------------------
        */

        $filter =
            $filters['filter'] ??
            'all';


        /*
        |--------------------------------------------------------------------------
        | Trash
        |--------------------------------------------------------------------------
        */

        if (
            $filter ===
            'trash'
        ) {
            $query->onlyTrashed();
        }


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
                            'slug',
                            'like',
                            "%{$search}%"
                        );
                }
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Direct Status Filter
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
        | Direct Featured Filter
        |--------------------------------------------------------------------------
        */

        if (
            array_key_exists(
                'is_featured',
                $filters
            ) &&
            $filters['is_featured'] !== null
        ) {
            $query->where(
                'is_featured',
                filter_var(
                    $filters['is_featured'],
                    FILTER_VALIDATE_BOOLEAN
                )
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Parent Filter
        |--------------------------------------------------------------------------
        */

        if (
            isset(
                $filters['parent_id']
            )
        ) {
            if (
                $filters['parent_id'] ===
                'root'
            ) {
                $query->whereNull(
                    'parent_id'
                );
            } else {
                $query->where(
                    'parent_id',
                    (int) $filters['parent_id']
                );
            }
        }


        /*
        |--------------------------------------------------------------------------
        | Tab Filters
        |--------------------------------------------------------------------------
        */

        if (
            $filter ===
            'archived'
        ) {
            $query->whereNotNull(
                'archived_at'
            );
        } elseif (
            $filter !==
            'trash'
        ) {
            $query->whereNull(
                'archived_at'
            );
        }


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
            'featured'
        ) {
            $query->where(
                'is_featured',
                true
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Sorting
        |--------------------------------------------------------------------------
        */

        $allowedSorts = [
            'name',
            'created_at',
            'updated_at',
            'display_order',
            'status',
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


        /*
        |--------------------------------------------------------------------------
        | Pagination
        |--------------------------------------------------------------------------
        */

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
                'name'
            )
            ->paginate(
                $perPage
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Find Category
    |--------------------------------------------------------------------------
    */

    public function findOrFail(
        int $id
    ): Category {
        return Category::query()
            ->with([
                'parent.parent',
                'children',
            ])
            ->findOrFail(
                $id
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Find Trashed Category
    |--------------------------------------------------------------------------
    */

    public function findTrashedOrFail(
        int $id
    ): Category {
        return Category::onlyTrashed()
            ->with([
                'parent.parent',
            ])
            ->findOrFail(
                $id
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Create Category
    |--------------------------------------------------------------------------
    */

    public function create(
        array $data
    ): Category {
        return Category::create(
            $data
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Update Category
    |--------------------------------------------------------------------------
    */

    public function update(
        Category $category,
        array $data
    ): Category {
        $category->update(
            $data
        );


        return $category->fresh([
            'parent.parent',
            'children',
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Soft Delete
    |--------------------------------------------------------------------------
    */

    public function delete(
        Category $category
    ): bool {
        return (bool)
            $category->delete();
    }


    /*
    |--------------------------------------------------------------------------
    | Restore From Trash
    |--------------------------------------------------------------------------
    */

    public function restore(
        Category $category
    ): bool {
        return (bool)
            $category->restore();
    }


    /*
    |--------------------------------------------------------------------------
    | Permanent Delete
    |--------------------------------------------------------------------------
    */

    public function forceDelete(
        Category $category
    ): bool {
        return (bool)
            $category->forceDelete();
    }


    /*
    |--------------------------------------------------------------------------
    | Parent Options
    |--------------------------------------------------------------------------
    */

    public function getParentOptions(
        ?int $excludeId = null
    ): Collection {
        return Category::query()
            ->whereNull(
                'archived_at'
            )
            ->when(
                $excludeId,
                fn ($query) =>
                    $query->where(
                        'id',
                        '!=',
                        $excludeId
                    )
            )
            ->with([
                'parent.parent',
            ])
            ->orderBy(
                'display_order'
            )
            ->orderBy(
                'name'
            )
            ->get();
    }
}
