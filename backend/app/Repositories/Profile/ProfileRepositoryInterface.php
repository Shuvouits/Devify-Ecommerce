<?php

namespace App\Repositories\Profile;

use App\Models\User;

interface ProfileRepositoryInterface
{
    /*
    |--------------------------------------------------------------------------
    | Find User
    |--------------------------------------------------------------------------
    */

    public function findById(
        int $userId
    ): ?User;


    /*
    |--------------------------------------------------------------------------
    | Update Profile
    |--------------------------------------------------------------------------
    */

    public function updateProfile(
        User $user,
        array $data
    ): User;


    /*
    |--------------------------------------------------------------------------
    | Update Profile Photo
    |--------------------------------------------------------------------------
    */

    public function updateProfilePhoto(
        User $user,
        ?string $path
    ): User;


    /*
    |--------------------------------------------------------------------------
    | Update Password
    |--------------------------------------------------------------------------
    */

    public function updatePassword(
        User $user,
        string $password
    ): User;
}
