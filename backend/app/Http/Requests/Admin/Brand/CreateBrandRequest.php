<?php

namespace App\Http\Requests\Admin\Brand;

use Illuminate\Foundation\Http\FormRequest;

class CreateBrandRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:150',
            ],

            'slug' => [
                'nullable',
                'string',
                'max:180',
            ],

            'description' => [
                'nullable',
                'string',
                'max:500',
            ],

            'website' => [
                'nullable',
                'url',
                'max:500',
            ],

            'status' => [
                'required',
                'string',
                'in:active,inactive',
            ],

            'is_featured' => [
                'required',
                'boolean',
            ],

            'display_order' => [
                'required',
                'integer',
                'min:0',
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
        ];
    }
}
