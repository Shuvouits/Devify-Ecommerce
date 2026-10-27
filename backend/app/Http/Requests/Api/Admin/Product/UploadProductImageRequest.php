<?php

namespace App\Http\Requests\Api\Admin\Product;

use Illuminate\Foundation\Http\FormRequest;

class UploadProductImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'image' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],

            'product_title' => [
                'nullable',
                'string',
                'max:200',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'image.required' =>
                'Product image is required.',

            'image.image' =>
                'The uploaded file must be a valid image.',

            'image.mimes' =>
                'Product image must be a JPG, JPEG, PNG, or WEBP file.',

            'image.max' =>
                'Product image may not be larger than 5 MB.',
        ];
    }
}
