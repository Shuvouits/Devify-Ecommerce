<?php

namespace App\Http\Requests\Api\Admin\Collection;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCollectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            /*
            |--------------------------------------------------------------------------
            | Collection Details
            |--------------------------------------------------------------------------
            */

            'title' => [
                'required',
                'string',
                'max:180',
            ],

            'slug' => [
                'nullable',
                'string',
                'max:200',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'image_path' => [
                'nullable',
                'string',
                'max:500',
            ],


            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */

            'status' => [
                'nullable',
                'string',
                Rule::in([
                    'draft',
                    'active',
                ]),
            ],


            /*
            |--------------------------------------------------------------------------
            | Publishing
            |--------------------------------------------------------------------------
            */

            'publish_online_store' => [
                'nullable',
                'boolean',
            ],

            'publish_point_of_sale' => [
                'nullable',
                'boolean',
            ],


            /*
            |--------------------------------------------------------------------------
            | Kind
            |--------------------------------------------------------------------------
            */

            'kind' => [
                'nullable',
                'string',
                Rule::in([
                    'collection',
                    'look',
                ]),
            ],


            /*
            |--------------------------------------------------------------------------
            | Collection Type
            |--------------------------------------------------------------------------
            */

            'collection_type' => [
                'nullable',
                'string',
                Rule::in([
                    'manual',
                    'automated',
                ]),
            ],


            /*
            |--------------------------------------------------------------------------
            | Automated Collection
            |--------------------------------------------------------------------------
            */

            'automation_match_type' => [
                'nullable',
                'string',
                Rule::in([
                    'all',
                    'any',
                ]),
            ],

            'automation_conditions' => [
                'nullable',
                'array',
            ],

            'automation_conditions.*.field' => [
                'required_with:automation_conditions',
                'string',
                'max:100',
            ],

            'automation_conditions.*.operator' => [
                'required_with:automation_conditions',
                'string',
                'max:50',
            ],

            'automation_conditions.*.value' => [
                'nullable',
            ],


            /*
            |--------------------------------------------------------------------------
            | Sorting & Display
            |--------------------------------------------------------------------------
            */

            'sort_order' => [
                'nullable',
                'string',
                Rule::in([
                    'manual',
                    'best_selling',
                    'alphabetical_asc',
                    'alphabetical_desc',
                    'price_asc',
                    'price_desc',
                    'newest',
                    'oldest',
                ]),
            ],

            'display_position' => [
                'nullable',
                'integer',
                'min:0',
            ],


            /*
            |--------------------------------------------------------------------------
            | SEO
            |--------------------------------------------------------------------------
            */

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


    public function messages(): array
    {
        return [
            'title.required' =>
                'Collection title is required.',

            'title.max' =>
                'Collection title may not be greater than 180 characters.',

            'status.in' =>
                'Collection status must be draft or active.',

            'kind.in' =>
                'Collection kind must be collection or look.',

            'collection_type.in' =>
                'Collection type must be manual or automated.',

            'automation_match_type.in' =>
                'Automation match type must be all or any.',

            'automation_conditions.array' =>
                'Automation conditions must be a valid list.',

            'automation_conditions.*.field.required_with' =>
                'Each automation condition requires a field.',

            'automation_conditions.*.operator.required_with' =>
                'Each automation condition requires an operator.',

            'sort_order.in' =>
                'The selected collection sort order is invalid.',

            'display_position.integer' =>
                'Display position must be a valid number.',

            'display_position.min' =>
                'Display position cannot be negative.',

            'seo_title.max' =>
                'SEO title may not be greater than 70 characters.',

            'seo_description.max' =>
                'SEO description may not be greater than 160 characters.',
        ];
    }


    protected function prepareForValidation(): void
    {
        $data = [];

        /*
        |--------------------------------------------------------------------------
        | Boolean Fields
        |--------------------------------------------------------------------------
        */

        if (
            array_key_exists(
                'publish_online_store',
                $this->all()
            )
        ) {
            $data['publish_online_store'] =
                $this->boolean(
                    'publish_online_store'
                );
        }

        if (
            array_key_exists(
                'publish_point_of_sale',
                $this->all()
            )
        ) {
            $data['publish_point_of_sale'] =
                $this->boolean(
                    'publish_point_of_sale'
                );
        }

        /*
        |--------------------------------------------------------------------------
        | Empty Slug
        |--------------------------------------------------------------------------
        */

        if (
            array_key_exists(
                'slug',
                $this->all()
            ) &&
            trim(
                (string) $this->input('slug')
            ) === ''
        ) {
            $data['slug'] = null;
        }

        if (!empty($data)) {
            $this->merge($data);
        }
    }
}
