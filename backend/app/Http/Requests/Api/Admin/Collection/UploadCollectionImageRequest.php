<?php

namespace App\Http\Requests\Api\Admin\Collection;

use Illuminate\Foundation\Http\FormRequest;

class UploadCollectionImageRequest extends FormRequest
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

            'collection_title' => [
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
                'Collection image is required.',

            'image.image' =>
                'The uploaded file must be a valid image.',

            'image.mimes' =>
                'Collection image must be a JPG, JPEG, PNG, or WEBP file.',

            'image.max' =>
                'Collection image may not be larger than 5 MB.',
        ];
    }
}
