<?php

namespace App\Http\Requests\Settings\Email;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SmtpSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $smtpRequired = Rule::requiredIf(
            fn () => $this->boolean('is_enabled')
        );

        return [
            'is_enabled' => [
                'required',
                'boolean',
            ],

            'provider' => [
                'required',
                'string',
                Rule::in([
                    'gmail',
                    'microsoft365',
                    'custom',
                ]),
            ],

            'host' => [
                $smtpRequired,
                'nullable',
                'string',
                'max:255',
            ],

            'port' => [
                $smtpRequired,
                'nullable',
                'integer',
                'between:1,65535',
            ],

            'encryption' => [
                $smtpRequired,
                'nullable',
                'string',
                Rule::in([
                    'tls',
                    'ssl',
                    'none',
                ]),
            ],

            'username' => [
                $smtpRequired,
                'nullable',
                'string',
                'max:255',
            ],

            'password' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'from_email' => [
                $smtpRequired,
                'nullable',
                'email',
                'max:255',
            ],

            'from_name' => [
                $smtpRequired,
                'nullable',
                'string',
                'max:255',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'is_enabled.required' =>
                'SMTP status is required.',

            'provider.required' =>
                'SMTP provider is required.',

            'provider.in' =>
                'Selected SMTP provider is invalid.',

            'host.required' =>
                'SMTP host is required when email delivery is enabled.',

            'port.required' =>
                'SMTP port is required when email delivery is enabled.',

            'port.integer' =>
                'SMTP port must be a valid number.',

            'port.between' =>
                'SMTP port must be between 1 and 65535.',

            'encryption.required' =>
                'SMTP encryption type is required.',

            'encryption.in' =>
                'Selected encryption type is invalid.',

            'username.required' =>
                'SMTP username is required when email delivery is enabled.',

            'from_email.required' =>
                'From email is required when email delivery is enabled.',

            'from_email.email' =>
                'Please enter a valid from email address.',

            'from_name.required' =>
                'From name is required when email delivery is enabled.',
        ];
    }
}
