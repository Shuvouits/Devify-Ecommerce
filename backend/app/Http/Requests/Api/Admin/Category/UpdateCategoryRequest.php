<?php

namespace App\Http\Requests\Api\Admin\Category;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        $categoryId =
            $this->route(
                'id'
            );


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

                Rule::unique(
                    'categories',
                    'slug'
                )
                    ->ignore(
                        $categoryId
                    )
                    ->whereNull(
                        'deleted_at'
                    ),
            ],

            'description' => [
                'sometimes',
                'nullable',
                'string',
                'max:500',
            ],

            'parent_id' => [
                'sometimes',
                'nullable',
                'integer',
                'exists:categories,id',
            ],

            'status' => [
                'sometimes',
                Rule::in([
                    Category::STATUS_ACTIVE,
                    Category::STATUS_INACTIVE,
                ]),
            ],

            'is_featured' => [
                'sometimes',
                'boolean',
            ],

            'display_order' => [
                'sometimes',
                'integer',
                'min:0',
            ],

            'tax_class' => [
                'sometimes',
                'nullable',
                'string',
                'max:100',
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

            'tags' => [
                'sometimes',
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
