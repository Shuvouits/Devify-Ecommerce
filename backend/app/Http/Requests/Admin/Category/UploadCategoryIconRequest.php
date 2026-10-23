<?php

namespace App\Http\Requests\Admin\Category;

use Illuminate\Foundation\Http\FormRequest;

class UploadCategoryIconRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'icon' => [
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
            'icon.required' =>
                'Category icon is required.',

            'icon.image' =>
                'The uploaded file must be an image.',

            'icon.mimes' =>
                'Category icon must be JPG, JPEG, PNG, or WebP.',

            'icon.max' =>
                'Category icon must not exceed 5 MB.',
        ];
    }
}
