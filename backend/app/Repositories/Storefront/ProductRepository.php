<?php

namespace App\Repositories\Storefront;

use App\Models\Product;
use Illuminate\Support\Collection;

class ProductRepository implements ProductRepositoryInterface
{
    public function getProductsByIds(
        array $productIds
    ): Collection {
        $productIds = array_values(
            array_unique(
                array_map(
                    'intval',
                    array_filter($productIds)
                )
            )
        );

        if (empty($productIds)) {
            return collect();
        }

        $products = Product::query()
            ->whereIn('id', $productIds)
            ->where('status', 'active')
            ->where('publish_online_store', true)
            ->with([
                'brand:id,name,slug',
                'category:id,name,slug',

                'media' => function ($query) {
                    $query
                        ->orderByDesc('is_cover')
                        ->orderBy('display_order')
                        ->orderBy('id');
                },

                'globalVariants' => function ($query) {
                    $query
                        ->orderBy(
                            'product_global_variants.display_order'
                        );
                },

                'globalVariants.options' => function ($query) {
                    $query
                        ->where('is_active', true)
                        ->orderBy('display_order');
                },

                'globalVariantOptions.globalVariant',
                'globalVariantOptions.globalVariantOption',

                'variants' => function ($query) {
                    $query
                        ->where('is_active', true)
                        ->orderBy('display_order')
                        ->orderBy('id');
                },

                'variants.optionValues.globalVariant',
                'variants.optionValues.globalVariantOption',
                'variants.inventories.location',
                'inventories.location',
            ])
            ->withCount('variants')
            ->get()
            ->keyBy('id');

        return collect($productIds)
            ->map(
                fn ($id) =>
                    $products->get($id)
            )
            ->filter()
            ->values();
    }

    public function findForStorefront(
        int $id
    ): Product {
        return Product::query()
            ->where('status', 'active')
            ->where('publish_online_store', true)
            ->with([
                'brand:id,name,slug',
                'category:id,name,slug',
                'collections',

                'media' => function ($query) {
                    $query
                        ->orderByDesc('is_cover')
                        ->orderBy('display_order')
                        ->orderBy('id');
                },

                'globalVariants' => function ($query) {
                    $query
                        ->orderBy(
                            'product_global_variants.display_order'
                        );
                },

                'globalVariants.options' => function ($query) {
                    $query
                        ->where('is_active', true)
                        ->orderBy('display_order');
                },

                'globalVariantOptions.globalVariant',
                'globalVariantOptions.globalVariantOption',

                'variants' => function ($query) {
                    $query
                        ->where('is_active', true)
                        ->orderBy('display_order')
                        ->orderBy('id');
                },

                'variants.optionValues.globalVariant',
                'variants.optionValues.globalVariantOption',
                'variants.inventories.location',
                'inventories.location',
            ])
            ->withCount([
                'variants',
                'collections',
            ])
            ->findOrFail($id);
    }
}
