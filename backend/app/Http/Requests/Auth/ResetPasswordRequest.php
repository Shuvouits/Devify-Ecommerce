<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class ResetPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'token' => [
                'required',
                'string',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
            ],

            'password' => [
                'required',
                'string',
                'confirmed',
                Password::min(8)
                    ->letters()
                    ->numbers(),
            ],

            'password_confirmation' => [
                'required',
                'string',
                'same:password',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'token.required' => 'Reset token is required.',

            'email.required' => 'Email address is required.',
            'email.email' => 'Please enter a valid email address.',

            'password.required' => 'New password is required.',
            'password.confirmed' => 'Password confirmation does not match.',

            'password_confirmation.required' => 'Password confirmation is required.',
            'password_confirmation.same' => 'Password confirmation does not match.',
        ];
    }
}
