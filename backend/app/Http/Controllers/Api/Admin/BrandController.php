<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Brand\CreateBrandRequest;
use App\Http\Requests\Admin\Brand\UpdateBrandRequest;
use App\Http\Requests\Admin\Brand\UploadBrandLogoRequest;
use App\Http\Resources\BrandResource;
use App\Services\Brand\BrandService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class BrandController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Constructor
    |--------------------------------------------------------------------------
    */

    public function __construct(
        protected BrandService $brandService
    ) {
    }


    /*
    |--------------------------------------------------------------------------
    | Brand List
    |--------------------------------------------------------------------------
    */

    public function index(
        Request $request
    ): JsonResponse {
        $brands =
            $this->brandService
                ->getBrands(
                    $request->only([
                        'search',
                        'filter',
                        'sort_by',
                        'sort_direction',
                        'per_page',
                    ])
                );


        $resource =
            BrandResource::collection(
                $brands
            )
                ->response()
                ->getData(true);


        return response()->json([
            'success' => true,

            'message' =>
                'Brands retrieved successfully.',

            'data' => [
                'brands' =>
                    $resource,
            ],
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Create Brand
    |--------------------------------------------------------------------------
    */

    public function store(
        CreateBrandRequest $request
    ): JsonResponse {
        $brand =
            $this->brandService
                ->createBrand(
                    $request->validated()
                );


        return response()->json([
            'success' => true,

            'message' =>
                'Brand created successfully.',

            'data' => [
                'brand' =>
                    new BrandResource(
                        $brand
                    ),
            ],
        ], 201);
    }


    /*
    |--------------------------------------------------------------------------
    | Show Brand
    |--------------------------------------------------------------------------
    */

    public function show(
        int $id
    ): JsonResponse {
        $brand =
            $this->brandService
                ->getBrand(
                    $id
                );


        return response()->json([
            'success' => true,

            'message' =>
                'Brand retrieved successfully.',

            'data' => [
                'brand' =>
                    new BrandResource(
                        $brand
                    ),
            ],
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Update Brand
    |--------------------------------------------------------------------------
    */

    public function update(
        UpdateBrandRequest $request,
        int $id
    ): JsonResponse {
        $brand =
            $this->brandService
                ->updateBrand(
                    $id,
                    $request->validated()
                );


        return response()->json([
            'success' => true,

            'message' =>
                'Brand updated successfully.',

            'data' => [
                'brand' =>
                    new BrandResource(
                        $brand
                    ),
            ],
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Upload Brand Logo
    |--------------------------------------------------------------------------
    */

    public function uploadLogo(
        UploadBrandLogoRequest $request,
        int $id
    ): JsonResponse {
        $brand =
            $this->brandService
                ->uploadLogo(
                    $id,
                    $request->file(
                        'logo'
                    )
                );


        return response()->json([
            'success' => true,

            'message' =>
                'Brand logo uploaded successfully.',

            'data' => [
                'brand' =>
                    new BrandResource(
                        $brand
                    ),
            ],
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Brand Logo
    |--------------------------------------------------------------------------
    */

    public function deleteLogo(
        int $id
    ): JsonResponse {
        $brand =
            $this->brandService
                ->deleteLogo(
                    $id
                );


        return response()->json([
            'success' => true,

            'message' =>
                'Brand logo removed successfully.',

            'data' => [
                'brand' =>
                    new BrandResource(
                        $brand
                    ),
            ],
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Brand Logo Source
    |--------------------------------------------------------------------------
    |
    | This endpoint returns the physical logo image.
    |
    | The frontend Image Studio requests this endpoint as a Blob so the
    | image becomes a local browser File before Canvas processing.
    |
    */

    public function logoSource(
        int $id
    ): BinaryFileResponse|JsonResponse {
        $brand =
            $this->brandService
                ->getBrand(
                    $id
                );


        /*
        |--------------------------------------------------------------------------
        | Logo Path Missing
        |--------------------------------------------------------------------------
        */

        if (
            blank(
                $brand->logo_path
            )
        ) {
            return response()->json([
                'success' => false,

                'message' =>
                    'Brand logo not found.',
            ], 404);
        }


        /*
        |--------------------------------------------------------------------------
        | Build Physical File Path
        |--------------------------------------------------------------------------
        */

        $relativePath =
            ltrim(
                $brand->logo_path,
                '/'
            );


        $absolutePath =
            public_path(
                $relativePath
            );


        /*
        |--------------------------------------------------------------------------
        | Physical File Missing
        |--------------------------------------------------------------------------
        */

        if (
            !file_exists(
                $absolutePath
            )
        ) {
            return response()->json([
                'success' => false,

                'message' =>
                    'Brand logo file not found.',
            ], 404);
        }


        /*
        |--------------------------------------------------------------------------
        | Determine MIME Type
        |--------------------------------------------------------------------------
        */

        $mimeType =
            mime_content_type(
                $absolutePath
            ) ?: 'image/png';


        /*
        |--------------------------------------------------------------------------
        | Return Image File
        |--------------------------------------------------------------------------
        */

        return response()->file(
            $absolutePath,
            [
                'Content-Type' =>
                    $mimeType,

                'Cache-Control' =>
                    'no-store, no-cache, must-revalidate, max-age=0',

                'Pragma' =>
                    'no-cache',

                'Expires' =>
                    '0',
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Archive Brand
    |--------------------------------------------------------------------------
    */

    public function archive(
        int $id
    ): JsonResponse {
        $brand =
            $this->brandService
                ->archiveBrand(
                    $id
                );


        return response()->json([
            'success' => true,

            'message' =>
                'Brand archived successfully.',

            'data' => [
                'brand' =>
                    new BrandResource(
                        $brand
                    ),
            ],
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Restore Brand
    |--------------------------------------------------------------------------
    */

    public function restore(
        int $id
    ): JsonResponse {
        $brand =
            $this->brandService
                ->restoreBrand(
                    $id
                );


        return response()->json([
            'success' => true,

            'message' =>
                'Brand restored successfully.',

            'data' => [
                'brand' =>
                    new BrandResource(
                        $brand
                    ),
            ],
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Brand
    |--------------------------------------------------------------------------
    */

    public function destroy(
        int $id
    ): JsonResponse {
        $this->brandService
            ->deleteBrand(
                $id
            );


        return response()->json([
            'success' => true,

            'message' =>
                'Brand deleted successfully.',
        ]);
    }
}
