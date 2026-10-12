<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Repositories\Auth\AuthRepositoryInterface;
use App\Services\TwoFactor\TwoFactorService;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class AuthService
{
    private const TWO_FACTOR_CHALLENGE_PREFIX =
        'two_factor_login:';

    private const TWO_FACTOR_CHALLENGE_MINUTES =
        5;


    public function __construct(
        protected AuthRepositoryInterface $authRepository,
        protected TwoFactorService $twoFactorService
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


        $user =
            $this->attachSocialAvatar(
                $user
            );


        $token =
            auth('api')->login(
                $user
            );


        return $this->buildTokenResponse(
            $token,
            $user
        );
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
        | Verify Password
        |--------------------------------------------------------------------------
        |
        | auth()->attempt() use korchi na.
        | attempt() immediately JWT issue kore.
        |
        | 2FA complete howar age JWT issue kora jabe na.
        |
        */

        if (
            ! Hash::check(
                $credentials['password'],
                $user->password
            )
        ) {
            throw ValidationException::withMessages([
                'email' => [
                    'Invalid email or password.',
                ],
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | Check Two-Factor Authentication
        |--------------------------------------------------------------------------
        */

        $twoFactorStatus =
            $this->twoFactorService
                ->getStatus(
                    $user
                );


        if (
            $twoFactorStatus['enabled']
            ?? false
        ) {
            return $this->createTwoFactorChallenge(
                $user
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Normal Login
        |--------------------------------------------------------------------------
        */

        return $this->completeLogin(
            $user
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Verify Two-Factor Login
    |--------------------------------------------------------------------------
    */

    public function verifyTwoFactorLogin(
        array $data
    ): array {
        $challengeToken =
            $data['challenge_token'];


        $cacheKey =
            $this->getTwoFactorChallengeCacheKey(
                $challengeToken
            );


        $challenge =
            Cache::get(
                $cacheKey
            );


        /*
        |--------------------------------------------------------------------------
        | Challenge Exists
        |--------------------------------------------------------------------------
        */

        if (
            ! is_array($challenge) ||
            empty($challenge['user_id'])
        ) {
            throw ValidationException::withMessages([
                'challenge_token' => [
                    'The authentication challenge is invalid or has expired.',
                ],
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | Find User
        |--------------------------------------------------------------------------
        */

        $user =
            $this->authRepository
                ->findById(
                    (int) $challenge['user_id']
                );


        if (! $user) {
            Cache::forget(
                $cacheKey
            );

            throw ValidationException::withMessages([
                'challenge_token' => [
                    'The authentication challenge is invalid or has expired.',
                ],
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | Account Still Active
        |--------------------------------------------------------------------------
        */

        if (! $user->isActive()) {
            Cache::forget(
                $cacheKey
            );

            throw ValidationException::withMessages([
                'code' => [
                    'Your account is not active.',
                ],
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | 2FA Still Enabled
        |--------------------------------------------------------------------------
        */

        $twoFactorStatus =
            $this->twoFactorService
                ->getStatus(
                    $user
                );


        if (
            ! (
                $twoFactorStatus['enabled']
                ?? false
            )
        ) {
            Cache::forget(
                $cacheKey
            );

            throw ValidationException::withMessages([
                'code' => [
                    'Two-factor authentication is no longer enabled for this account.',
                ],
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | Verify Authenticator Code
        |--------------------------------------------------------------------------
        */

        $verified =
            $this->twoFactorService
                ->verifyAuthenticationCode(
                    $user,
                    $data['code']
                );


        if (! $verified) {
            throw ValidationException::withMessages([
                'code' => [
                    'The verification code is invalid or has expired.',
                ],
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | Consume Challenge
        |--------------------------------------------------------------------------
        |
        | OTP valid howar por challenge permanently remove korbo.
        | Same challenge diye second JWT issue kora jabe na.
        |
        */

        Cache::forget(
            $cacheKey
        );


        /*
        |--------------------------------------------------------------------------
        | Complete Login + Issue JWT
        |--------------------------------------------------------------------------
        */

        return $this->completeLogin(
            $user
        );
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
    | Create Two-Factor Login Challenge
    |--------------------------------------------------------------------------
    */

    private function createTwoFactorChallenge(
        User $user
    ): array {
        /*
        |--------------------------------------------------------------------------
        | Random One-Time Challenge Token
        |--------------------------------------------------------------------------
        */

        $challengeToken =
            Str::random(80);


        /*
        |--------------------------------------------------------------------------
        | Store Only Hashed Token Key
        |--------------------------------------------------------------------------
        |
        | Raw challenge token cache key-te rakha hocche na.
        |
        */

        $cacheKey =
            $this->getTwoFactorChallengeCacheKey(
                $challengeToken
            );


        Cache::put(
            $cacheKey,
            [
                'user_id' =>
                    $user->id,

                'created_at' =>
                    now()->timestamp,
            ],
            now()->addMinutes(
                self::TWO_FACTOR_CHALLENGE_MINUTES
            )
        );


        return [
            'requires_two_factor' =>
                true,

            'challenge_token' =>
                $challengeToken,

            'expires_in' =>
                self::TWO_FACTOR_CHALLENGE_MINUTES * 60,
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | Complete Authentication
    |--------------------------------------------------------------------------
    */

    private function completeLogin(
        User $user
    ): array {
        /*
        |--------------------------------------------------------------------------
        | Update Last Login
        |--------------------------------------------------------------------------
        |
        | 2FA enabled hole OTP success-er age last_login update hobe na.
        |
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
        | Attach Avatar
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


        return $this->buildTokenResponse(
            $token,
            $user
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Build JWT Response
    |--------------------------------------------------------------------------
    */

    private function buildTokenResponse(
        string $token,
        User $user
    ): array {
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
    | Two-Factor Challenge Cache Key
    |--------------------------------------------------------------------------
    */

    private function getTwoFactorChallengeCacheKey(
        string $challengeToken
    ): string {
        return self::TWO_FACTOR_CHALLENGE_PREFIX
            . hash(
                'sha256',
                $challengeToken
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Attach Avatar
    |--------------------------------------------------------------------------
    */

    private function attachSocialAvatar(
        User $user
    ): User {
        /*
        |--------------------------------------------------------------------------
        | Custom Uploaded Profile Photo
        |--------------------------------------------------------------------------
        */

        $uploadedAvatar =
            $user->profile_photo_path
                ? asset(
                    ltrim(
                        $user->profile_photo_path,
                        '/'
                    )
                )
                : null;


        /*
        |--------------------------------------------------------------------------
        | Load Social Accounts
        |--------------------------------------------------------------------------
        */

        $user->loadMissing(
            'socialAccounts'
        );


        /*
        |--------------------------------------------------------------------------
        | Google Avatar
        |--------------------------------------------------------------------------
        */

        $googleAccount =
            $user->socialAccounts
                ->firstWhere(
                    'provider',
                    'google'
                );


        $socialAvatar =
            $googleAccount?->avatar_url;


        /*
        |--------------------------------------------------------------------------
        | Final Avatar Priority
        |--------------------------------------------------------------------------
        |
        | Uploaded photo
        |      ↓
        | Google avatar
        |      ↓
        | null → frontend initials
        |
        */

        $user->setAttribute(
            'avatar',
            $uploadedAvatar
                ?: $socialAvatar
        );


        /*
        |--------------------------------------------------------------------------
        | Hide Social Relation
        |--------------------------------------------------------------------------
        */

        $user->unsetRelation(
            'socialAccounts'
        );


        return $user;
    }
}
