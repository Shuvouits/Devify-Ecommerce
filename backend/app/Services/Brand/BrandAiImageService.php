<?php

namespace App\Services\Brand;

use App\Services\Ai\OpenRouterService;
use Illuminate\Support\Facades\File;
use Illuminate\Validation\ValidationException;

class BrandAiImageService
{
    public function __construct(
        protected OpenRouterService $openRouter
    ) {
    }


    /*
    |--------------------------------------------------------------------------
    | Generate Brand Image
    |--------------------------------------------------------------------------
    */

    public function generate(
        array $data,
        int $userId
    ): array {
        $result =
            $this->openRouter
                ->generateImage(
                    $data
                );


        /*
        |--------------------------------------------------------------------------
        | Decode Base64
        |--------------------------------------------------------------------------
        */

        $imageBytes =
            base64_decode(
                $result['base64'],
                true
            );


        if ($imageBytes === false) {
            throw ValidationException::withMessages([
                'ai' => [
                    'The generated image could not be decoded.',
                ],
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | Determine File Extension
        |--------------------------------------------------------------------------
        */

        $extension =
            $this->getExtension(
                $result['media_type']
            );


        /*
        |--------------------------------------------------------------------------
        | Directory
        |--------------------------------------------------------------------------
        */

        $relativeDirectory =
            'uploads/brands/ai-generated/' .
            $userId;


        $absoluteDirectory =
            public_path(
                $relativeDirectory
            );


        if (
            !File::exists(
                $absoluteDirectory
            )
        ) {
            File::makeDirectory(
                $absoluteDirectory,
                0755,
                true
            );
        }


        /*
        |--------------------------------------------------------------------------
        | File Name
        |--------------------------------------------------------------------------
        */

        $fileName =
            'brand-ai-' .
            now()->format(
                'YmdHis'
            ) .
            '-' .
            bin2hex(
                random_bytes(4)
            ) .
            '.' .
            $extension;


        $relativePath =
            $relativeDirectory .
            '/' .
            $fileName;


        $absolutePath =
            $absoluteDirectory .
            DIRECTORY_SEPARATOR .
            $fileName;


        /*
        |--------------------------------------------------------------------------
        | Save Generated Image
        |--------------------------------------------------------------------------
        */

        File::put(
            $absolutePath,
            $imageBytes
        );


        if (
            !File::exists(
                $absolutePath
            )
        ) {
            throw ValidationException::withMessages([
                'ai' => [
                    'The generated image could not be saved.',
                ],
            ]);
        }


        return [
            'path' =>
                $relativePath,

            'url' =>
                asset(
                    $relativePath
                ),

            'filename' =>
                $fileName,

            'media_type' =>
                $result['media_type'],

            'model' =>
                $result['model'],

            'usage' =>
                $result['usage'],
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | Media Type To Extension
    |--------------------------------------------------------------------------
    */

    private function getExtension(
        string $mediaType
    ): string {
        return match (
            strtolower(
                trim($mediaType)
            )
        ) {
            'image/png' =>
                'png',

            'image/jpeg',
            'image/jpg' =>
                'jpg',

            'image/webp' =>
                'webp',

            default =>
                throw ValidationException::withMessages([
                    'ai' => [
                        'The generated image format is not supported.',
                    ],
                ]),
        };
    }
}
