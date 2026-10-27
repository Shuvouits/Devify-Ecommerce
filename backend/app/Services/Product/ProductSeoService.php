<?php

namespace App\Services\Product;

use Illuminate\Support\Str;

class ProductSeoService
{
    public function analyze(
        array $data
    ): array {
        $productTitle =
            trim(
                $data['product_title']
            );

        $overview =
            trim(
                $data['overview'] ??
                ''
            );

        $description =
            trim(
                $data['description'] ??
                ''
            );

        $seoTitle =
            trim(
                $data['seo_title'] ??
                ''
            );

        $seoDescription =
            trim(
                $data['seo_description'] ??
                ''
            );

        $slug =
            trim(
                $data['slug'] ??
                ''
            );

        $brandName =
            trim(
                $data['brand_name'] ??
                ''
            );

        $categoryName =
            trim(
                $data['category_name'] ??
                ''
            );

        $hasMedia =
            (bool) (
                $data['has_media'] ??
                false
            );

        $hasPrice =
            (bool) (
                $data['has_price'] ??
                false
            );


        $checks = [];


        /*
        |--------------------------------------------------------------------------
        | SEO Title Exists
        |--------------------------------------------------------------------------
        */

        $checks[] =
            $this->check(
                key: 'title_exists',
                label: 'Page title added',
                passed: filled(
                    $seoTitle
                ),
                points: 10,
                message: filled(
                    $seoTitle
                )
                    ? 'A page title is present.'
                    : 'Add a page title for search engines.'
            );


        /*
        |--------------------------------------------------------------------------
        | SEO Title Length
        |--------------------------------------------------------------------------
        */

        $titleLength =
            mb_strlen(
                $seoTitle
            );


        $checks[] =
            $this->check(
                key: 'title_length',
                label: 'Page title length',
                passed:
                    $titleLength >= 30 &&
                    $titleLength <= 70,
                points: 10,
                message:
                    $titleLength >= 30 &&
                    $titleLength <= 70
                        ? 'The page title length is within the recommended range.'
                        : 'Keep the page title between 30 and 70 characters.'
            );


        /*
        |--------------------------------------------------------------------------
        | Product Title In SEO Title
        |--------------------------------------------------------------------------
        */

        $productInTitle =
            filled(
                $seoTitle
            ) &&
            Str::contains(
                Str::lower(
                    $seoTitle
                ),
                Str::lower(
                    $productTitle
                )
            );


        $checks[] =
            $this->check(
                key: 'product_in_title',
                label: 'Product title in page title',
                passed:
                    $productInTitle,
                points: 10,
                message:
                    $productInTitle
                        ? 'The product title appears in the page title.'
                        : 'Include the product title naturally in the page title.'
            );


        /*
        |--------------------------------------------------------------------------
        | Meta Description Exists
        |--------------------------------------------------------------------------
        */

        $checks[] =
            $this->check(
                key: 'meta_description_exists',
                label: 'Meta description added',
                passed: filled(
                    $seoDescription
                ),
                points: 10,
                message: filled(
                    $seoDescription
                )
                    ? 'A meta description is present.'
                    : 'Add a meta description for search results.'
            );


        /*
        |--------------------------------------------------------------------------
        | Meta Description Length
        |--------------------------------------------------------------------------
        */

        $metaLength =
            mb_strlen(
                $seoDescription
            );


        $checks[] =
            $this->check(
                key: 'meta_description_length',
                label: 'Meta description length',
                passed:
                    $metaLength >= 100 &&
                    $metaLength <= 160,
                points: 10,
                message:
                    $metaLength >= 100 &&
                    $metaLength <= 160
                        ? 'The meta description length is within the recommended range.'
                        : 'Keep the meta description between 100 and 160 characters.'
            );


        /*
        |--------------------------------------------------------------------------
        | SEO Friendly Slug
        |--------------------------------------------------------------------------
        */

        $validSlug =
            filled(
                $slug
            ) &&
            $slug ===
                Str::slug(
                    $slug
                );


        $checks[] =
            $this->check(
                key: 'valid_slug',
                label: 'SEO-friendly URL handle',
                passed:
                    $validSlug,
                points: 10,
                message:
                    $validSlug
                        ? 'The URL handle is SEO friendly.'
                        : 'Use a short lowercase URL handle with hyphens.'
            );


        /*
        |--------------------------------------------------------------------------
        | Product Content
        |--------------------------------------------------------------------------
        */

        $contentLength =
            mb_strlen(
                trim(
                    $overview .
                    ' ' .
                    $description
                )
            );


        $checks[] =
            $this->check(
                key: 'product_content',
                label: 'Product content',
                passed:
                    $contentLength >= 100,
                points: 15,
                message:
                    $contentLength >= 100
                        ? 'The product has useful descriptive content.'
                        : 'Add more useful product information for shoppers and search engines.'
            );


        /*
        |--------------------------------------------------------------------------
        | Product Media
        |--------------------------------------------------------------------------
        */

        $checks[] =
            $this->check(
                key: 'product_media',
                label: 'Product media',
                passed:
                    $hasMedia,
                points: 10,
                message:
                    $hasMedia
                        ? 'Product media is available.'
                        : 'Add at least one product image.'
            );


        /*
        |--------------------------------------------------------------------------
        | Product Price
        |--------------------------------------------------------------------------
        */

        $checks[] =
            $this->check(
                key: 'product_price',
                label: 'Product price',
                passed:
                    $hasPrice,
                points: 10,
                message:
                    $hasPrice
                        ? 'A product price is available.'
                        : 'Add a product price.'
            );


        /*
        |--------------------------------------------------------------------------
        | Product Organization
        |--------------------------------------------------------------------------
        */

        $hasOrganization =
            filled(
                $brandName
            ) ||
            filled(
                $categoryName
            );


        $checks[] =
            $this->check(
                key: 'product_organization',
                label: 'Brand or category assigned',
                passed:
                    $hasOrganization,
                points: 5,
                message:
                    $hasOrganization
                        ? 'The product is connected to a brand or category.'
                        : 'Assign a brand or category to improve product context.'
            );


        /*
        |--------------------------------------------------------------------------
        | Calculate Score
        |--------------------------------------------------------------------------
        */

        $score =
            collect(
                $checks
            )
                ->sum(
                    fn ($check) =>
                        $check[
                            'earned_points'
                        ]
                );


        $maxScore =
            collect(
                $checks
            )
                ->sum(
                    fn ($check) =>
                        $check[
                            'points'
                        ]
                );


        return [
            'score' =>
                $score,

            'max_score' =>
                $maxScore,

            'percentage' =>
                $maxScore > 0
                    ? (int) round(
                        (
                            $score /
                            $maxScore
                        ) * 100
                    )
                    : 0,

            'status' =>
                $this->getStatus(
                    $score
                ),

            'checks' =>
                $checks,
        ];
    }


    private function check(
        string $key,
        string $label,
        bool $passed,
        int $points,
        string $message
    ): array {
        return [
            'key' =>
                $key,

            'label' =>
                $label,

            'passed' =>
                $passed,

            'points' =>
                $points,

            'earned_points' =>
                $passed
                    ? $points
                    : 0,

            'message' =>
                $message,
        ];
    }


    private function getStatus(
        int $score
    ): string {
        if (
            $score >= 80
        ) {
            return 'good';
        }


        if (
            $score >= 50
        ) {
            return 'needs_improvement';
        }


        return 'poor';
    }
}
