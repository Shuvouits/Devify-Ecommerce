<?php

namespace App\Http\Requests\Api\Admin\Product;

use Illuminate\Foundation\Http\FormRequest;

class AnalyzeProductSeoRequest extends FormRequest
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

            'overview' => [
                'nullable',
                'string',
                'max:1500',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'seo_title' => [
                'nullable',
                'string',
                'max:70',
            ],

            'seo_description' => [
                'nullable',
                'string',
                'max:160',
            ],

            'slug' => [
                'nullable',
                'string',
                'max:220',
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

            'has_media' => [
                'nullable',
                'boolean',
            ],

            'has_price' => [
                'nullable',
                'boolean',
            ],
        ];
    }
}
