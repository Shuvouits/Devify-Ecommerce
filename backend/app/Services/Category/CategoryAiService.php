<?php

namespace App\Services\Category;

use App\Models\Category;
use App\Services\Ai\OpenRouterService;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CategoryAiService
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

        $parentName =
            $this->getParentCategoryName(
                $data['parent_id'] ?? null
            );

        $systemPrompt = <<<PROMPT
You are an ecommerce category content writer.

Write a concise category description suitable for an ecommerce storefront and admin panel.

Rules:
- Maximum 500 characters.
- Return only the final description.
- Do not use markdown.
- Do not use quotation marks around the response.
- Do not invent specific products, brands, features, or claims that were not provided.
- Explain naturally what shoppers can expect from this category.
- Avoid keyword stuffing.
- Use the requested tone: {$tone}.
PROMPT;

        $userPrompt =
            "Category name: " .
            $data['category_name'];

        if ($parentName) {
            $userPrompt .=
                "\nParent category: " .
                $parentName;
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
                        'temperature' => 0.7,
                        'max_tokens' => 250,
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


    public function generateSeo(
        array $data
    ): array {
        $tone =
            $this->getToneInstruction(
                $data['tone']
            );

        $parentName =
            $this->getParentCategoryName(
                $data['parent_id'] ?? null
            );

        $systemPrompt = <<<PROMPT
You are an ecommerce SEO copywriter.

Generate SEO metadata for an ecommerce category page.

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
- Do not include a domain or "categories/" in the slug.
- Do not use markdown.
- Do not wrap the JSON in code fences.
- Do not invent unsupported products, brands, offers, or factual claims.
- Match ecommerce category search intent.
- Avoid keyword stuffing.
- Use this tone: {$tone}.
PROMPT;

        $userPrompt =
            "Category name: " .
            $data['category_name'];

        if (
            !empty(
                $data['description']
            )
        ) {
            $userPrompt .=
                "\nCategory description: " .
                $data['description'];
        }

        if ($parentName) {
            $userPrompt .=
                "\nParent category: " .
                $parentName;
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
                        'temperature' => 0.5,
                        'max_tokens' => 300,
                    ]
                );

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
                    $data['category_name']
                )
            );

        if (blank($title)) {
            $title =
                $data['category_name'];
        }

        if (blank($slug)) {
            $slug =
                Str::slug(
                    $data['category_name']
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


    private function getParentCategoryName(
        ?int $parentId
    ): ?string {
        if (!$parentId) {
            return null;
        }

        return Category::query()
            ->whereKey($parentId)
            ->value('name');
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
}
