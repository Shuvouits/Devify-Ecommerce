<?php

namespace App\Repositories\Admin;

use App\Models\GlobalVariant;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface GlobalVariantRepositoryInterface
{
    public function paginate(
        array $filters = []
    ): LengthAwarePaginator;


    public function getAllOrdered(): Collection;


    public function findOrFail(
        int $id
    ): GlobalVariant;


    public function create(
        array $data
    ): GlobalVariant;


    public function update(
        GlobalVariant $globalVariant,
        array $data
    ): GlobalVariant;


    public function delete(
        GlobalVariant $globalVariant
    ): bool;


    public function syncOptions(
        GlobalVariant $globalVariant,
        array $options
    ): GlobalVariant;


    public function countAll(): int;


    public function countActive(): int;


    public function getMaxDisplayOrder(): int;
}
