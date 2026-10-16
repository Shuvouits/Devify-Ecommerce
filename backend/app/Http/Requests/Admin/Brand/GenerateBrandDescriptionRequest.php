<?php

namespace App\Http\Requests\Admin\Brand;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GenerateBrandDescriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'brand_name' => [
                'required',
                'string',
                'max:150',
            ],

            'website' => [
                'nullable',
                'url',
                'max:500',
            ],

            'prompt' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'tone' => [
                'required',
                'string',

                Rule::in([
                    'default',
                    'friendly',
                    'professional',
                    'luxury',
                    'playful',
                    'supportive',
                ]),
            ],
        ];
    }
}
