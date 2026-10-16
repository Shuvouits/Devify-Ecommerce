<?php

namespace App\Services\Brand;

use Illuminate\Support\Str;

class BrandSeoService
{
    public function analyze(
        array $data
    ): array {
        $brandName =
            trim(
                $data['brand_name']
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

        $website =
            trim(
                $data['website'] ??
                ''
            );

        $hasLogo =
            (bool) (
                $data['has_logo'] ??
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
                passed: filled($seoTitle),
                points: 15,
                message: filled($seoTitle)
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
                points: 15,
                message:
                    $titleLength >= 30 &&
                    $titleLength <= 70
                        ? 'The page title length is within the recommended range.'
                        : 'Keep the page title between 30 and 70 characters.'
            );


        /*
        |--------------------------------------------------------------------------
        | Brand Name In Title
        |--------------------------------------------------------------------------
        */

        $brandInTitle =
            filled($seoTitle) &&
            Str::contains(
                Str::lower(
                    $seoTitle
                ),
                Str::lower(
                    $brandName
                )
            );


        $checks[] =
            $this->check(
                key: 'brand_in_title',
                label: 'Brand name in page title',
                passed: $brandInTitle,
                points: 10,
                message: $brandInTitle
                    ? 'The brand name appears in the page title.'
                    : 'Include the brand name naturally in the page title.'
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
                points: 15,
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
                points: 15,
                message:
                    $metaLength >= 100 &&
                    $metaLength <= 160
                        ? 'The meta description length is within the recommended range.'
                        : 'Keep the meta description between 100 and 160 characters.'
            );


        /*
        |--------------------------------------------------------------------------
        | URL Handle
        |--------------------------------------------------------------------------
        */

        $validSlug =
            filled($slug) &&
            $slug ===
                Str::slug(
                    $slug
                );


        $checks[] =
            $this->check(
                key: 'valid_slug',
                label: 'SEO-friendly URL handle',
                passed: $validSlug,
                points: 10,
                message: $validSlug
                    ? 'The URL handle is SEO friendly.'
                    : 'Use a short lowercase URL handle with hyphens.'
            );


        /*
        |--------------------------------------------------------------------------
        | Brand Description
        |--------------------------------------------------------------------------
        */

        $descriptionLength =
            mb_strlen(
                $description
            );


        $checks[] =
            $this->check(
                key: 'brand_description',
                label: 'Brand description',
                passed:
                    $descriptionLength >= 50,
                points: 10,
                message:
                    $descriptionLength >= 50
                        ? 'The brand has useful descriptive content.'
                        : 'Add a more useful brand description.'
            );


        /*
        |--------------------------------------------------------------------------
        | Website
        |--------------------------------------------------------------------------
        */

        $checks[] =
            $this->check(
                key: 'website',
                label: 'Official website',
                passed: filled(
                    $website
                ),
                points: 5,
                message: filled($website)
                    ? 'An official website is provided.'
                    : 'Add the brand website when available.'
            );


        /*
        |--------------------------------------------------------------------------
        | Logo
        |--------------------------------------------------------------------------
        */

        $checks[] =
            $this->check(
                key: 'logo',
                label: 'Brand logo',
                passed: $hasLogo,
                points: 5,
                message: $hasLogo
                    ? 'A brand logo is available.'
                    : 'Add a brand logo.'
            );


        /*
        |--------------------------------------------------------------------------
        | Calculate Score
        |--------------------------------------------------------------------------
        */

        $score =
            collect($checks)
                ->sum(
                    fn ($check) =>
                        $check['earned_points']
                );


        $maxScore =
            collect($checks)
                ->sum(
                    fn ($check) =>
                        $check['points']
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
        if ($score >= 80) {
            return 'good';
        }


        if ($score >= 50) {
            return 'needs_improvement';
        }


        return 'poor';
    }
}
