<?php

namespace App\Repositories\Admin;

use App\Models\Location;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface LocationRepositoryInterface
{
    public function paginate(
        array $filters = []
    ): LengthAwarePaginator;


    public function findOrFail(
        int $id
    ): Location;


    public function create(
        array $data
    ): Location;


    public function update(
        Location $location,
        array $data
    ): Location;


    public function delete(
        Location $location
    ): bool;


    public function clearDefaultExcept(
        ?int $exceptId = null
    ): void;


    public function getActiveForDeliveryOrder(): Collection;


    public function updateDeliveryOrder(
        int $id,
        int $deliveryOrder
    ): bool;


    public function countAll(): int;


    public function countByStatus(
        string $status
    ): int;
}
