<?php

namespace App\Repositories\Auth;

use App\Models\User;

class AuthRepository implements AuthRepositoryInterface
{
    public function __construct(
        protected User $user
    ) {
    }

    public function create(array $data): User
    {
        return $this->user->create($data);
    }

    public function findByEmail(string $email): ?User
    {
        return $this->user
            ->where('email', $email)
            ->first();
    }

    public function findById(int $id): ?User
    {
        return $this->user->find($id);
    }

    public function update(User $user, array $data): User
    {
        $user->update($data);

        return $user->refresh();
    }

    public function updateLastLogin(User $user): User
    {
        $user->update([
            'last_login_at' => now(),
        ]);

        return $user->refresh();
    }
}
