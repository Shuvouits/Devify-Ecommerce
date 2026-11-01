<?php

namespace App\Services\Storefront;

use App\Http\Resources\ProductResource;
use App\Repositories\Storefront\ProductRepositoryInterface;

class ProductService
{
    public function __construct(
        protected ProductRepositoryInterface $productRepository
    ) {
    }

    public function getSelectedProducts(
        array $productIds,
        int $limit = 8
    ): array {
        $limit = max(
            1,
            min($limit, 24)
        );

        $productIds = array_slice(
            array_values(
                array_unique(
                    array_map(
                        'intval',
                        array_filter($productIds)
                    )
                )
            ),
            0,
            $limit
        );

        $products =
            $this->productRepository
                ->getProductsByIds(
                    $productIds
                );

        return ProductResource::collection(
            $products
        )->resolve();
    }

    public function getProductQuickView(
        int $id
    ): array {
        $product =
            $this->productRepository
                ->findForStorefront(
                    $id
                );

        return (
            new ProductResource(
                $product
            )
        )->resolve();
    }
}
