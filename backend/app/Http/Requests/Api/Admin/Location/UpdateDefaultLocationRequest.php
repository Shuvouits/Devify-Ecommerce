<?php

namespace App\Http\Requests\Api\Admin\Location;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDefaultLocationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'location_id' => [
                'required',
                'integer',
                'exists:locations,id',
            ],
        ];
    }


    public function messages(): array
    {
        return [
            'location_id.required' =>
                'Please select a default location.',

            'location_id.integer' =>
                'The selected location is invalid.',

            'location_id.exists' =>
                'The selected location does not exist.',
        ];
    }
}
