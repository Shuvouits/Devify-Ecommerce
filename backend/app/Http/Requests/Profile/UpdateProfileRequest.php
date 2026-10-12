<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    /*
    |--------------------------------------------------------------------------
    | Authorization
    |--------------------------------------------------------------------------
    */

    public function authorize(): bool
    {
        return auth('api')->check();
    }


    /*
    |--------------------------------------------------------------------------
    | Validation Rules
    |--------------------------------------------------------------------------
    */

    public function rules(): array
    {
        $userId =
            auth('api')->id();


        return [
            'first_name' => [
                'required',
                'string',
                'max:100',
            ],

            'last_name' => [
                'nullable',
                'string',
                'max:100',
            ],

            'email' => [
                'required',
                'email',
                'max:255',

                Rule::unique(
                    'users',
                    'email'
                )->ignore(
                    $userId
                ),
            ],

            'phone' => [
                'nullable',
                'string',
                'max:30',
            ],

            'birthday' => [
                'nullable',
                'date',
                'before_or_equal:today',
            ],

            'gender' => [
                'nullable',

                Rule::in([
                    'male',
                    'female',
                    'other',
                    'prefer_not_to_say',
                ]),
            ],
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | Validation Messages
    |--------------------------------------------------------------------------
    */

    public function messages(): array
    {
        return [
            'first_name.required' =>
                'First name is required.',

            'first_name.max' =>
                'First name may not be greater than 100 characters.',

            'last_name.max' =>
                'Last name may not be greater than 100 characters.',

            'email.required' =>
                'Email address is required.',

            'email.email' =>
                'Please enter a valid email address.',

            'email.unique' =>
                'This email address is already in use.',

            'phone.max' =>
                'Phone number may not be greater than 30 characters.',

            'birthday.date' =>
                'Please enter a valid birthday.',

            'birthday.before_or_equal' =>
                'Birthday cannot be in the future.',

            'gender.in' =>
                'Please select a valid gender option.',
        ];
    }
}
