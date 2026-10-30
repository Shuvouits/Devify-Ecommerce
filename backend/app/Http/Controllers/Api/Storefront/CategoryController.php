<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\Admin\HomepageSectionService;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function __construct(
        protected HomepageSectionService $homepageSectionService
    ) {
    }

    public function featured(): JsonResponse
    {
        $section =
            $this->homepageSectionService
                ->getSection(
                    'featured_categories'
                );

        $categories = Category::query()
            ->where('status', 'active')
            ->whereNull('archived_at')
            ->whereNull('parent_id')
            ->where('is_featured', true)
            ->orderBy('display_order')
            ->orderBy('name')
            ->limit(
                $section->item_limit
            )
            ->get();

        return response()->json([
            'success' => true,

            'section' => [
                'section_key' =>
                    $section->section_key,

                'is_active' =>
                    $section->is_active,

                'item_limit' =>
                    $section->item_limit,
            ],

            'data' =>
                CategoryResource::collection(
                    $categories
                )->resolve(),
        ]);
    }
}
