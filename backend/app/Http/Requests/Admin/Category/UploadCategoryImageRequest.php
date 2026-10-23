<?php

namespace App\Http\Requests\Admin\Category;

use Illuminate\Foundation\Http\FormRequest;

class UploadCategoryImageRequest extends FormRequest
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
                'file',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],
        ];
    }


    public function messages(): array
    {
        return [
            'image.required' =>
                'Category image is required.',

            'image.image' =>
                'The uploaded file must be an image.',

            'image.mimes' =>
                'Category image must be JPG, JPEG, PNG, or WebP.',

            'image.max' =>
                'Category image must not exceed 5 MB.',
        ];
    }
}
