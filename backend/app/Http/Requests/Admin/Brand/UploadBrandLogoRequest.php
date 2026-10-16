<?php

namespace App\Http\Requests\Admin\Brand;

use Illuminate\Foundation\Http\FormRequest;

class UploadBrandLogoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'logo' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],
        ];
    }


    public function messages(): array
    {
        return [
            'logo.required' =>
                'Please select a brand logo.',

            'logo.image' =>
                'The logo must be a valid image.',

            'logo.mimes' =>
                'The logo must be a JPG, JPEG, PNG, or WEBP file.',

            'logo.max' =>
                'The logo may not be larger than 5 MB.',
        ];
    }
}
