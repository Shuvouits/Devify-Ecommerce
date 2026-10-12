<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePasswordRequest extends FormRequest
{
    /*
    |--------------------------------------------------------------------------
    | Authorization
    |--------------------------------------------------------------------------
    */

    public function authorize(): bool
    {
        return auth('api')->check();
    }


    /*
    |--------------------------------------------------------------------------
    | Validation Rules
    |--------------------------------------------------------------------------
    */

    public function rules(): array
    {
        return [
            'current_password' => [
                'required',
                'string',
            ],

            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'different:current_password',
            ],

            'password_confirmation' => [
                'required',
                'string',
            ],
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | Validation Messages
    |--------------------------------------------------------------------------
    */

    public function messages(): array
    {
        return [
            'current_password.required' =>
                'Current password is required.',

            'password.required' =>
                'New password is required.',

            'password.min' =>
                'New password must be at least 8 characters.',

            'password.confirmed' =>
                'New password confirmation does not match.',

            'password.different' =>
                'New password must be different from your current password.',

            'password_confirmation.required' =>
                'Please confirm your new password.',
        ];
    }
}
