<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Services\Auth\AuthService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;


class AuthController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        protected AuthService $authService
    ) {
    }

    public function register(RegisterRequest $request): JsonResponse
{
    $data = $this->authService->registerCustomer(
        $request->validated()
    );

    return $this->successResponse(
        $data,
        'Account created successfully.',
        201
    );
}

    public function login(LoginRequest $request): JsonResponse
    {
        $data = $this->authService->login(
            $request->validated()
        );

        return $this->successResponse(
            $data,
            'Login successful.'
        );
    }

    public function me(): JsonResponse
{
    $user = $this->authService->me();

    return $this->successResponse(
        [
            'user' => $user,
        ],
        'Authenticated user retrieved successfully.'
    );
}



public function logout(): JsonResponse
{
    $this->authService->logout();

    return $this->successResponse(
        null,
        'Logged out successfully.'
    );
}


public function refresh(): JsonResponse
{
    $data = $this->authService->refresh();

    return $this->successResponse(
        $data,
        'Token refreshed successfully.'
    );
}

public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
{
    $this->authService->forgotPassword(
        $request->validated('email')
    );

    return $this->successResponse(
        null,
        'If an account exists with this email, a password reset link has been sent.'
    );
}

public function resetPassword(ResetPasswordRequest $request): JsonResponse
{
    $this->authService->resetPassword(
        $request->validated()
    );

    return $this->successResponse(
        null,
        'Password reset successfully.'
    );
}


}
