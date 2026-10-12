<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class VerifyTwoFactorLoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'challenge_token' => [
                'required',
                'string',
                'max:255',
            ],

            'code' => [
                'required',
                'string',
                'regex:/^\d{6}$/',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'challenge_token.required' =>
                'The authentication challenge is required.',

            'code.required' =>
                'The verification code is required.',

            'code.regex' =>
                'The verification code must be exactly 6 digits.',
        ];
    }
}
