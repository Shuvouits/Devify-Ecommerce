<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\SocialExchangeRequest;
use App\Services\Auth\SocialLogin\SocialAuthService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Throwable;

class SocialAuthController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        protected SocialAuthService $socialAuthService
    ) {
    }


    /*
    |--------------------------------------------------------------------------
    | Redirect To Google
    |--------------------------------------------------------------------------
    */

    public function redirect(
        string $provider
    ): RedirectResponse {
        try {
            return $this->socialAuthService
                ->redirect($provider);

        } catch (Throwable $exception) {
            report($exception);

            return redirect(
                config('app.frontend_url')
                . '/login?social_error=provider_unavailable'
            );
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Google Callback
    |--------------------------------------------------------------------------
    */

    public function callback(
        string $provider
    ): RedirectResponse {
        try {
            $code =
                $this->socialAuthService
                    ->handleCallback(
                        $provider
                    );

            return redirect(
                config('app.frontend_url')
                . '/auth/social/callback?code='
                . urlencode($code)
            );

        } catch (Throwable $exception) {
            report($exception);

            return redirect(
                config('app.frontend_url')
                . '/login?social_error=authentication_failed'
            );
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Exchange Code For JWT
    |--------------------------------------------------------------------------
    */

    public function exchange(
        SocialExchangeRequest $request
    ): JsonResponse {
        $data =
            $this->socialAuthService
                ->exchangeCode(
                    $request->validated()['code']
                );

        return $this->successResponse(
            $data,
            'Social login successful.'
        );
    }
}
