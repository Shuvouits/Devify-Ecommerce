<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\HomepageSectionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HomepageSectionController extends Controller
{
    public function __construct(
        protected HomepageSectionService $homepageSectionService
    ) {
    }

    public function show(
        string $sectionKey
    ): JsonResponse {
        $section =
            $this->homepageSectionService
                ->getSection(
                    $sectionKey
                );

        return response()->json([
            'success' => true,
            'data' => [
                'section' => $section,
            ],
        ]);
    }

    public function update(
        Request $request,
        string $sectionKey
    ): JsonResponse {
        $validated =
            $request->validate([
                'is_active' => [
                    'required',
                    'boolean',
                ],
                'item_limit' => [
                    'required',
                    'integer',
                    'min:1',
                    'max:24',
                ],
                'settings' => [
                    'nullable',
                    'array',
                ],
            ]);

        $section =
            $this->homepageSectionService
                ->updateSection(
                    $sectionKey,
                    $validated
                );

        return response()->json([
            'success' => true,
            'message' =>
                'Homepage section updated successfully.',
            'data' => [
                'section' => $section,
            ],
        ]);
    }
}
