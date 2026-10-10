<?php

namespace App\Repositories\Settings\SocialLogin;

use App\Models\SocialLoginSetting;
use Illuminate\Database\Eloquent\Collection;

class SocialLoginRepository implements SocialLoginRepositoryInterface
{
    public function __construct(
        protected SocialLoginSetting $socialLoginSetting
    ) {
    }


    /*
    |--------------------------------------------------------------------------
    | GET ALL PROVIDERS
    |--------------------------------------------------------------------------
    */

    public function all(): Collection
    {
        return $this->socialLoginSetting
            ->newQuery()
            ->orderBy('provider')
            ->get();
    }


    /*
    |--------------------------------------------------------------------------
    | FIND PROVIDER
    |--------------------------------------------------------------------------
    */

    public function findByProvider(
        string $provider
    ): ?SocialLoginSetting {
        return $this->socialLoginSetting
            ->newQuery()
            ->where(
                'provider',
                strtolower($provider)
            )
            ->first();
    }


    /*
    |--------------------------------------------------------------------------
    | SAVE PROVIDER SETTINGS
    |--------------------------------------------------------------------------
    */

    public function save(
        string $provider,
        array $data
    ): SocialLoginSetting {
        $provider = strtolower($provider);

        /*
        |--------------------------------------------------------------------------
        | Preserve existing Client Secret
        |--------------------------------------------------------------------------
        |
        | যদি frontend client_secret blank পাঠায়,
        | existing encrypted secret overwrite হবে না।
        |
        */

        if (
            array_key_exists(
                'client_secret',
                $data
            ) &&
            blank(
                $data['client_secret']
            )
        ) {
            unset(
                $data['client_secret']
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Existing Provider
        |--------------------------------------------------------------------------
        */

        $setting =
            $this->findByProvider(
                $provider
            );


        if ($setting) {
            $setting->update(
                $data
            );

            return $setting->refresh();
        }


        /*
        |--------------------------------------------------------------------------
        | Create Provider
        |--------------------------------------------------------------------------
        */

        return $this->socialLoginSetting
            ->create([
                ...$data,

                'provider' => $provider,
            ]);
    }
}
