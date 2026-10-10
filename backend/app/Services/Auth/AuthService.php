<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Repositories\Auth\AuthRepositoryInterface;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class AuthService
{
    public function __construct(
        protected AuthRepositoryInterface $authRepository
    ) {
    }


    /*
    |--------------------------------------------------------------------------
    | Register Customer
    |--------------------------------------------------------------------------
    */

    public function registerCustomer(array $data): array
    {
        $data['role'] =
            User::ROLE_CUSTOMER;

        $data['status'] =
            User::STATUS_ACTIVE;


        unset(
            $data['password_confirmation']
        );


        $user =
            $this->authRepository
                ->create($data);


        /*
        |--------------------------------------------------------------------------
        | Attach Social Avatar
        |--------------------------------------------------------------------------
        */

        $user =
            $this->attachSocialAvatar(
                $user
            );


        /*
        |--------------------------------------------------------------------------
        | Generate JWT
        |--------------------------------------------------------------------------
        */

        $token =
            auth('api')->login(
                $user
            );


        return [
            'access_token' =>
                $token,

            'token_type' =>
                'Bearer',

            'expires_in' =>
                auth('api')
                    ->factory()
                    ->getTTL() * 60,

            'user' =>
                $user,
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | Login
    |--------------------------------------------------------------------------
    */

    public function login(
        array $credentials
    ): array {
        $user =
            $this->authRepository
                ->findByEmail(
                    $credentials['email']
                );


        /*
        |--------------------------------------------------------------------------
        | User Exists
        |--------------------------------------------------------------------------
        */

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => [
                    'Invalid email or password.',
                ],
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | Account Status
        |--------------------------------------------------------------------------
        */

        if (! $user->isActive()) {
            throw ValidationException::withMessages([
                'email' => [
                    'Your account is not active.',
                ],
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | Authenticate
        |--------------------------------------------------------------------------
        */

        $token =
            auth('api')->attempt([
                'email' =>
                    $credentials['email'],

                'password' =>
                    $credentials['password'],
            ]);


        if (! $token) {
            throw ValidationException::withMessages([
                'email' => [
                    'Invalid email or password.',
                ],
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | Update Last Login
        |--------------------------------------------------------------------------
        */

        $this->authRepository
            ->updateLastLogin(
                $user
            );


        /*
        |--------------------------------------------------------------------------
        | Refresh User
        |--------------------------------------------------------------------------
        */

        $user =
            $user->refresh();


        /*
        |--------------------------------------------------------------------------
        | Attach Social Avatar
        |--------------------------------------------------------------------------
        */

        $user =
            $this->attachSocialAvatar(
                $user
            );


        return [
            'access_token' =>
                $token,

            'token_type' =>
                'Bearer',

            'expires_in' =>
                auth('api')
                    ->factory()
                    ->getTTL() * 60,

            'user' =>
                $user,
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | Authenticated User
    |--------------------------------------------------------------------------
    */

    public function me(): User
    {
        $userId =
            auth('api')->id();


        if (! $userId) {
            throw new RuntimeException(
                'Authenticated user not found.'
            );
        }


        $user =
            $this->authRepository
                ->findById(
                    (int) $userId
                );


        if (! $user) {
            throw new RuntimeException(
                'Authenticated user not found.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Attach Social Avatar
        |--------------------------------------------------------------------------
        */

        return $this->attachSocialAvatar(
            $user
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */

    public function logout(): void
    {
        auth('api')->logout();
    }


    /*
    |--------------------------------------------------------------------------
    | Refresh JWT
    |--------------------------------------------------------------------------
    */

    public function refresh(): array
    {
        $token =
            auth('api')->refresh();


        return [
            'access_token' =>
                $token,

            'token_type' =>
                'Bearer',

            'expires_in' =>
                auth('api')
                    ->factory()
                    ->getTTL() * 60,
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | Forgot Password
    |--------------------------------------------------------------------------
    */

    public function forgotPassword(
        string $email
    ): void {
        $status =
            Password::sendResetLink([
                'email' =>
                    $email,
            ]);


        if (
            $status !==
                Password::RESET_LINK_SENT &&
            $status !==
                Password::INVALID_USER
        ) {
            throw new RuntimeException(
                __($status)
            );
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Reset Password
    |--------------------------------------------------------------------------
    */

    public function resetPassword(
        array $data
    ): void {
        $status =
            Password::reset(
                [
                    'email' =>
                        $data['email'],

                    'password' =>
                        $data['password'],

                    'password_confirmation' =>
                        $data['password_confirmation'],

                    'token' =>
                        $data['token'],
                ],

                function (
                    User $user,
                    string $password
                ) {
                    $this->authRepository
                        ->update(
                            $user,
                            [
                                'password' =>
                                    $password,
                            ]
                        );


                    event(
                        new PasswordReset(
                            $user
                        )
                    );
                }
            );


        if (
            $status ===
            Password::PASSWORD_RESET
        ) {
            return;
        }


        if (
            $status ===
            Password::INVALID_TOKEN
        ) {
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


    /*
    |--------------------------------------------------------------------------
    | Attach Social Avatar
    |--------------------------------------------------------------------------
    */

    private function attachSocialAvatar(
        User $user
    ): User {
        /*
        |--------------------------------------------------------------------------
        | Load Social Accounts Relation
        |--------------------------------------------------------------------------
        */

        $user->loadMissing(
            'socialAccounts'
        );


        /*
        |--------------------------------------------------------------------------
        | Find Google Account
        |--------------------------------------------------------------------------
        */

        $googleAccount =
            $user->socialAccounts
                ->firstWhere(
                    'provider',
                    'google'
                );


        /*
        |--------------------------------------------------------------------------
        | Add Avatar To User Response
        |--------------------------------------------------------------------------
        */

        $user->setAttribute(
            'avatar',
            $googleAccount?->avatar_url
        );


        /*
        |--------------------------------------------------------------------------
        | Hide Social Account Relation From Response
        |--------------------------------------------------------------------------
        */

        $user->unsetRelation(
            'socialAccounts'
        );


        return $user;
    }
}
