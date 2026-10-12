<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\VerifyTwoFactorLoginRequest;
use App\Services\Auth\AuthService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        protected AuthService $authService
    ) {
    }

    /*
    |--------------------------------------------------------------------------
    | Register
    |--------------------------------------------------------------------------
    */

    public function register(
        RegisterRequest $request
    ): JsonResponse {
        $data = $this->authService
            ->registerCustomer(
                $request->validated()
            );

        return $this->successResponse(
            $data,
            'Account created successfully.',
            201
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Login
    |--------------------------------------------------------------------------
    */

    public function login(
        LoginRequest $request
    ): JsonResponse {
        $data = $this->authService
            ->login(
                $request->validated()
            );

        /*
        |--------------------------------------------------------------------------
        | Two-Factor Authentication Required
        |--------------------------------------------------------------------------
        */

        if (
            $data['requires_two_factor']
            ?? false
        ) {
            return $this->successResponse(
                $data,
                'Two-factor authentication required.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Normal Login
        |--------------------------------------------------------------------------
        */

        return $this->successResponse(
            $data,
            'Login successful.'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Verify Login Two-Factor Challenge
    |--------------------------------------------------------------------------
    */

    public function verifyTwoFactor(
        VerifyTwoFactorLoginRequest $request
    ): JsonResponse {
        $data = $this->authService
            ->verifyTwoFactorLogin(
                $request->validated()
            );

        return $this->successResponse(
            $data,
            'Login successful.'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Authenticated User
    |--------------------------------------------------------------------------
    */

    public function me(): JsonResponse
    {
        $user = $this->authService
            ->me();

        return $this->successResponse(
            [
                'user' => $user,
            ],
            'Authenticated user retrieved successfully.'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */

    public function logout(): JsonResponse
    {
        $this->authService
            ->logout();

        return $this->successResponse(
            null,
            'Logged out successfully.'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Refresh JWT
    |--------------------------------------------------------------------------
    */

    public function refresh(): JsonResponse
    {
        $data = $this->authService
            ->refresh();

        return $this->successResponse(
            $data,
            'Token refreshed successfully.'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Forgot Password
    |--------------------------------------------------------------------------
    */

    public function forgotPassword(
        ForgotPasswordRequest $request
    ): JsonResponse {
        $this->authService
            ->forgotPassword(
                $request->validated('email')
            );

        return $this->successResponse(
            null,
            'If an account exists with this email, a password reset link has been sent.'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Reset Password
    |--------------------------------------------------------------------------
    */

    public function resetPassword(
        ResetPasswordRequest $request
    ): JsonResponse {
        $this->authService
            ->resetPassword(
                $request->validated()
            );

        return $this->successResponse(
            null,
            'Password reset successfully.'
        );
    }
}
