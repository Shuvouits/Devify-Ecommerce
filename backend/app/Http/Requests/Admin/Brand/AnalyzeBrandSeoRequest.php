<?php

namespace App\Http\Requests\Admin\Brand;

use Illuminate\Foundation\Http\FormRequest;

class AnalyzeBrandSeoRequest extends FormRequest
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

            'description' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'seo_title' => [
                'nullable',
                'string',
                'max:255',
            ],

            'seo_description' => [
                'nullable',
                'string',
                'max:500',
            ],

            'slug' => [
                'nullable',
                'string',
                'max:180',
            ],

            'website' => [
                'nullable',
                'url',
                'max:500',
            ],

            'has_logo' => [
                'nullable',
                'boolean',
            ],
        ];
    }
}
