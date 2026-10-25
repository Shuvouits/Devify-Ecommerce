<?php

namespace App\Http\Requests\Api\Admin\GlobalVariant;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGlobalVariantRequest extends FormRequest
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
                'max:120',
            ],

            'visual_type' => [
                'sometimes',
                'required',
                'string',
                Rule::in([
                    'rectangle',
                    'color',
                ]),
            ],

            'display_order' => [
                'sometimes',
                'nullable',
                'integer',
                'min:0',
            ],

            'is_active' => [
                'sometimes',
                'boolean',
            ],

            'options' => [
                'sometimes',
                'required',
                'array',
                'min:1',
            ],

            'options.*.id' => [
                'nullable',
                'integer',
                Rule::exists(
                    'global_variant_options',
                    'id'
                )->where(
                    fn ($query) =>
                        $query->where(
                            'global_variant_id',
                            $this->route('id')
                        )
                ),
            ],

            'options.*.value' => [
                'required_with:options',
                'string',
                'max:150',
            ],

            'options.*.color_hex' => [
                'nullable',
                'string',
                'max:20',
            ],

            'options.*.display_order' => [
                'nullable',
                'integer',
                'min:1',
            ],

            'options.*.is_active' => [
                'nullable',
                'boolean',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' =>
                'Variant name is required.',

            'name.max' =>
                'Variant name may not be greater than 120 characters.',

            'visual_type.required' =>
                'Visual type is required.',

            'visual_type.in' =>
                'Visual type must be either rectangle or color.',

            'options.required' =>
                'At least one option value is required.',

            'options.array' =>
                'Options must be a valid list.',

            'options.min' =>
                'At least one option value is required.',

            'options.*.id.integer' =>
                'Option ID must be a valid number.',

            'options.*.id.exists' =>
                'One of the selected variant options is invalid.',

            'options.*.value.required_with' =>
                'Each option must have a value.',

            'options.*.value.max' =>
                'Option values may not be greater than 150 characters.',

            'options.*.display_order.integer' =>
                'Option display order must be a valid number.',

            'options.*.display_order.min' =>
                'Option display order must be at least 1.',

            'options.*.is_active.boolean' =>
                'Option status must be true or false.',

            'is_active.boolean' =>
                'Variant status must be true or false.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $data = [];

        /*
        |--------------------------------------------------------------------------
        | Variant Active State
        |--------------------------------------------------------------------------
        */

        if (
            array_key_exists(
                'is_active',
                $this->all()
            )
        ) {
            $data['is_active'] =
                $this->boolean(
                    'is_active'
                );
        }

        /*
        |--------------------------------------------------------------------------
        | Option Active States
        |--------------------------------------------------------------------------
        */

        if (
            array_key_exists(
                'options',
                $this->all()
            )
        ) {
            $options =
                $this->input(
                    'options',
                    []
                );

            if (is_array($options)) {
                $options =
                    array_map(
                        function ($option) {
                            if (
                                array_key_exists(
                                    'is_active',
                                    $option
                                )
                            ) {
                                $option['is_active'] =
                                    filter_var(
                                        $option['is_active'],
                                        FILTER_VALIDATE_BOOLEAN
                                    );
                            }

                            return $option;
                        },
                        $options
                    );

                $data['options'] =
                    $options;
            }
        }

        if (!empty($data)) {
            $this->merge(
                $data
            );
        }
    }
}
