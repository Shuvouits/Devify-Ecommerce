<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Category\GenerateCategoryDescriptionRequest;
use App\Http\Requests\Admin\Category\GenerateCategorySeoRequest;
use App\Services\Category\CategoryAiService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class CategoryAiController extends Controller
{
    use ApiResponseTrait;


    public function __construct(
        protected CategoryAiService $service
    ) {
    }


    public function generateDescription(
        GenerateCategoryDescriptionRequest $request
    ): JsonResponse {
        $data = $request->validated();

        $description =
            $this->service
                ->generateDescription(
                    $data
                );

        return $this->successResponse(
            [
                'description' => $description,
                'tone' => $data['tone'],
            ],
            'Category description generated successfully.'
        );
    }


    public function generateSeo(
        GenerateCategorySeoRequest $request
    ): JsonResponse {
        $data = $request->validated();

        $seo =
            $this->service
                ->generateSeo(
                    $data
                );

        return $this->successResponse(
            [
                'seo' => $seo,
                'tone' => $data['tone'],
            ],
            'Category SEO generated successfully.'
        );
    }
}
