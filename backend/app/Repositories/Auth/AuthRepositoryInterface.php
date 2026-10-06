<?php

namespace App\Repositories\Auth;

use App\Models\User;

interface AuthRepositoryInterface
{
    public function create(array $data): User;

    public function findByEmail(string $email): ?User;

    public function findById(int $id): ?User;

    public function update(User $user, array $data): User;

    public function updateLastLogin(User $user): User;
}
