<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Brand\AnalyzeBrandSeoRequest;
use App\Services\Brand\BrandSeoService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class BrandSeoController extends Controller
{
    use ApiResponseTrait;


    public function __construct(
        protected BrandSeoService $service
    ) {
    }


    public function analyze(
        AnalyzeBrandSeoRequest $request
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
            'Brand SEO analyzed successfully.'
        );
    }
}
