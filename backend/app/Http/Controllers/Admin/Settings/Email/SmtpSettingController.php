<?php

namespace App\Http\Controllers\Admin\Settings\Email;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\Email\SmtpSettingRequest;
use App\Services\Settings\Email\SmtpSettingService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class SmtpSettingController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        protected SmtpSettingService $smtpSettingService
    ) {
    }


    public function show(): JsonResponse
    {
        $settings =
            $this->smtpSettingService->getSettings();

        return $this->successResponse(
            [
                'settings' => $settings,

                'password_configured' =>
                    $this->smtpSettingService
                        ->hasPassword($settings),
            ],
            'SMTP settings retrieved successfully.'
        );
    }


    public function update(
        SmtpSettingRequest $request
    ): JsonResponse {
        $settings =
            $this->smtpSettingService->saveSettings(
                $request->validated()
            );

        return $this->successResponse(
            [
                'settings' => $settings,

                'password_configured' =>
                    $this->smtpSettingService
                        ->hasPassword($settings),
            ],
            'SMTP settings saved successfully.'
        );
    }
}
