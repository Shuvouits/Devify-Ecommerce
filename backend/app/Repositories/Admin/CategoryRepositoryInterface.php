<?php

namespace App\Repositories\Admin;

use App\Models\Category;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface CategoryRepositoryInterface
{
    public function paginate(
        array $filters = []
    ): LengthAwarePaginator;


    public function findOrFail(
        int $id
    ): Category;


    public function findTrashedOrFail(
        int $id
    ): Category;


    public function create(
        array $data
    ): Category;


    public function update(
        Category $category,
        array $data
    ): Category;


    public function delete(
        Category $category
    ): bool;


    public function restore(
        Category $category
    ): bool;


    public function forceDelete(
        Category $category
    ): bool;


    public function getParentOptions(
        ?int $excludeId = null
    ): Collection;
}
