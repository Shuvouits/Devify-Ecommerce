<?php

namespace App\Services\Settings\SocialLogin;

use App\Models\SocialLoginSetting;
use App\Repositories\Settings\SocialLogin\SocialLoginRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class SocialLoginService
{
    public function __construct(
        protected SocialLoginRepositoryInterface $socialLoginRepository
    ) {
    }

    /*
    |--------------------------------------------------------------------------
    | Supported Providers
    |--------------------------------------------------------------------------
    */

    private const SUPPORTED_PROVIDERS = [
        SocialLoginSetting::PROVIDER_GOOGLE,
        SocialLoginSetting::PROVIDER_MICROSOFT,
        SocialLoginSetting::PROVIDER_FACEBOOK,
        SocialLoginSetting::PROVIDER_GITHUB,
    ];


    /*
    |--------------------------------------------------------------------------
    | Get All Social Login Settings
    |--------------------------------------------------------------------------
    */

    public function getAllSettings(): Collection
    {
        return $this->socialLoginRepository->all();
    }


    /*
    |--------------------------------------------------------------------------
    | Get Provider Settings
    |--------------------------------------------------------------------------
    */

    public function getProviderSettings(
        string $provider
    ): ?SocialLoginSetting {
        $provider = $this->normalizeProvider(
            $provider
        );

        $this->validateProvider(
            $provider
        );

        return $this->socialLoginRepository
            ->findByProvider(
                $provider
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Save Provider Settings
    |--------------------------------------------------------------------------
    */

    public function saveProviderSettings(
        string $provider,
        array $data
    ): SocialLoginSetting {
        $provider = $this->normalizeProvider(
            $provider
        );

        $this->validateProvider(
            $provider
        );


        $existingSetting =
            $this->socialLoginRepository
                ->findByProvider(
                    $provider
                );


        /*
        |--------------------------------------------------------------------------
        | First-Time Enabled Setup
        |--------------------------------------------------------------------------
        |
        | Provider enabled korle first setup-e Client Secret required.
        |
        */

        if (
            ! $existingSetting &&
            ($data['is_enabled'] ?? false) &&
            blank(
                $data['client_secret'] ?? null
            )
        ) {
            throw ValidationException::withMessages([
                'client_secret' => [
                    'Client Secret is required for the initial social login setup.',
                ],
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | Existing Row Has No Secret
        |--------------------------------------------------------------------------
        |
        | Disabled obosthay row create hoye thakle pore enable korar somoy
        | secret chara allow korbo na.
        |
        */

        if (
            $existingSetting &&
            ($data['is_enabled'] ?? false) &&
            blank(
                $existingSetting->client_secret
            ) &&
            blank(
                $data['client_secret'] ?? null
            )
        ) {
            throw ValidationException::withMessages([
                'client_secret' => [
                    'Client Secret is required before enabling social login.',
                ],
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | Normalize Boolean
        |--------------------------------------------------------------------------
        */

        $data['is_enabled'] =
            (bool) (
                $data['is_enabled'] ?? false
            );


        /*
        |--------------------------------------------------------------------------
        | Default Scopes
        |--------------------------------------------------------------------------
        */

        if (
            empty($data['scopes'])
        ) {
            $data['scopes'] =
                $this->getDefaultScopes(
                    $provider
                );
        }


        /*
        |--------------------------------------------------------------------------
        | Save
        |--------------------------------------------------------------------------
        */

        return $this->socialLoginRepository
            ->save(
                $provider,
                $data
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Check Client Secret
    |--------------------------------------------------------------------------
    */

    public function hasClientSecret(
        ?SocialLoginSetting $setting
    ): bool {
        if (! $setting) {
            return false;
        }

        return filled(
            $setting->client_secret
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Normalize Provider
    |--------------------------------------------------------------------------
    */

    private function normalizeProvider(
        string $provider
    ): string {
        return strtolower(
            trim($provider)
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Validate Provider
    |--------------------------------------------------------------------------
    */

    private function validateProvider(
        string $provider
    ): void {
        if (
            ! in_array(
                $provider,
                self::SUPPORTED_PROVIDERS,
                true
            )
        ) {
            throw ValidationException::withMessages([
                'provider' => [
                    'Unsupported social login provider.',
                ],
            ]);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Provider Default Scopes
    |--------------------------------------------------------------------------
    */

    private function getDefaultScopes(
        string $provider
    ): array {
        return match ($provider) {
            SocialLoginSetting::PROVIDER_GOOGLE => [
                'openid',
                'profile',
                'email',
            ],

            SocialLoginSetting::PROVIDER_MICROSOFT => [
                'openid',
                'profile',
                'email',
            ],

            SocialLoginSetting::PROVIDER_FACEBOOK => [
                'email',
                'public_profile',
            ],

            SocialLoginSetting::PROVIDER_GITHUB => [
                'user:email',
            ],

            default => [],
        };
    }
}
