<?php

namespace App\Http\Requests\Api\Admin\Location;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLocationOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'locations' => [
                'required',
                'array',
                'min:1',
            ],

            'locations.*' => [
                'required',
                'integer',
                'distinct',
                Rule::exists(
                    'locations',
                    'id'
                )->where(
                    fn ($query) =>
                        $query->where(
                            'status',
                            'active'
                        )
                ),
            ],
        ];
    }


    public function messages(): array
    {
        return [
            'locations.required' =>
                'Location order is required.',

            'locations.array' =>
                'Location order must be a valid list.',

            'locations.min' =>
                'At least one location is required.',

            'locations.*.required' =>
                'Each location is required.',

            'locations.*.integer' =>
                'Each location must have a valid ID.',

            'locations.*.distinct' =>
                'The same location cannot appear more than once.',

            'locations.*.exists' =>
                'One or more selected locations are invalid or inactive.',
        ];
    }
}
