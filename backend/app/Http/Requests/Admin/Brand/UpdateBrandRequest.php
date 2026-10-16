<?php

namespace App\Http\Requests\Admin\Brand;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBrandRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:150',
            ],

            'slug' => [
                'sometimes',
                'nullable',
                'string',
                'max:180',
            ],

            'description' => [
                'sometimes',
                'nullable',
                'string',
                'max:500',
            ],

            'website' => [
                'sometimes',
                'nullable',
                'url',
                'max:500',
            ],

            'status' => [
                'sometimes',
                'required',
                'string',
                'in:active,inactive',
            ],

            'is_featured' => [
                'sometimes',
                'required',
                'boolean',
            ],

            'display_order' => [
                'sometimes',
                'required',
                'integer',
                'min:0',
            ],

            'seo_title' => [
                'sometimes',
                'nullable',
                'string',
                'max:70',
            ],

            'seo_description' => [
                'sometimes',
                'nullable',
                'string',
                'max:160',
            ],
        ];
    }
}
