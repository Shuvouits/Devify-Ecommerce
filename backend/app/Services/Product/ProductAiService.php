<?php

namespace App\Services\Product;

use App\Services\Ai\OpenRouterService;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ProductAiService
{
    public function __construct(
        protected OpenRouterService $openRouter
    ) {
    }


    /*
    |--------------------------------------------------------------------------
    | Generate Product Description
    |--------------------------------------------------------------------------
    */

    public function generateDescription(
        array $data
    ): string {
        $tone =
            $this->getToneInstruction(
                $data['tone']
            );


        $systemPrompt = <<<PROMPT
You are an ecommerce product copywriter.

Write a useful product description for an ecommerce product page.

Rules:
- Return only the final product description.
- Do not use markdown.
- Do not wrap the response in quotation marks.
- Do not invent specifications, materials, dimensions, benefits, certifications, or claims that were not provided.
- Use the available product, brand, category, and overview information as context.
- Focus on what the product is, who it is useful for, and its practical value.
- Avoid exaggerated marketing claims.
- Avoid repetitive wording.
- Keep the copy clear and easy to scan.
- Maximum 2000 characters.
- Use this tone: {$tone}.
PROMPT;


        $userPrompt =
            "Product title: " .
            $data['product_title'];


        if (
            !empty(
                $data['brand_name']
            )
        ) {
            $userPrompt .=
                "\nBrand: " .
                $data['brand_name'];
        }


        if (
            !empty(
                $data['category_name']
            )
        ) {
            $userPrompt .=
                "\nCategory: " .
                $data['category_name'];
        }


        if (
            !empty(
                $data['overview']
            )
        ) {
            $userPrompt .=
                "\nProduct overview: " .
                $data['overview'];
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
                            700,
                    ]
                );


        return trim(
            mb_substr(
                $description,
                0,
                2000
            )
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Generate Product SEO
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

Generate SEO metadata for a product page.

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
- Do not include a domain or "products/" in the slug.
- Include the product title naturally where appropriate.
- Use brand and category context when useful.
- Do not invent unsupported product claims.
- Do not use markdown.
- Do not wrap the JSON in code fences.
- Avoid keyword stuffing.
- Write for ecommerce search intent.
- Use this tone: {$tone}.
PROMPT;


        $userPrompt =
            "Product title: " .
            $data['product_title'];


        if (
            !empty(
                $data['brand_name']
            )
        ) {
            $userPrompt .=
                "\nBrand: " .
                $data['brand_name'];
        }


        if (
            !empty(
                $data['category_name']
            )
        ) {
            $userPrompt .=
                "\nCategory: " .
                $data['category_name'];
        }


        if (
            !empty(
                $data['overview']
            )
        ) {
            $userPrompt .=
                "\nProduct overview: " .
                $data['overview'];
        }


        if (
            !empty(
                $data['description']
            )
        ) {
            $userPrompt .=
                "\nProduct description: " .
                $data['description'];
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
            trim(
                $response
            );


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
                trim(
                    $cleaned
                ),
                true
            );


        if (
            !is_array(
                $seo
            )
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
                    $data['product_title']
                )
            );


        if (
            blank(
                $title
            )
        ) {
            $title =
                $data['product_title'];
        }


        if (
            blank(
                $slug
            )
        ) {
            $slug =
                Str::slug(
                    $data['product_title']
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


    /*
    |--------------------------------------------------------------------------
    | Tone
    |--------------------------------------------------------------------------
    */

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
}
