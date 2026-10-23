<?php

namespace App\Http\Requests\Api\Admin\Category;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCategoryRequest extends FormRequest
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
                Rule::unique(
                    'categories',
                    'slug'
                )->whereNull(
                    'deleted_at'
                ),
            ],

            'description' => [
                'nullable',
                'string',
                'max:500',
            ],

            'parent_id' => [
                'nullable',
                'integer',
                'exists:categories,id',
            ],

            'status' => [
                'required',
                Rule::in([
                    Category::STATUS_ACTIVE,
                    Category::STATUS_INACTIVE,
                ]),
            ],

            'is_featured' => [
                'nullable',
                'boolean',
            ],

            'display_order' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'tax_class' => [
                'nullable',
                'string',
                'max:100',
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

            'tags' => [
                'nullable',
                'array',
            ],

            'tags.*' => [
                'string',
                'max:100',
            ],
        ];
    }
}
