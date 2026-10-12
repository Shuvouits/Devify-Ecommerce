<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdatePasswordRequest;
use App\Http\Requests\Profile\UpdateProfilePhotoRequest;
use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Services\Profile\ProfileService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    use ApiResponseTrait;


    public function __construct(
        protected ProfileService $profileService
    ) {
    }


    /*
    |--------------------------------------------------------------------------
    | Get Profile
    |--------------------------------------------------------------------------
    */

    public function show(
        Request $request
    ): JsonResponse {
        $user =
            $request->user(
                'api'
            );


        $profile =
            $this->profileService
                ->getProfile(
                    $user
                );


        return $this->successResponse(
            [
                'profile' =>
                    $profile,
            ],
            'Profile retrieved successfully.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Update Profile
    |--------------------------------------------------------------------------
    */

    public function update(
        UpdateProfileRequest $request
    ): JsonResponse {
        $user =
            $request->user(
                'api'
            );


        $profile =
            $this->profileService
                ->updateProfile(
                    $user,
                    $request->validated()
                );


        return $this->successResponse(
            [
                'profile' =>
                    $profile,
            ],
            'Profile updated successfully.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Upload Profile Photo
    |--------------------------------------------------------------------------
    */

    public function uploadPhoto(
        UpdateProfilePhotoRequest $request
    ): JsonResponse {
        $user =
            $request->user(
                'api'
            );


        $profile =
            $this->profileService
                ->uploadProfilePhoto(
                    $user,
                    $request->file(
                        'photo'
                    )
                );


        return $this->successResponse(
            [
                'profile' =>
                    $profile,
            ],
            'Profile photo updated successfully.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Profile Photo
    |--------------------------------------------------------------------------
    */

    public function deletePhoto(
        Request $request
    ): JsonResponse {
        $user =
            $request->user(
                'api'
            );


        $profile =
            $this->profileService
                ->deleteProfilePhoto(
                    $user
                );


        return $this->successResponse(
            [
                'profile' =>
                    $profile,
            ],
            'Profile photo removed successfully.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Change Password
    |--------------------------------------------------------------------------
    */

    public function updatePassword(
        UpdatePasswordRequest $request
    ): JsonResponse {
        $user =
            $request->user(
                'api'
            );


        $this->profileService
            ->updatePassword(
                $user,
                $request->validated()
            );


        return $this->successResponse(
            null,
            'Password updated successfully.'
        );
    }
}
