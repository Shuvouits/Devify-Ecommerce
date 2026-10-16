<?php

namespace App\Http\Controllers\Api\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Settings\UpdateAiSettingRequest;
use App\Services\Ai\AiSettingService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class AiSettingController extends Controller
{
    use ApiResponseTrait;


    public function __construct(
        protected AiSettingService $service
    ) {
    }


    public function show(): JsonResponse
    {
        return $this->successResponse(
            [
                'ai_settings' =>
                    $this->service
                        ->getSettings(),
            ],
            'AI configuration retrieved successfully.'
        );
    }


    public function update(
        UpdateAiSettingRequest $request
    ): JsonResponse {
        return $this->successResponse(
            [
                'ai_settings' =>
                    $this->service
                        ->updateSettings(
                            $request->validated()
                        ),
            ],
            'AI configuration updated successfully.'
        );
    }
}
