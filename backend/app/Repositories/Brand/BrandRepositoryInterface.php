<?php

namespace App\Repositories\Brand;

use App\Models\Brand;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface BrandRepositoryInterface
{
    public function paginate(array $filters): LengthAwarePaginator;

    public function findById(int $id): Brand;

    public function create(array $data): Brand;

    public function update(
        Brand $brand,
        array $data
    ): Brand;

    public function archive(Brand $brand): Brand;

    public function restore(Brand $brand): Brand;

    public function delete(Brand $brand): void;

    public function slugExists(
        string $slug,
        ?int $ignoreId = null
    ): bool;
}
