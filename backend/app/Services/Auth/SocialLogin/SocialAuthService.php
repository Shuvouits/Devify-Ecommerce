<?php

namespace App\Services\Auth\SocialLogin;

use App\Models\User;
use App\Repositories\Auth\AuthRepositoryInterface;
use App\Repositories\Auth\Social\SocialAccountRepositoryInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthService
{
    public function __construct(
        protected AuthRepositoryInterface $authRepository,
        protected SocialAccountRepositoryInterface $socialAccountRepository,
        protected SocialProviderConfigService $socialProviderConfigService
    ) {
    }

    /*
    |--------------------------------------------------------------------------
    | Redirect To Provider
    |--------------------------------------------------------------------------
    */

    public function redirect(
        string $provider
    ): RedirectResponse {
        $provider = strtolower(
            trim($provider)
        );

        $setting =
            $this->socialProviderConfigService
                ->apply($provider);

        return Socialite::driver($provider)
            ->stateless()
            ->scopes(
                $this->socialProviderConfigService
                    ->getScopes($setting)
            )
            ->redirect();
    }


    /*
    |--------------------------------------------------------------------------
    | Handle Provider Callback
    |--------------------------------------------------------------------------
    */

    public function handleCallback(
        string $provider
    ): string {
        $provider = strtolower(
            trim($provider)
        );


        /*
        |--------------------------------------------------------------------------
        | Apply Dynamic Provider Configuration
        |--------------------------------------------------------------------------
        */

        $this->socialProviderConfigService
            ->apply($provider);


        /*
        |--------------------------------------------------------------------------
        | Get User From Provider
        |--------------------------------------------------------------------------
        */

        $socialUser =
            Socialite::driver($provider)
                ->stateless()
                ->user();


        $providerUserId =
            (string) $socialUser->getId();


        $email =
            strtolower(
                trim(
                    $socialUser->getEmail() ?? ''
                )
            );


        /*
        |--------------------------------------------------------------------------
        | Required Provider Data
        |--------------------------------------------------------------------------
        */

        if (
            blank($providerUserId) ||
            blank($email)
        ) {
            throw ValidationException::withMessages([
                'social_login' => [
                    'Unable to retrieve the required account information.',
                ],
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | Check Existing Linked Social Account
        |--------------------------------------------------------------------------
        */

        $socialAccount =
            $this->socialAccountRepository
                ->findByProviderUserId(
                    $provider,
                    $providerUserId
                );


        if ($socialAccount) {

            /*
            |--------------------------------------------------------------------------
            | Get Existing Linked User
            |--------------------------------------------------------------------------
            */

            $user =
                $this->authRepository
                    ->findById(
                        $socialAccount->user_id
                    );


            if (! $user) {
                throw ValidationException::withMessages([
                    'social_login' => [
                        'The linked account could not be found.',
                    ],
                ]);
            }


            /*
            |--------------------------------------------------------------------------
            | Refresh Social Account Data
            |--------------------------------------------------------------------------
            |
            | Google profile name / email / avatar change hole
            | next login-e social_accounts table update hobe.
            |
            */

            $this->socialAccountRepository
                ->saveForUser(
                    $user,
                    $provider,
                    [
                        'provider_user_id' =>
                            $providerUserId,

                        'email' =>
                            $email,

                        'name' =>
                            $socialUser->getName(),

                        'avatar_url' =>
                            $socialUser->getAvatar()
                            ?: $socialAccount->avatar_url,
                    ]
                );

        } else {

            /*
            |--------------------------------------------------------------------------
            | Find Existing User By Email
            |--------------------------------------------------------------------------
            */

            $user =
                $this->authRepository
                    ->findByEmail(
                        $email
                    );


            /*
            |--------------------------------------------------------------------------
            | Create New Customer
            |--------------------------------------------------------------------------
            */

            if (! $user) {
                $user =
                    $this->authRepository
                        ->create([
                            'name' =>
                                $socialUser->getName()
                                ?: Str::before(
                                    $email,
                                    '@'
                                ),

                            'email' =>
                                $email,

                            /*
                            |--------------------------------------------------------------------------
                            | Random Password
                            |--------------------------------------------------------------------------
                            |
                            | Social user normally Google diye login korbe.
                            | Random password direct password login prevent kore
                            | until user later resets/sets one.
                            |
                            */

                            'password' =>
                                Str::random(64),

                            'role' =>
                                User::ROLE_CUSTOMER,

                            'status' =>
                                User::STATUS_ACTIVE,
                        ]);
            }


            /*
            |--------------------------------------------------------------------------
            | Link Social Account To User
            |--------------------------------------------------------------------------
            */

            $this->socialAccountRepository
                ->saveForUser(
                    $user,
                    $provider,
                    [
                        'provider_user_id' =>
                            $providerUserId,

                        'email' =>
                            $email,

                        'name' =>
                            $socialUser->getName(),

                        'avatar_url' =>
                            $socialUser->getAvatar(),
                    ]
                );
        }


        /*
        |--------------------------------------------------------------------------
        | Account Status
        |--------------------------------------------------------------------------
        */

        if (! $user->isActive()) {
            throw ValidationException::withMessages([
                'social_login' => [
                    'Your account is not active.',
                ],
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | Create One-Time Exchange Code
        |--------------------------------------------------------------------------
        */

        return $this->createExchangeCode(
            $user
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Exchange One-Time Code For JWT
    |--------------------------------------------------------------------------
    */

    public function exchangeCode(
        string $code
    ): array {
        $cacheKey =
            $this->getExchangeCacheKey(
                $code
            );


        /*
        |--------------------------------------------------------------------------
        | Consume Exchange Code
        |--------------------------------------------------------------------------
        |
        | Cache::pull() code-ke single-use kore.
        |
        */

        $userId =
            Cache::pull(
                $cacheKey
            );


        if (! $userId) {
            throw ValidationException::withMessages([
                'code' => [
                    'The social login code is invalid or has expired.',
                ],
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | Get User
        |--------------------------------------------------------------------------
        */

        $user =
            $this->authRepository
                ->findById(
                    (int) $userId
                );


        if (
            ! $user ||
            ! $user->isActive()
        ) {
            throw ValidationException::withMessages([
                'code' => [
                    'Unable to authenticate this account.',
                ],
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | Update Last Login
        |--------------------------------------------------------------------------
        */

        $user =
            $this->authRepository
                ->updateLastLogin(
                    $user
                );


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


        /*
        |--------------------------------------------------------------------------
        | Authentication Response
        |--------------------------------------------------------------------------
        */

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
    | Attach Social Avatar To User
    |--------------------------------------------------------------------------
    */

    private function attachSocialAvatar(
        User $user
    ): User {
        /*
        |--------------------------------------------------------------------------
        | Load Social Accounts
        |--------------------------------------------------------------------------
        */

        $user->load(
            'socialAccounts'
        );


        /*
        |--------------------------------------------------------------------------
        | Prefer Google Avatar
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
        | Add Virtual Avatar Attribute
        |--------------------------------------------------------------------------
        */

        $user->setAttribute(
            'avatar',
            $googleAccount?->avatar_url
        );


        /*
        |--------------------------------------------------------------------------
        | Don't Expose Social Account Records
        |--------------------------------------------------------------------------
        |
        | Frontend-er avatar dorkar, kintu provider_user_id etc.
        | user response-e expose korar dorkar nei.
        |
        */

        $user->unsetRelation(
            'socialAccounts'
        );


        return $user;
    }


    /*
    |--------------------------------------------------------------------------
    | Generate Temporary Exchange Code
    |--------------------------------------------------------------------------
    */

    private function createExchangeCode(
        User $user
    ): string {
        $code =
            Str::random(80);


        Cache::put(
            $this->getExchangeCacheKey(
                $code
            ),
            $user->id,
            now()->addMinutes(2)
        );


        return $code;
    }


    /*
    |--------------------------------------------------------------------------
    | Exchange Cache Key
    |--------------------------------------------------------------------------
    */

    private function getExchangeCacheKey(
        string $code
    ): string {
        return 'social_login_exchange:'
            . hash(
                'sha256',
                $code
            );
    }
}
