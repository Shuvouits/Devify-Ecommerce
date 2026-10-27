<?php

namespace App\Http\Requests\Api\Admin\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GenerateProductDescriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'product_title' => [
                'required',
                'string',
                'max:200',
            ],

            'brand_name' => [
                'nullable',
                'string',
                'max:180',
            ],

            'category_name' => [
                'nullable',
                'string',
                'max:180',
            ],

            'overview' => [
                'nullable',
                'string',
                'max:1500',
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
