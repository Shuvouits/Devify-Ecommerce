<?php

namespace App\Http\Requests\Api\Admin\Product;

use Illuminate\Foundation\Http\FormRequest;

class DeleteProductImageRequest extends FormRequest
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
                'Product image path is required.',

            'path.string' =>
                'Product image path must be a valid string.',

            'path.max' =>
                'Product image path is too long.',
        ];
    }
}
