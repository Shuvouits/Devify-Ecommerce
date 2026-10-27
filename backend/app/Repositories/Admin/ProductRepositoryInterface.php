<?php

namespace App\Repositories\Admin;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface ProductRepositoryInterface
{
    /*
    |--------------------------------------------------------------------------
    | Product List
    |--------------------------------------------------------------------------
    */

    public function paginate(
        array $filters = []
    ): LengthAwarePaginator;

    public function getAllForSelect(
        array $filters = []
    ): Collection;


    /*
    |--------------------------------------------------------------------------
    | Find Product
    |--------------------------------------------------------------------------
    */

    public function findOrFail(
        int $id
    ): Product;


    /*
    |--------------------------------------------------------------------------
    | Core Product
    |--------------------------------------------------------------------------
    */

    public function create(
        array $data
    ): Product;

    public function update(
        Product $product,
        array $data
    ): Product;

    public function delete(
        Product $product
    ): bool;


    /*
    |--------------------------------------------------------------------------
    | Collections
    |--------------------------------------------------------------------------
    */

    public function syncCollections(
        Product $product,
        array $collections
    ): void;


    /*
    |--------------------------------------------------------------------------
    | Product Media
    |--------------------------------------------------------------------------
    */

    public function syncMedia(
        Product $product,
        array $media
    ): void;


    /*
    |--------------------------------------------------------------------------
    | Global Variant Configuration
    |--------------------------------------------------------------------------
    */

    public function syncGlobalVariants(
        Product $product,
        array $globalVariants
    ): void;


    /*
    |--------------------------------------------------------------------------
    | Sellable Product Variants
    |--------------------------------------------------------------------------
    */

   public function syncVariants(
    Product $product,
    array $variants
): array;


    /*
    |--------------------------------------------------------------------------
    | Inventory
    |--------------------------------------------------------------------------
    */

    public function syncInventories(
        Product $product,
        array $inventories
    ): void;


    /*
    |--------------------------------------------------------------------------
    | Stats
    |--------------------------------------------------------------------------
    */

    public function countAll(): int;

    public function countByStatus(
        string $status
    ): int;

    public function countFeatured(): int;

    public function countPreorder(): int;
}
