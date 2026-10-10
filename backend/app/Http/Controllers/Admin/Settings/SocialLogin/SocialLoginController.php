<?php

namespace App\Http\Controllers\Admin\Settings\SocialLogin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\SocialLogin\SocialLoginSettingRequest;
use App\Services\Settings\SocialLogin\SocialLoginService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class SocialLoginController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        protected SocialLoginService $socialLoginService
    ) {
    }


    /*
    |--------------------------------------------------------------------------
    | Get All Social Login Providers
    |--------------------------------------------------------------------------
    */

    public function index(): JsonResponse
    {
        $settings =
            $this->socialLoginService
                ->getAllSettings();

        return $this->successResponse(
            [
                'settings' => $settings,
            ],
            'Social login settings retrieved successfully.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Get Single Provider
    |--------------------------------------------------------------------------
    */

    public function show(
        string $provider
    ): JsonResponse {
        $setting =
            $this->socialLoginService
                ->getProviderSettings(
                    $provider
                );

        return $this->successResponse(
            [
                'setting' => $setting,

                'client_secret_configured' =>
                    $this->socialLoginService
                        ->hasClientSecret(
                            $setting
                        ),
            ],
            'Social login provider settings retrieved successfully.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Save / Update Provider
    |--------------------------------------------------------------------------
    */

    public function update(
        SocialLoginSettingRequest $request,
        string $provider
    ): JsonResponse {
        $setting =
            $this->socialLoginService
                ->saveProviderSettings(
                    $provider,
                    $request->validated()
                );

        return $this->successResponse(
            [
                'setting' => $setting,

                'client_secret_configured' =>
                    $this->socialLoginService
                        ->hasClientSecret(
                            $setting
                        ),
            ],
            'Social login provider settings saved successfully.'
        );
    }
}
