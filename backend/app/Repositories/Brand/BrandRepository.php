<?php

namespace App\Repositories\Brand;

use App\Models\Brand;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class BrandRepository implements BrandRepositoryInterface
{
    public function paginate(
        array $filters
    ): LengthAwarePaginator {
        $query = Brand::query();


        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */

        if (!empty($filters['search'])) {
            $search = trim(
                $filters['search']
            );

            $query->where(function ($builder) use ($search) {
                $builder
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
                    ->orWhere(
                        'website',
                        'like',
                        "%{$search}%"
                    );
            });
        }


        /*
        |--------------------------------------------------------------------------
        | Tab Filter
        |--------------------------------------------------------------------------
        */

        $filter =
            $filters['filter'] ??
            'all';


        switch ($filter) {
            case 'active':
                $query->active();
                break;

            case 'pending':
                $query->pending();
                break;

            case 'featured':
                $query->featured();
                break;

            case 'inactive':
                $query->inactive();
                break;

            case 'rejected':
                $query->rejected();
                break;

            case 'archived':
                $query->archived();
                break;

            default:
                $query->whereNull(
                    'archived_at'
                );
                break;
        }


        /*
        |--------------------------------------------------------------------------
        | Sorting
        |--------------------------------------------------------------------------
        */

        $sortBy =
            $filters['sort_by'] ??
            'display_order';

        $sortDirection =
            strtolower(
                $filters['sort_direction'] ??
                'asc'
            );


        $allowedSortColumns = [
            'name',
            'display_order',
            'created_at',
            'updated_at',
        ];


        if (
            !in_array(
                $sortBy,
                $allowedSortColumns,
                true
            )
        ) {
            $sortBy =
                'display_order';
        }


        if (
            !in_array(
                $sortDirection,
                ['asc', 'desc'],
                true
            )
        ) {
            $sortDirection =
                'asc';
        }


        $query
            ->orderBy(
                $sortBy,
                $sortDirection
            )
            ->orderBy(
                'id',
                'desc'
            );


        return $query->paginate(
            max(
                1,
                min(
                    (int) (
                        $filters['per_page'] ??
                        15
                    ),
                    100
                )
            )
        );
    }


    public function findById(
        int $id
    ): Brand {
        return Brand::query()
            ->findOrFail($id);
    }


    public function create(
        array $data
    ): Brand {
        return Brand::query()
            ->create($data);
    }


    public function update(
        Brand $brand,
        array $data
    ): Brand {
        $brand->update($data);

        return $brand->fresh();
    }


    public function archive(
        Brand $brand
    ): Brand {
        $brand->update([
            'archived_at' => now(),
        ]);

        return $brand->fresh();
    }


    public function restore(
        Brand $brand
    ): Brand {
        $brand->update([
            'archived_at' => null,
        ]);

        return $brand->fresh();
    }


    public function delete(
        Brand $brand
    ): void {
        $brand->delete();
    }


    public function slugExists(
        string $slug,
        ?int $ignoreId = null
    ): bool {
        $query = Brand::withTrashed()
            ->where(
                'slug',
                $slug
            );


        if ($ignoreId) {
            $query->where(
                'id',
                '!=',
                $ignoreId
            );
        }


        return $query->exists();
    }
}
