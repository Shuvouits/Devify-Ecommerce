<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\Product\GenerateProductDescriptionRequest;
use App\Http\Requests\Api\Admin\Product\GenerateProductSeoRequest;
use App\Services\Product\ProductAiService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class ProductAiController extends Controller
{
    use ApiResponseTrait;


    public function __construct(
        protected ProductAiService $service
    ) {
    }


    /*
    |--------------------------------------------------------------------------
    | Generate Description
    |--------------------------------------------------------------------------
    */

    public function generateDescription(
        GenerateProductDescriptionRequest $request
    ): JsonResponse {
        $data =
            $request->validated();


        $description =
            $this->service
                ->generateDescription(
                    $data
                );


        return $this->successResponse(
            [
                'description' =>
                    $description,

                'tone' =>
                    $data['tone'],
            ],
            'Product description generated successfully.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Generate SEO
    |--------------------------------------------------------------------------
    */

    public function generateSeo(
        GenerateProductSeoRequest $request
    ): JsonResponse {
        $data =
            $request->validated();


        $seo =
            $this->service
                ->generateSeo(
                    $data
                );


        return $this->successResponse(
            [
                'seo' =>
                    $seo,

                'tone' =>
                    $data['tone'],
            ],
            'Product SEO generated successfully.'
        );
    }
}
