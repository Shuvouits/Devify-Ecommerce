<?php

namespace App\Repositories\Settings\SocialLogin;

use App\Models\SocialLoginSetting;
use Illuminate\Database\Eloquent\Collection;

interface SocialLoginRepositoryInterface
{
    public function all(): Collection;

    public function findByProvider(
        string $provider
    ): ?SocialLoginSetting;

    public function save(
        string $provider,
        array $data
    ): SocialLoginSetting;
}
