<?php

namespace App\Http\Requests\Api\Admin\Location;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLocationRequest extends FormRequest
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

            'address' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'can_collect' => [
                'nullable',
                'boolean',
            ],

            'ships_online_orders' => [
                'nullable',
                'boolean',
            ],

            'sells_over_counter' => [
                'nullable',
                'boolean',
            ],

            'receives_returns' => [
                'nullable',
                'boolean',
            ],

            'is_default' => [
                'nullable',
                'boolean',
            ],

            'status' => [
                'nullable',
                Rule::in([
                    'active',
                    'inactive',
                ]),
            ],

            'delivery_order' => [
                'nullable',
                'integer',
                'min:1',
            ],
        ];
    }


    public function messages(): array
    {
        return [
            'name.required' =>
                'Location name is required.',

            'name.string' =>
                'Location name must be valid text.',

            'name.max' =>
                'Location name may not be greater than 150 characters.',

            'address.string' =>
                'Address must be valid text.',

            'address.max' =>
                'Address may not be greater than 1000 characters.',

            'can_collect.boolean' =>
                'Customers can collect here must be true or false.',

            'ships_online_orders.boolean' =>
                'Ship online orders from here must be true or false.',

            'sells_over_counter.boolean' =>
                'Sell over a counter here must be true or false.',

            'receives_returns.boolean' =>
                'Receive returns here must be true or false.',

            'is_default.boolean' =>
                'Default location must be true or false.',

            'status.in' =>
                'Status must be either active or inactive.',

            'delivery_order.integer' =>
                'Delivery order must be a valid number.',

            'delivery_order.min' =>
                'Delivery order must be at least 1.',
        ];
    }


    protected function prepareForValidation(): void
    {
        $this->merge([
            'can_collect' =>
                $this->boolean(
                    'can_collect'
                ),

            'ships_online_orders' =>
                $this->boolean(
                    'ships_online_orders'
                ),

            'sells_over_counter' =>
                $this->boolean(
                    'sells_over_counter'
                ),

            'receives_returns' =>
                $this->boolean(
                    'receives_returns'
                ),

            'is_default' =>
                $this->boolean(
                    'is_default'
                ),
        ]);
    }
}
