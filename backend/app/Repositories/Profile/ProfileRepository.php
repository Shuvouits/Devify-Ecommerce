<?php

namespace App\Repositories\Profile;

use App\Models\User;

class ProfileRepository implements ProfileRepositoryInterface
{
    /*
    |--------------------------------------------------------------------------
    | Find User
    |--------------------------------------------------------------------------
    */

    public function findById(
        int $userId
    ): ?User {
        return User::query()
            ->find($userId);
    }


    /*
    |--------------------------------------------------------------------------
    | Update Profile
    |--------------------------------------------------------------------------
    */

    public function updateProfile(
        User $user,
        array $data
    ): User {
        $user->update(
            $data
        );


        return $user->refresh();
    }


    /*
    |--------------------------------------------------------------------------
    | Update Profile Photo
    |--------------------------------------------------------------------------
    */

    public function updateProfilePhoto(
        User $user,
        ?string $path
    ): User {
        $user->update([
            'profile_photo_path' =>
                $path,
        ]);


        return $user->refresh();
    }


    /*
    |--------------------------------------------------------------------------
    | Update Password
    |--------------------------------------------------------------------------
    */

    public function updatePassword(
        User $user,
        string $password
    ): User {
        $user->update([
            'password' =>
                $password,
        ]);


        return $user->refresh();
    }
}
