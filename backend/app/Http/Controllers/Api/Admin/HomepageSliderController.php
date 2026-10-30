<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\HomepageSliderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HomepageSliderController extends Controller
{
    public function __construct(
        protected HomepageSliderService $homepageSliderService
    ) {
    }

    /*
    |--------------------------------------------------------------------------
    | Slider List
    |--------------------------------------------------------------------------
    */

    public function index(): JsonResponse
    {
        $sliders =
            $this->homepageSliderService
                ->getAll();

        return response()->json([
            'success' => true,
            'data' => $sliders,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Show Single Slider
    |--------------------------------------------------------------------------
    */

    public function show(
        int $id
    ): JsonResponse {
        $slider =
            $this->homepageSliderService
                ->getById($id);

        return response()->json([
            'success' => true,
            'data' => $slider,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Create Slider
    |--------------------------------------------------------------------------
    */

    public function store(
        Request $request
    ): JsonResponse {
        $data = $request->validate([
            'title' => [
                'nullable',
                'string',
                'max:200',
            ],

            'image_path' => [
                'required',
                'string',
                'max:500',
            ],

            'link_url' => [
                'nullable',
                'string',
                'max:2048',
            ],

            'is_active' => [
                'sometimes',
                'boolean',
            ],

            'display_order' => [
                'sometimes',
                'integer',
                'min:0',
            ],
        ]);

        $data['is_active'] =
            $data['is_active'] ?? true;

        $data['display_order'] =
            $data['display_order'] ?? 0;

        $slider =
            $this->homepageSliderService
                ->create($data);

        return response()->json([
            'success' => true,
            'message' => 'Homepage slider created successfully.',
            'data' => $slider,
        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | Update Slider
    |--------------------------------------------------------------------------
    */

    public function update(
        Request $request,
        int $id
    ): JsonResponse {
        $data = $request->validate([
            'title' => [
                'sometimes',
                'nullable',
                'string',
                'max:200',
            ],

            'image_path' => [
                'sometimes',
                'required',
                'string',
                'max:500',
            ],

            'link_url' => [
                'sometimes',
                'nullable',
                'string',
                'max:2048',
            ],

            'is_active' => [
                'sometimes',
                'boolean',
            ],

            'display_order' => [
                'sometimes',
                'integer',
                'min:0',
            ],
        ]);

        $slider =
            $this->homepageSliderService
                ->update(
                    $id,
                    $data
                );

        return response()->json([
            'success' => true,
            'message' => 'Homepage slider updated successfully.',
            'data' => $slider,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Slider
    |--------------------------------------------------------------------------
    */

    public function destroy(
        int $id
    ): JsonResponse {
        $this->homepageSliderService
            ->delete($id);

        return response()->json([
            'success' => true,
            'message' => 'Homepage slider deleted successfully.',
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Upload Slider Image
    |--------------------------------------------------------------------------
    */

    public function uploadImage(
        Request $request
    ): JsonResponse {
        $data = $request->validate([
            'image' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],

            'title' => [
                'nullable',
                'string',
                'max:200',
            ],
        ]);

        $result =
            $this->homepageSliderService
                ->uploadSliderImage(
                    $request->file('image'),
                    $data['title'] ?? null
                );

        return response()->json([
            'success' => true,
            'message' => 'Homepage slider image uploaded successfully.',
            'data' => $result,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Slider Image
    |--------------------------------------------------------------------------
    */

    public function deleteImage(
        Request $request
    ): JsonResponse {
        $data = $request->validate([
            'path' => [
                'required',
                'string',
                'max:500',
            ],
        ]);

        $this->homepageSliderService
            ->deleteSliderImage(
                $data['path']
            );

        return response()->json([
            'success' => true,
            'message' => 'Homepage slider image deleted successfully.',
        ]);
    }
}
