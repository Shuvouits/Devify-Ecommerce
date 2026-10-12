<?php

namespace App\Repositories\TwoFactor;

use App\Models\TwoFactorAuthentication;
use App\Models\User;

class TwoFactorRepository implements TwoFactorRepositoryInterface
{
    public function findByUserId(int $userId): ?TwoFactorAuthentication
    {
        return TwoFactorAuthentication::query()
            ->where('user_id', $userId)
            ->first();
    }

    public function createOrUpdate(
        User $user,
        array $data
    ): TwoFactorAuthentication {
        return TwoFactorAuthentication::query()
            ->updateOrCreate(
                [
                    'user_id' => $user->id,
                ],
                $data
            );
    }

    public function deleteForUser(User $user): bool
    {
        return (bool) TwoFactorAuthentication::query()
            ->where('user_id', $user->id)
            ->delete();
    }
}
