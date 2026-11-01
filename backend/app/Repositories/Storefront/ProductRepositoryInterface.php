<?php

namespace App\Repositories\Storefront;

use App\Models\Product;
use Illuminate\Support\Collection;

interface ProductRepositoryInterface
{
    public function getProductsByIds(
        array $productIds
    ): Collection;

    public function findForStorefront(
        int $id
    ): Product;
}
