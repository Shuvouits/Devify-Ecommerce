<?php

namespace App\Http\Requests\Settings\SocialLogin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SocialLoginSettingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules.
     */
    public function rules(): array
    {
        $credentialsRequired = Rule::requiredIf(
            fn () => $this->boolean('is_enabled')
        );

        return [
            'is_enabled' => [
                'required',
                'boolean',
            ],

            'client_id' => [
                $credentialsRequired,
                'nullable',
                'string',
                'max:1000',
            ],

            /*
            |--------------------------------------------------------------------------
            | Client Secret
            |--------------------------------------------------------------------------
            |
            | Intentionally nullable.
            |
            | Existing provider update korar somoy blank thakle
            | previous encrypted secret preserve hobe.
            |
            | First-time enabled setup-er secret requirement
            | Service layer-e handle korbo.
            |
            */

            'client_secret' => [
                'nullable',
                'string',
                'max:2000',
            ],

            'redirect_uri' => [
                $credentialsRequired,
                'nullable',
                'url',
                'max:2048',
            ],

            'scopes' => [
                'nullable',
                'array',
            ],

            'scopes.*' => [
                'string',
                'max:100',
            ],
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'is_enabled.required' =>
                'Social login status is required.',

            'is_enabled.boolean' =>
                'Social login status must be true or false.',

            'client_id.required' =>
                'Client ID is required when social login is enabled.',

            'client_id.string' =>
                'Client ID must be a valid string.',

            'client_secret.string' =>
                'Client Secret must be a valid string.',

            'redirect_uri.required' =>
                'Redirect URI is required when social login is enabled.',

            'redirect_uri.url' =>
                'Redirect URI must be a valid URL.',

            'scopes.array' =>
                'Scopes must be provided as an array.',

            'scopes.*.string' =>
                'Each scope must be a valid string.',
        ];
    }
}
