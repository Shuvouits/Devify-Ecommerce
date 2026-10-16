<?php

namespace App\Http\Requests\Admin\Brand;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GenerateBrandImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'prompt' => [
                'required',
                'string',
                'min:10',
                'max:3000',
            ],

            'aspect_ratio' => [
                'nullable',
                'string',
                Rule::in([
                    '1:1',
                    '3:2',
                    '2:3',
                    'auto',
                ]),
            ],

            'quality' => [
                'nullable',
                'string',
                Rule::in([
                    'auto',
                    'low',
                    'medium',
                    'high',
                ]),
            ],

            'background' => [
                'nullable',
                'string',
                Rule::in([
                    'auto',
                    'transparent',
                    'opaque',
                ]),
            ],
        ];
    }
}
