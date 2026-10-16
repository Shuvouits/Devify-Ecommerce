<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Brand\GenerateBrandImageRequest;
use App\Services\Brand\BrandAiImageService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class BrandAiImageController extends Controller
{
    use ApiResponseTrait;


    public function __construct(
        protected BrandAiImageService $service
    ) {
    }


    /*
    |--------------------------------------------------------------------------
    | Generate Image
    |--------------------------------------------------------------------------
    */

    public function generate(
        GenerateBrandImageRequest $request
    ): JsonResponse {
        $userId =
            auth('api')->id();


        $image =
            $this->service
                ->generate(
                    $request->validated(),
                    $userId
                );


        return $this->successResponse(
            [
                'image' =>
                    $image,
            ],
            'Brand image generated successfully.'
        );
    }
}
