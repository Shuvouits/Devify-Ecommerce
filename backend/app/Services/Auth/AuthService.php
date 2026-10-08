<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Repositories\Auth\AuthRepositoryInterface;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Password;
use RuntimeException;
use Illuminate\Auth\Events\PasswordReset;


class AuthService
{
    public function __construct(
        protected AuthRepositoryInterface $authRepository
    ) {}

   public function registerCustomer(array $data): array
{
    $data['role'] = User::ROLE_CUSTOMER;
    $data['status'] = User::STATUS_ACTIVE;

    unset($data['password_confirmation']);

    $user = $this->authRepository->create($data);

    $token = auth('api')->login($user);

    return [
        'access_token' => $token,
        'token_type' => 'Bearer',
        'expires_in' => auth('api')->factory()->getTTL() * 60,
        'user' => $user,
    ];
}

    public function login(array $credentials): array
    {
        $user = $this->authRepository->findByEmail(
            $credentials['email']
        );

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['Invalid email or password.'],
            ]);
        }

        if (!$user->isActive()) {
            throw ValidationException::withMessages([
                'email' => ['Your account is not active.'],
            ]);
        }

        $token = auth('api')->attempt([
            'email' => $credentials['email'],
            'password' => $credentials['password'],
        ]);

        if (!$token) {
            throw ValidationException::withMessages([
                'email' => ['Invalid email or password.'],
            ]);
        }

        $this->authRepository->updateLastLogin($user);

        return [
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => $user->refresh(),
        ];
    }


    public function me(): User
    {
        $userId = auth('api')->id();

        $user = $this->authRepository->findById($userId);

        if (!$user) {
            throw new \RuntimeException('Authenticated user not found.');
        }

        return $user;
    }

    public function logout(): void
    {
        auth('api')->logout();
    }



    public function refresh(): array
    {
        $token = auth('api')->refresh();

        return [
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
        ];
    }

    public function forgotPassword(string $email): void
    {
        $status = Password::sendResetLink([
            'email' => $email,
        ]);

        if (
            $status !== Password::RESET_LINK_SENT &&
            $status !== Password::INVALID_USER
        ) {
            throw new RuntimeException(__($status));
        }
    }


    public function resetPassword(array $data): void
    {
        $status = Password::reset(
            [
                'email' => $data['email'],
                'password' => $data['password'],
                'password_confirmation' => $data['password_confirmation'],
                'token' => $data['token'],
            ],
            function (User $user, string $password) {
                $this->authRepository->update(
                    $user,
                    [
                        'password' => $password,
                    ]
                );

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return;
        }

        if ($status === Password::INVALID_TOKEN) {
            throw ValidationException::withMessages([
                'token' => [
                    'The password reset link is invalid or has expired.',
                ],
            ]);
        }

        throw ValidationException::withMessages([
            'email' => [
                'Unable to reset password. Please request a new reset link.',
            ],
        ]);
    }
}
