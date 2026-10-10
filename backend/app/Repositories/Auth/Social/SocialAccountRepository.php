<?php

namespace App\Repositories\Auth\Social;

use App\Models\SocialAccount;
use App\Models\User;

class SocialAccountRepository implements SocialAccountRepositoryInterface
{
    public function __construct(
        protected SocialAccount $socialAccount
    ) {
    }

    public function findByProviderUserId(
        string $provider,
        string $providerUserId
    ): ?SocialAccount {
        return $this->socialAccount
            ->newQuery()
            ->where('provider', $provider)
            ->where('provider_user_id', $providerUserId)
            ->first();
    }

    public function findByUserAndProvider(
        int $userId,
        string $provider
    ): ?SocialAccount {
        return $this->socialAccount
            ->newQuery()
            ->where('user_id', $userId)
            ->where('provider', $provider)
            ->first();
    }

    public function saveForUser(
        User $user,
        string $provider,
        array $data
    ): SocialAccount {
        return $this->socialAccount
            ->newQuery()
            ->updateOrCreate(
                [
                    'user_id' => $user->id,
                    'provider' => $provider,
                ],
                [
                    'provider_user_id' =>
                        $data['provider_user_id'],

                    'email' =>
                        $data['email'] ?? null,

                    'name' =>
                        $data['name'] ?? null,

                    'avatar_url' =>
                        $data['avatar_url'] ?? null,
                ]
            );
    }
}
