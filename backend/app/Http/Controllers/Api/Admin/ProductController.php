<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\Product\StoreProductRequest;
use App\Http\Requests\Api\Admin\Product\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Services\Admin\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests\Api\Admin\Product\UploadProductImageRequest;

use App\Http\Requests\Api\Admin\Product\DeleteProductImageRequest;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService
    ) {
    }


    /*
    |--------------------------------------------------------------------------
    | Product List
    |--------------------------------------------------------------------------
    */

    public function index(
        Request $request
    ): JsonResponse {
        $products =
            $this->productService
                ->getProducts([
                    'search' =>
                        $request->query('search'),

                    'status' =>
                        $request->query('status'),

                    'brand_id' =>
                        $request->query('brand_id'),

                    'category_id' =>
                        $request->query('category_id'),

                    'vendor_id' =>
                        $request->query('vendor_id'),

                    'is_featured' =>
                        $request->query('is_featured'),

                    'preorder_enabled' =>
                        $request->query('preorder_enabled'),

                    'publish_online_store' =>
                        $request->query(
                            'publish_online_store'
                        ),

                    'sort_by' =>
                        $request->query('sort_by'),

                    'sort_direction' =>
                        $request->query(
                            'sort_direction'
                        ),

                    'per_page' =>
                        $request->query(
                            'per_page',
                            20
                        ),
                ]);

        return response()->json([
            'success' => true,

            'message' =>
                'Products retrieved successfully.',

            'data' =>
                ProductResource::collection(
                    $products->getCollection()
                ),

            'meta' => [
                'current_page' =>
                    $products->currentPage(),

                'last_page' =>
                    $products->lastPage(),

                'per_page' =>
                    $products->perPage(),

                'total' =>
                    $products->total(),

                'from' =>
                    $products->firstItem(),

                'to' =>
                    $products->lastItem(),
            ],

            'stats' =>
                $this->productService
                    ->getStats(),
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Product Select List
    |--------------------------------------------------------------------------
    */

    public function select(
        Request $request
    ): JsonResponse {
        $products =
            $this->productService
                ->getProductsForSelect([
                    'status' =>
                        $request->query('status'),

                    'vendor_id' =>
                        $request->query(
                            'vendor_id'
                        ),
                ]);

        return response()->json([
            'success' => true,

            'message' =>
                'Product options retrieved successfully.',

            'data' =>
                $products
                    ->map(
                        fn ($product) => [
                            'id' =>
                                $product->id,

                            'title' =>
                                $product->title,

                            'slug' =>
                                $product->slug,

                            'status' =>
                                $product->status,

                            'brand' =>
                                $product->brand
                                    ? [
                                        'id' =>
                                            $product
                                                ->brand
                                                ->id,

                                        'name' =>
                                            $product
                                                ->brand
                                                ->name,
                                    ]
                                    : null,

                            'category' =>
                                $product->category
                                    ? [
                                        'id' =>
                                            $product
                                                ->category
                                                ->id,

                                        'name' =>
                                            $product
                                                ->category
                                                ->name,
                                    ]
                                    : null,
                        ]
                    )
                    ->values(),
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Product Stats
    |--------------------------------------------------------------------------
    */

    public function stats(): JsonResponse
    {
        return response()->json([
            'success' => true,

            'message' =>
                'Product statistics retrieved successfully.',

            'data' =>
                $this->productService
                    ->getStats(),
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Create Product
    |--------------------------------------------------------------------------
    */

    public function store(
        StoreProductRequest $request
    ): JsonResponse {
        $product =
            $this->productService
                ->createProduct(
                    $request->validated(),
                    auth()->id()
                );

        return response()->json([
            'success' => true,

            'message' =>
                'Product created successfully.',

            'data' =>
                new ProductResource(
                    $product
                ),
        ], 201);
    }


    /*
    |--------------------------------------------------------------------------
    | Product Details
    |--------------------------------------------------------------------------
    */

    public function show(
        int $id
    ): JsonResponse {
        $product =
            $this->productService
                ->getProduct($id);

        return response()->json([
            'success' => true,

            'message' =>
                'Product retrieved successfully.',

            'data' =>
                new ProductResource(
                    $product
                ),
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Update Product
    |--------------------------------------------------------------------------
    */

    public function update(
        UpdateProductRequest $request,
        int $id
    ): JsonResponse {
        $product =
            $this->productService
                ->updateProduct(
                    $id,
                    $request->validated()
                );

        return response()->json([
            'success' => true,

            'message' =>
                'Product updated successfully.',

            'data' =>
                new ProductResource(
                    $product
                ),
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Product
    |--------------------------------------------------------------------------
    */

    public function destroy(
        int $id
    ): JsonResponse {
        $this->productService
            ->deleteProduct($id);

        return response()->json([
            'success' => true,

            'message' =>
                'Product deleted successfully.',
        ]);
    }


    public function uploadImage(
    UploadProductImageRequest $request
): JsonResponse {
    $result =
        $this->productService
            ->uploadProductImage(
                $request->file('image'),
                $request->input('product_title')
            );

    return response()->json([
        'success' => true,

        'message' =>
            'Product image uploaded successfully.',

        'data' =>
            $result,
    ]);
}


public function deleteImage(
    DeleteProductImageRequest $request
): JsonResponse {
    $this->productService
        ->deleteProductImage(
            $request->validated('path')
        );

    return response()->json([
        'success' => true,
        'message' => 'Product image deleted successfully.',
    ]);
}



}
