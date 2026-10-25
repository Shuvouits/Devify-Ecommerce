<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\GlobalVariant\StoreGlobalVariantRequest;
use App\Http\Requests\Api\Admin\GlobalVariant\UpdateGlobalVariantRequest;
use App\Http\Resources\GlobalVariantResource;
use App\Services\Admin\GlobalVariantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class GlobalVariantController extends Controller
{
    public function __construct(
        protected GlobalVariantService $globalVariantService
    ) {
    }


    /*
    |--------------------------------------------------------------------------
    | Global Variant List
    |--------------------------------------------------------------------------
    */

    public function index(
        Request $request
    ): AnonymousResourceCollection {
        $variants =
            $this->globalVariantService
                ->getVariants(
                    $request->only([
                        'search',
                        'visual_type',
                        'is_active',
                        'sort_by',
                        'sort_direction',
                        'per_page',
                    ])
                );

        $stats =
            $this->globalVariantService
                ->getStats();

        return GlobalVariantResource::collection(
            $variants
        )->additional([
            'stats' => $stats,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Ordered List
    |--------------------------------------------------------------------------
    */

    public function ordered(): AnonymousResourceCollection
    {
        $variants =
            $this->globalVariantService
                ->getOrderedVariants();

        return GlobalVariantResource::collection(
            $variants
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Create Global Variant
    |--------------------------------------------------------------------------
    */

    public function store(
        StoreGlobalVariantRequest $request
    ): JsonResponse {
        $variant =
            $this->globalVariantService
                ->createVariant(
                    $request->validated(),
                    auth('api')->id()
                );

        return response()->json([
            'message' =>
                'Global variant created successfully.',

            'data' =>
                new GlobalVariantResource(
                    $variant
                ),
        ], 201);
    }


    /*
    |--------------------------------------------------------------------------
    | Show Global Variant
    |--------------------------------------------------------------------------
    */

    public function show(
        int $id
    ): GlobalVariantResource {
        $variant =
            $this->globalVariantService
                ->getVariant(
                    $id
                );

        return new GlobalVariantResource(
            $variant
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Update Global Variant
    |--------------------------------------------------------------------------
    */

    public function update(
        UpdateGlobalVariantRequest $request,
        int $id
    ): JsonResponse {
        $variant =
            $this->globalVariantService
                ->updateVariant(
                    $id,
                    $request->validated()
                );

        return response()->json([
            'message' =>
                'Global variant updated successfully.',

            'data' =>
                new GlobalVariantResource(
                    $variant
                ),
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Global Variant
    |--------------------------------------------------------------------------
    */

    public function destroy(
        int $id
    ): JsonResponse {
        $this->globalVariantService
            ->deleteVariant(
                $id
            );

        return response()->json([
            'message' =>
                'Global variant deleted successfully.',
        ]);
    }
}
