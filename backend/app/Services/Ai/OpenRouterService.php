<?php

namespace App\Services\Ai;

use App\Repositories\Ai\AiSettingRepositoryInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

class OpenRouterService
{
    public function __construct(
        protected AiSettingRepositoryInterface $repository
    ) {
    }


    public function generateText(
        string $systemPrompt,
        string $userPrompt,
        array $options = []
    ): string {
        $settings =
            $this->repository
                ->getSettings();


        if (!$settings) {
            throw ValidationException::withMessages([
                'ai' => [
                    'AI configuration has not been set up.',
                ],
            ]);
        }


        if (!$settings->is_enabled) {
            throw ValidationException::withMessages([
                'ai' => [
                    'AI configuration is currently disabled.',
                ],
            ]);
        }


        if (blank($settings->api_key)) {
            throw ValidationException::withMessages([
                'ai' => [
                    'OpenRouter API key is not configured.',
                ],
            ]);
        }


        $response =
            Http::timeout(60)
                ->acceptJson()
                ->withToken(
                    $settings->api_key
                )
                ->post(
                    $settings->url,
                    [
                        'model' =>
                            $settings->model,

                        'messages' => [
                            [
                                'role' =>
                                    'system',

                                'content' =>
                                    $systemPrompt,
                            ],
                            [
                                'role' =>
                                    'user',

                                'content' =>
                                    $userPrompt,
                            ],
                        ],

                        'temperature' =>
                            $options['temperature']
                                ?? 0.7,

                        'max_tokens' =>
                            $options['max_tokens']
                                ?? 300,
                    ]
                );


        if ($response->failed()) {
            $message =
                $response->json(
                    'error.message'
                )
                ?? 'OpenRouter could not generate content.';


            throw ValidationException::withMessages([
                'ai' => [
                    $message,
                ],
            ]);
        }


        $content =
            data_get(
                $response->json(),
                'choices.0.message.content'
            );


        if (blank($content)) {
            throw ValidationException::withMessages([
                'ai' => [
                    'OpenRouter returned an empty response.',
                ],
            ]);
        }


        return trim($content);
    }


    /*
|--------------------------------------------------------------------------
| Get Image Generation Models
|--------------------------------------------------------------------------
*/

public function getImageModels(): array
{
    $settings =
        $this->repository
            ->getSettings();


    if (!$settings) {
        throw ValidationException::withMessages([
            'ai' => [
                'AI configuration has not been set up.',
            ],
        ]);
    }


    if (blank($settings->api_key)) {
        throw ValidationException::withMessages([
            'ai' => [
                'OpenRouter API key is not configured.',
            ],
        ]);
    }


    $endpoint =
        rtrim(
            $settings->base_url,
            '/'
        ) .
        '/images/models';


    $response =
        Http::timeout(30)
            ->acceptJson()
            ->withToken(
                $settings->api_key
            )
            ->get(
                $endpoint
            );


    if ($response->failed()) {
        $message =
            $response->json(
                'error.message'
            )
            ?? 'Unable to retrieve OpenRouter image models.';


        throw ValidationException::withMessages([
            'ai' => [
                $message,
            ],
        ]);
    }


    $models =
        $response->json(
            'data'
        ) ?? [];


    return collect($models)
        ->map(function ($model) {
            return [
                'id' =>
                    $model['id'] ??
                    null,

                'name' =>
                    $model['name'] ??
                    $model['id'] ??
                    null,

                'supported_parameters' =>
                    $model['supported_parameters']
                    ?? [],

                'supports_streaming' =>
                    (bool) (
                        $model['supports_streaming']
                        ?? false
                    ),
            ];
        })
        ->filter(
            fn ($model) =>
                filled(
                    $model['id']
                )
        )
        ->values()
        ->all();
}


/*
|--------------------------------------------------------------------------
| Generate Image
|--------------------------------------------------------------------------
*/

public function generateImage(
    array $data
): array {
    $settings =
        $this->repository
            ->getSettings();


    if (!$settings) {
        throw ValidationException::withMessages([
            'ai' => [
                'AI configuration has not been set up.',
            ],
        ]);
    }


    if (!$settings->is_enabled) {
        throw ValidationException::withMessages([
            'ai' => [
                'AI configuration is currently disabled.',
            ],
        ]);
    }


    if (blank($settings->api_key)) {
        throw ValidationException::withMessages([
            'ai' => [
                'OpenRouter API key is not configured.',
            ],
        ]);
    }


    if (blank($settings->image_model)) {
        throw ValidationException::withMessages([
            'ai' => [
                'An AI image model has not been selected.',
            ],
        ]);
    }


    $endpoint =
        rtrim(
            $settings->base_url,
            '/'
        ) .
        '/images';


    /*
    |--------------------------------------------------------------------------
    | Request Payload
    |--------------------------------------------------------------------------
    */

    $payload = [
        'model' =>
            $settings->image_model,

        'prompt' =>
            $data['prompt'],

        'n' =>
            1,
    ];


    if (
        !empty(
            $data['aspect_ratio']
        )
    ) {
        $payload['aspect_ratio'] =
            $data['aspect_ratio'];
    }


    if (
        !empty(
            $data['quality']
        )
    ) {
        $payload['quality'] =
            $data['quality'];
    }


    if (
        !empty(
            $data['background']
        )
    ) {
        $payload['background'] =
            $data['background'];
    }


    /*
    |--------------------------------------------------------------------------
    | OpenRouter Request
    |--------------------------------------------------------------------------
    */

    $response =
        Http::timeout(180)
            ->acceptJson()
            ->withToken(
                $settings->api_key
            )
            ->post(
                $endpoint,
                $payload
            );


    if ($response->failed()) {
        $message =
            $response->json(
                'error.message'
            )
            ?? $response->json(
                'message'
            )
            ?? 'OpenRouter could not generate the image.';


        throw ValidationException::withMessages([
            'ai' => [
                $message,
            ],
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Image Response
    |--------------------------------------------------------------------------
    */

    $imageBase64 =
        data_get(
            $response->json(),
            'data.0.b64_json'
        );


    $mediaType =
        data_get(
            $response->json(),
            'data.0.media_type'
        )
        ?? 'image/png';


    if (blank($imageBase64)) {
        throw ValidationException::withMessages([
            'ai' => [
                'OpenRouter returned an empty image response.',
            ],
        ]);
    }


    return [
        'base64' =>
            $imageBase64,

        'media_type' =>
            $mediaType,

        'model' =>
            $settings->image_model,

        'usage' => [
            'cost' =>
                data_get(
                    $response->json(),
                    'usage.cost'
                ),

            'prompt_tokens' =>
                data_get(
                    $response->json(),
                    'usage.prompt_tokens'
                ),

            'completion_tokens' =>
                data_get(
                    $response->json(),
                    'usage.completion_tokens'
                ),

            'total_tokens' =>
                data_get(
                    $response->json(),
                    'usage.total_tokens'
                ),
        ],
    ];
}




}
