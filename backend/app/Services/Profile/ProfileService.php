<?php

namespace App\Services\Profile;

use App\Models\User;
use App\Repositories\Profile\ProfileRepositoryInterface;
use App\Traits\HandlesImageUploads;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ProfileService
{
    use HandlesImageUploads;


    public function __construct(
        protected ProfileRepositoryInterface $profileRepository
    ) {
    }


    /*
    |--------------------------------------------------------------------------
    | Get Profile
    |--------------------------------------------------------------------------
    */

    public function getProfile(
        User $user
    ): array {
        $user =
            $this->getFreshUser(
                $user
            );


        return $this->formatProfile(
            $user
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Update Personal Information
    |--------------------------------------------------------------------------
    */

    public function updateProfile(
        User $user,
        array $data
    ): array {
        $firstName =
            trim(
                $data['first_name']
            );


        $lastName =
            isset($data['last_name'])
                ? trim(
                    $data['last_name']
                )
                : null;


        /*
        |--------------------------------------------------------------------------
        | Sync Full Name
        |--------------------------------------------------------------------------
        */

        $fullName =
            trim(
                $firstName
                . ' '
                . ($lastName ?? '')
            );


        $payload = [
            'first_name' =>
                $firstName,

            'last_name' =>
                $lastName ?: null,

            'name' =>
                $fullName,

            'email' =>
                strtolower(
                    trim(
                        $data['email']
                    )
                ),

            'phone' =>
                isset($data['phone'])
                    ? (
                        trim($data['phone']) !== ''
                            ? trim($data['phone'])
                            : null
                    )
                    : null,

            'birthday' =>
                $data['birthday'] ?? null,

            'gender' =>
                $data['gender'] ?? null,
        ];


        $user =
            $this->profileRepository
                ->updateProfile(
                    $user,
                    $payload
                );


        return $this->formatProfile(
            $user
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Upload Profile Photo
    |--------------------------------------------------------------------------
    */

    public function uploadProfilePhoto(
        User $user,
        UploadedFile $photo
    ): array {
        /*
        |--------------------------------------------------------------------------
        | Upload To Public Folder
        |--------------------------------------------------------------------------
        */

        $path =
            $this->uploadImage(
                $photo,
                'uploads/profile-photos/' . $user->id,
                $user->profile_photo_path,
                $user->name
            );


        /*
        |--------------------------------------------------------------------------
        | Save Relative Path
        |--------------------------------------------------------------------------
        */

        $user =
            $this->profileRepository
                ->updateProfilePhoto(
                    $user,
                    $path
                );


        return $this->formatProfile(
            $user
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Profile Photo
    |--------------------------------------------------------------------------
    */

    public function deleteProfilePhoto(
        User $user
    ): array {
        /*
        |--------------------------------------------------------------------------
        | Delete Only Custom Uploaded Photo
        |--------------------------------------------------------------------------
        |
        | Google avatar social_accounts table-e untouched thakbe.
        |
        */

        if ($user->profile_photo_path) {
            $this->deleteImage(
                $user->profile_photo_path
            );
        }


        $user =
            $this->profileRepository
                ->updateProfilePhoto(
                    $user,
                    null
                );


        return $this->formatProfile(
            $user
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Change Password
    |--------------------------------------------------------------------------
    */

    public function updatePassword(
        User $user,
        array $data
    ): void {
        /*
        |--------------------------------------------------------------------------
        | Verify Current Password
        |--------------------------------------------------------------------------
        */

        if (
            ! Hash::check(
                $data['current_password'],
                $user->password
            )
        ) {
            throw ValidationException::withMessages([
                'current_password' => [
                    'The current password is incorrect.',
                ],
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | Prevent Same Password
        |--------------------------------------------------------------------------
        */

        if (
            Hash::check(
                $data['password'],
                $user->password
            )
        ) {
            throw ValidationException::withMessages([
                'password' => [
                    'The new password must be different from your current password.',
                ],
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | Save Password
        |--------------------------------------------------------------------------
        |
        | User model already has password => hashed cast.
        |
        */

        $this->profileRepository
            ->updatePassword(
                $user,
                $data['password']
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Get Fresh User
    |--------------------------------------------------------------------------
    */

    private function getFreshUser(
        User $user
    ): User {
        $freshUser =
            $this->profileRepository
                ->findById(
                    (int) $user->id
                );


        if (! $freshUser) {
            throw new \RuntimeException(
                'Authenticated user profile could not be found.'
            );
        }


        return $freshUser;
    }


    /*
    |--------------------------------------------------------------------------
    | Format Profile Response
    |--------------------------------------------------------------------------
    */

    private function formatProfile(
        User $user
    ): array {
        /*
        |--------------------------------------------------------------------------
        | Resolve Legacy First / Last Name
        |--------------------------------------------------------------------------
        |
        | Existing users-er first_name / last_name NULL hole
        | old "name" field theke form-er initial value ber korbo.
        |
        */

        [
            $firstName,
            $lastName,
        ] = $this->resolveNameParts(
            $user
        );


        /*
        |--------------------------------------------------------------------------
        | Google Avatar
        |--------------------------------------------------------------------------
        */

        $socialAvatar =
            $user->getSocialAvatarUrl();


        /*
        |--------------------------------------------------------------------------
        | Custom Uploaded Avatar
        |--------------------------------------------------------------------------
        */

        $uploadedAvatar =
            $this->getImageUrl(
                $user->profile_photo_path
            );


        /*
        |--------------------------------------------------------------------------
        | Final Avatar Priority
        |--------------------------------------------------------------------------
        |
        | 1. Custom uploaded photo
        | 2. Google/social avatar
        | 3. Frontend initials
        |
        */

        $avatar =
            $uploadedAvatar
            ?: $socialAvatar;


        /*
        |--------------------------------------------------------------------------
        | Remove Loaded Relation From Model
        |--------------------------------------------------------------------------
        */

        $user->unsetRelation(
            'socialAccounts'
        );


        return [
            'id' =>
                $user->id,

            'name' =>
                $user->name,

            'first_name' =>
                $firstName,

            'last_name' =>
                $lastName,

            'email' =>
                $user->email,

            'phone' =>
                $user->phone,

            'birthday' =>
                $user->birthday
                    ? $user->birthday
                        ->format('Y-m-d')
                    : null,

            'gender' =>
                $user->gender,

            'role' =>
                $user->role,

            'status' =>
                $user->status,

            /*
            |--------------------------------------------------------------------------
            | Avatar Information
            |--------------------------------------------------------------------------
            */

            'profile_photo_path' =>
                $user->profile_photo_path,

            'uploaded_avatar' =>
                $uploadedAvatar,

            'social_avatar' =>
                $socialAvatar,

            'avatar' =>
                $avatar,

            'avatar_source' =>
                $uploadedAvatar
                    ? 'uploaded'
                    : (
                        $socialAvatar
                            ? 'social'
                            : null
                    ),

            /*
            |--------------------------------------------------------------------------
            | Account Information
            |--------------------------------------------------------------------------
            */

            'email_verified_at' =>
                $user->email_verified_at
                    ? $user->email_verified_at
                        ->toISOString()
                    : null,

            'last_login_at' =>
                $user->last_login_at
                    ? $user->last_login_at
                        ->toISOString()
                    : null,

            'created_at' =>
                $user->created_at
                    ? $user->created_at
                        ->toISOString()
                    : null,

            'updated_at' =>
                $user->updated_at
                    ? $user->updated_at
                        ->toISOString()
                    : null,
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | Resolve First And Last Name
    |--------------------------------------------------------------------------
    */

    private function resolveNameParts(
        User $user
    ): array {
        /*
        |--------------------------------------------------------------------------
        | New Profile Data Available
        |--------------------------------------------------------------------------
        */

        if (
            filled($user->first_name) ||
            filled($user->last_name)
        ) {
            return [
                $user->first_name ?: '',
                $user->last_name ?: '',
            ];
        }


        /*
        |--------------------------------------------------------------------------
        | Legacy Name Fallback
        |--------------------------------------------------------------------------
        */

        $name =
            trim(
                $user->name ?? ''
            );


        if ($name === '') {
            return [
                '',
                '',
            ];
        }


        $parts =
            preg_split(
                '/\s+/',
                $name,
                2
            );


        return [
            $parts[0] ?? '',
            $parts[1] ?? '',
        ];
    }
}
