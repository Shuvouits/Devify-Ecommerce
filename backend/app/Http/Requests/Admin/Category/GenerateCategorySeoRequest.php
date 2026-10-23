<?php

namespace App\Http\Requests\Admin\Category;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GenerateCategorySeoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'category_name' => [
                'required',
                'string',
                'max:150',
            ],

            'description' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'parent_id' => [
                'nullable',
                'integer',
                'exists:categories,id',
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
