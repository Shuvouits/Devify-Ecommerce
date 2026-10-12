<?php

namespace App\Repositories\TwoFactor;

use App\Models\TwoFactorAuthentication;
use App\Models\User;

interface TwoFactorRepositoryInterface
{
    public function findByUserId(int $userId): ?TwoFactorAuthentication;

    public function createOrUpdate(
        User $user,
        array $data
    ): TwoFactorAuthentication;

    public function deleteForUser(
        User $user
    ): bool;
}
