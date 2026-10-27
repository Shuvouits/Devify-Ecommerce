<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\Product\AnalyzeProductSeoRequest;
use App\Services\Product\ProductSeoService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class ProductSeoController extends Controller
{
    use ApiResponseTrait;


    public function __construct(
        protected ProductSeoService $service
    ) {
    }


    /*
    |--------------------------------------------------------------------------
    | Analyze SEO
    |--------------------------------------------------------------------------
    */

    public function analyze(
        AnalyzeProductSeoRequest $request
    ): JsonResponse {
        $analysis =
            $this->service
                ->analyze(
                    $request->validated()
                );


        return $this->successResponse(
            [
                'seo_analysis' =>
                    $analysis,
            ],
            'Product SEO analyzed successfully.'
        );
    }
}
