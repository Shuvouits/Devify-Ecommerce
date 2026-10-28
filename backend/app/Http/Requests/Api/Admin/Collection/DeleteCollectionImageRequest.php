<?php

namespace App\Http\Requests\Api\Admin\Collection;

use Illuminate\Foundation\Http\FormRequest;

class DeleteCollectionImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'path' => [
                'required',
                'string',
                'max:500',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'path.required' =>
                'Collection image path is required.',

            'path.string' =>
                'Collection image path must be a valid string.',

            'path.max' =>
                'Collection image path is too long.',
        ];
    }
}
