<?php

namespace App\Http\Requests\Admin\Settings;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAiSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'provider' => [
                'required',
                'string',
                'in:openrouter,nvidia',
            ],

            'api_key' => [
                'nullable',
                'string',
                'max:5000',
            ],

            'model' => [
                'required',
                'string',
                'max:255',
            ],

            'image_model' => [
                'nullable',
                'string',
                'max:255',
            ],

            'url' => [
                'required',
                'url',
                'max:500',
            ],

            'base_url' => [
                'required',
                'url',
                'max:500',
            ],

            'is_enabled' => [
                'required',
                'boolean',
            ],
        ];
    }
}
