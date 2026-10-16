<?php

namespace App\Services\Brand;

use App\Services\Ai\OpenRouterService;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class BrandAiService
{
    public function __construct(
        protected OpenRouterService $openRouter
    ) {
    }


    public function generateDescription(
        array $data
    ): string {
        $tone =
            $this->getToneInstruction(
                $data['tone']
            );


        $systemPrompt = <<<PROMPT
You are an ecommerce content writer.

Write a concise brand description suitable for an ecommerce admin panel.

Rules:
- Maximum 500 characters.
- Return only the final description.
- Do not use markdown.
- Do not use quotation marks around the response.
- Do not invent specific facts that were not provided.
- Keep the description natural and useful for shoppers.
- Use the requested tone: {$tone}.
PROMPT;


        $userPrompt =
            "Brand name: " .
            $data['brand_name'];


        if (
            !empty(
                $data['website']
            )
        ) {
            $userPrompt .=
                "\nWebsite: " .
                $data['website'];
        }


        if (
            !empty(
                $data['prompt']
            )
        ) {
            $userPrompt .=
                "\nAdditional instructions: " .
                $data['prompt'];
        }


        $description =
            $this->openRouter
                ->generateText(
                    $systemPrompt,
                    $userPrompt,
                    [
                        'temperature' =>
                            0.7,

                        'max_tokens' =>
                            250,
                    ]
                );


        return trim(
            mb_substr(
                $description,
                0,
                500
            )
        );
    }


    private function getToneInstruction(
        string $tone
    ): string {
        return match ($tone) {
            'friendly' =>
                'friendly, approachable, and conversational',

            'professional' =>
                'professional, polished, and confident',

            'luxury' =>
                'premium, refined, and sophisticated',

            'playful' =>
                'playful, energetic, and light',

            'supportive' =>
                'helpful, reassuring, and supportive',

            default =>
                'clear, balanced, and professional',
        };
    }

    /*
|--------------------------------------------------------------------------
| Generate SEO
|--------------------------------------------------------------------------
*/

public function generateSeo(
    array $data
): array {
    $tone =
        $this->getToneInstruction(
            $data['tone']
        );


    $systemPrompt = <<<PROMPT
You are an ecommerce SEO copywriter.

Generate SEO metadata for a brand page.

Return valid JSON only in exactly this structure:

{
  "title": "...",
  "meta_description": "...",
  "slug": "..."
}

Rules:
- Page title must be 70 characters or fewer.
- Meta description must be 160 characters or fewer.
- Slug must be lowercase and URL friendly.
- Do not include a domain in the slug.
- Do not use markdown.
- Do not wrap the JSON in code fences.
- Do not invent unsupported factual claims.
- Keep the copy useful for ecommerce search intent.
- Use this tone: {$tone}.
PROMPT;


    $userPrompt =
        "Brand name: " .
        $data['brand_name'];


    if (
        !empty(
            $data['description']
        )
    ) {
        $userPrompt .=
            "\nBrand description: " .
            $data['description'];
    }


    if (
        !empty(
            $data['website']
        )
    ) {
        $userPrompt .=
            "\nWebsite: " .
            $data['website'];
    }


    if (
        !empty(
            $data['prompt']
        )
    ) {
        $userPrompt .=
            "\nAdditional SEO instructions: " .
            $data['prompt'];
    }


    $response =
        $this->openRouter
            ->generateText(
                $systemPrompt,
                $userPrompt,
                [
                    'temperature' =>
                        0.5,

                    'max_tokens' =>
                        300,
                ]
            );


    /*
    |--------------------------------------------------------------------------
    | Clean Possible Code Fences
    |--------------------------------------------------------------------------
    */

    $cleaned =
        trim($response);


    $cleaned =
        preg_replace(
            '/^```json\s*/i',
            '',
            $cleaned
        );


    $cleaned =
        preg_replace(
            '/^```\s*/',
            '',
            $cleaned
        );


    $cleaned =
        preg_replace(
            '/\s*```$/',
            '',
            $cleaned
        );


    /*
    |--------------------------------------------------------------------------
    | Decode JSON
    |--------------------------------------------------------------------------
    */

    $seo =
        json_decode(
            trim($cleaned),
            true
        );


    if (
        !is_array($seo)
    ) {
        throw ValidationException::withMessages([
            'ai' => [
                'AI returned an invalid SEO response. Please try again.',
            ],
        ]);
    }


    $title =
        trim(
            (string) (
                $seo['title'] ??
                ''
            )
        );


    $metaDescription =
        trim(
            (string) (
                $seo['meta_description'] ??
                ''
            )
        );


    $slug =
        Str::slug(
            (string) (
                $seo['slug'] ??
                $data['brand_name']
            )
        );


    if (blank($title)) {
        $title =
            $data['brand_name'];
    }


    if (blank($slug)) {
        $slug =
            Str::slug(
                $data['brand_name']
            );
    }


    return [
        'title' =>
            mb_substr(
                $title,
                0,
                70
            ),

        'meta_description' =>
            mb_substr(
                $metaDescription,
                0,
                160
            ),

        'slug' =>
            $slug,
    ];
}



}
