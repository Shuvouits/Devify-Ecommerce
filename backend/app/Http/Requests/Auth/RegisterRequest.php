<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:30',
            ],

            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->letters()
                    ->numbers(),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Full name is required.',

            'email.required' => 'Email address is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'An account already exists with this email address.',

            'password.required' => 'Password is required.',
            'password.confirmed' => 'Password confirmation does not match.',
        ];
    }
}
