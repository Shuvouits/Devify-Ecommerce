<?php

namespace App\Repositories\Auth\Social;

use App\Models\SocialAccount;
use App\Models\User;

interface SocialAccountRepositoryInterface
{
    public function findByProviderUserId(
        string $provider,
        string $providerUserId
    ): ?SocialAccount;

    public function findByUserAndProvider(
        int $userId,
        string $provider
    ): ?SocialAccount;

    public function saveForUser(
        User $user,
        string $provider,
        array $data
    ): SocialAccount;
}
