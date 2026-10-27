<?php

namespace App\Repositories\Admin;

use App\Models\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection as SupportCollection;

interface CollectionRepositoryInterface
{
    /*
    |--------------------------------------------------------------------------
    | List
    |--------------------------------------------------------------------------
    */

    public function paginate(
        array $filters = []
    ): LengthAwarePaginator;

    public function getAllOrdered(): SupportCollection;


    /*
    |--------------------------------------------------------------------------
    | Find
    |--------------------------------------------------------------------------
    */

    public function findOrFail(
        int $id
    ): Collection;


    /*
    |--------------------------------------------------------------------------
    | Create / Update
    |--------------------------------------------------------------------------
    */

    public function create(
        array $data
    ): Collection;

    public function update(
        Collection $collection,
        array $data
    ): Collection;


    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    public function delete(
        Collection $collection
    ): bool;


    /*
    |--------------------------------------------------------------------------
    | Stats
    |--------------------------------------------------------------------------
    */

    public function countAll(): int;

    public function countByStatus(
        string $status
    ): int;


    /*
    |--------------------------------------------------------------------------
    | Display Position
    |--------------------------------------------------------------------------
    */

    public function getMaxDisplayPosition(): int;
}
