<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Brand\GenerateBrandDescriptionRequest;
use App\Services\Brand\BrandAiService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\Admin\Brand\GenerateBrandSeoRequest;

class BrandAiController extends Controller
{
    use ApiResponseTrait;


    public function __construct(
        protected BrandAiService $service
    ) {
    }


    public function generateDescription(
        GenerateBrandDescriptionRequest $request
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
            'Brand description generated successfully.'
        );
    }


    /*
|--------------------------------------------------------------------------
| Generate SEO
|--------------------------------------------------------------------------
*/

public function generateSeo(
    GenerateBrandSeoRequest $request
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
        'Brand SEO generated successfully.'
    );
}



}
