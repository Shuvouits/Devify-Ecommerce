<?php

namespace App\Http\Controllers\Api\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Repositories\Ai\AiSettingRepositoryInterface;
use App\Services\Ai\OpenRouterService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class AiImageModelController extends Controller
{
    use ApiResponseTrait;


    public function __construct(
        protected OpenRouterService $openRouter,
        protected AiSettingRepositoryInterface $repository
    ) {
    }


    public function index(): JsonResponse
    {
        $models =
            $this->openRouter
                ->getImageModels();


        $settings =
            $this->repository
                ->getSettings();


        return $this->successResponse(
            [
                'models' =>
                    $models,

                'selected_model' =>
                    $settings?->image_model,

                'count' =>
                    count($models),
            ],
            'OpenRouter image models retrieved successfully.'
        );
    }
}
