<?php

namespace App\Services\Auth\SocialLogin;

use App\Models\SocialLoginSetting;
use App\Repositories\Settings\SocialLogin\SocialLoginRepositoryInterface;
use RuntimeException;

class SocialProviderConfigService
{
    public function __construct(
        protected SocialLoginRepositoryInterface $socialLoginRepository
    ) {
    }

    /*
    |--------------------------------------------------------------------------
    | Apply Provider Configuration
    |--------------------------------------------------------------------------
    */

    public function apply(
        string $provider
    ): SocialLoginSetting {
        $provider = strtolower(
            trim($provider)
        );

        $setting =
            $this->socialLoginRepository
                ->findByProvider(
                    $provider
                );


        /*
        |--------------------------------------------------------------------------
        | Provider Not Configured
        |--------------------------------------------------------------------------
        */

        if (! $setting) {
            throw new RuntimeException(
                'Social login provider is not configured.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Provider Disabled
        |--------------------------------------------------------------------------
        */

        if (! $setting->is_enabled) {
            throw new RuntimeException(
                'Social login provider is currently disabled.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Required Credentials
        |--------------------------------------------------------------------------
        */

        if (
            blank($setting->client_id) ||
            blank($setting->client_secret) ||
            blank($setting->redirect_uri)
        ) {
            throw new RuntimeException(
                'Social login provider configuration is incomplete.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Google
        |--------------------------------------------------------------------------
        */

        if (
            $provider ===
            SocialLoginSetting::PROVIDER_GOOGLE
        ) {
            config([
                'services.google.client_id' =>
                    $setting->client_id,

                'services.google.client_secret' =>
                    $setting->client_secret,

                'services.google.redirect' =>
                    $setting->redirect_uri,
            ]);

            return $setting;
        }


        /*
        |--------------------------------------------------------------------------
        | Unsupported Runtime Provider
        |--------------------------------------------------------------------------
        */

        throw new RuntimeException(
            'This social login provider is not supported yet.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Provider Scopes
    |--------------------------------------------------------------------------
    */

    public function getScopes(
        SocialLoginSetting $setting
    ): array {
        if (
            ! empty($setting->scopes)
        ) {
            return $setting->scopes;
        }


        return match ($setting->provider) {
            SocialLoginSetting::PROVIDER_GOOGLE => [
                'openid',
                'profile',
                'email',
            ],

            default => [],
        };
    }
}
