<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Services\Admin\HomepageSectionService;
use App\Services\Storefront\ProductService;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService,
        protected HomepageSectionService $homepageSectionService
    ) {
    }

    public function onSale(): JsonResponse
    {
        $section =
            $this->homepageSectionService
                ->getSection(
                    'products_on_sale'
                );

        $settings =
            is_array($section->settings)
                ? $section->settings
                : [];

        $productIds =
            is_array(
                $settings['product_ids'] ?? null
            )
                ? $settings['product_ids']
                : [];

        $products =
            $this->productService
                ->getSelectedProducts(
                    $productIds,
                    $section->item_limit
                );

        return response()->json([
            'success' => true,

            'section' => [
                'section_key' =>
                    $section->section_key,

                'is_active' =>
                    $section->is_active,

                'item_limit' =>
                    $section->item_limit,

                'settings' => [
                    'product_ids' =>
                        array_values(
                            $productIds
                        ),
                ],
            ],

            'data' =>
                $products,
        ]);
    }

    public function quickView(
        int $id
    ): JsonResponse {
        $product =
            $this->productService
                ->getProductQuickView(
                    $id
                );

        return response()->json([
            'success' => true,
            'data' => $product,
        ]);
    }
}
