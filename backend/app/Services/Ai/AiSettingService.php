<?php

namespace App\Services\Ai;

use App\Models\AiSetting;
use App\Repositories\Ai\AiSettingRepositoryInterface;

class AiSettingService
{
    public function __construct(
        protected AiSettingRepositoryInterface $repository
    ) {
    }


    public function getSettings(): array
    {
        $setting =
            $this->repository
                ->getSettings();


        if (!$setting) {
            return $this->getDefaultSettings();
        }


        return $this->formatSettings(
            $setting
        );
    }


    public function updateSettings(
        array $data
    ): array {
        $setting =
            $this->repository
                ->getSettings();


        /*
        |--------------------------------------------------------------------------
        | Preserve Existing API Key
        |--------------------------------------------------------------------------
        |
        | Frontend password field blank thakle existing encrypted key
        | overwrite korbo na.
        |
        */

        if (
            !array_key_exists(
                'api_key',
                $data
            ) ||
            blank($data['api_key'])
        ) {
            unset(
                $data['api_key']
            );
        }


        if (!$setting) {
            $data['provider'] =
                $data['provider']
                    ?? 'openrouter';

            $setting =
                $this->repository
                    ->create($data);

        } else {
            $setting =
                $this->repository
                    ->update(
                        $setting,
                        $data
                    );
        }


        return $this->formatSettings(
            $setting
        );
    }


    private function formatSettings(
        AiSetting $setting
    ): array {
        return [
            'id' =>
                $setting->id,

            'provider' =>
                $setting->provider,

            'model' =>
                $setting->model,
                'image_model' =>
    $setting->image_model,

            'url' =>
                $setting->url,

            'base_url' =>
                $setting->base_url,

            'is_enabled' =>
                $setting->is_enabled,

            'has_api_key' =>
                filled(
                    $setting->api_key
                ),

            'api_key_masked' =>
                $this->maskApiKey(
                    $setting->api_key
                ),

            'created_at' =>
                $setting->created_at,

            'updated_at' =>
                $setting->updated_at,
        ];
    }


    private function getDefaultSettings(): array
    {
        return [
            'id' => null,

            'provider' =>
                'openrouter',

            'model' =>
                config(
                    'services.openrouter.model',
                    'openrouter/free'
                ),

            'url' =>
                config(
                    'services.openrouter.url',
                    'https://openrouter.ai/api/v1/chat/completions'
                ),

            'base_url' =>
                config(
                    'services.openrouter.base_url',
                    'https://openrouter.ai/api/v1'
                ),

            'is_enabled' =>
                false,

            'has_api_key' =>
                filled(
                    config(
                        'services.openrouter.api_key'
                    )
                ),

            'api_key_masked' =>
                $this->maskApiKey(
                    config(
                        'services.openrouter.api_key'
                    )
                ),

            'created_at' =>
                null,

            'updated_at' =>
                null,

            'image_model' => null,
        ];
    }


    private function maskApiKey(
        ?string $apiKey
    ): ?string {
        if (blank($apiKey)) {
            return null;
        }


        if (
            strlen($apiKey) <= 8
        ) {
            return '••••••••';
        }


        return
            substr(
                $apiKey,
                0,
                4
            )
            . '••••••••••••'
            . substr(
                $apiKey,
                -4
            );
    }
}
