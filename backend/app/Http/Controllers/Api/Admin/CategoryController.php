<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Category\UploadCategoryIconRequest;
use App\Http\Requests\Admin\Category\UploadCategoryImageRequest;
use App\Http\Requests\Api\Admin\Category\StoreCategoryRequest;
use App\Http\Requests\Api\Admin\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Services\Admin\CategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(
        protected CategoryService $categoryService
    ) {
    }


    /*
    |--------------------------------------------------------------------------
    | Category List
    |--------------------------------------------------------------------------
    */

    public function index(
        Request $request
    ): JsonResponse {
        $categories =
            $this->categoryService
                ->getCategories(
                    $request->only([
                        'search',
                        'status',
                        'is_featured',
                        'parent_id',
                        'filter',
                        'sort_by',
                        'sort_direction',
                        'per_page',
                    ])
                );


        return response()->json([
            'success' =>
                true,

            'message' =>
                'Categories retrieved successfully.',

            'data' =>
                CategoryResource::collection(
                    $categories
                )
                    ->response()
                    ->getData(
                        true
                    ),
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Create Category
    |--------------------------------------------------------------------------
    */

    public function store(
        StoreCategoryRequest $request
    ): JsonResponse {
        $category =
            $this->categoryService
                ->createCategory(
                    $request->validated(),
                    auth('api')->id()
                );


        return response()->json([
            'success' =>
                true,

            'message' =>
                'Category created successfully.',

            'data' => [
                'category' =>
                    new CategoryResource(
                        $category
                    ),
            ],
        ], 201);
    }


    /*
    |--------------------------------------------------------------------------
    | Show Category
    |--------------------------------------------------------------------------
    */

    public function show(
        int $id
    ): JsonResponse {
        $category =
            $this->categoryService
                ->getCategory(
                    $id
                );


        return response()->json([
            'success' =>
                true,

            'message' =>
                'Category retrieved successfully.',

            'data' => [
                'category' =>
                    new CategoryResource(
                        $category
                    ),
            ],
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Update Category
    |--------------------------------------------------------------------------
    */

    public function update(
        UpdateCategoryRequest $request,
        int $id
    ): JsonResponse {
        $category =
            $this->categoryService
                ->updateCategory(
                    $id,
                    $request->validated()
                );


        return response()->json([
            'success' =>
                true,

            'message' =>
                'Category updated successfully.',

            'data' => [
                'category' =>
                    new CategoryResource(
                        $category
                    ),
            ],
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Upload Category Image
    |--------------------------------------------------------------------------
    */

    public function uploadImage(
        UploadCategoryImageRequest $request,
        int $id
    ): JsonResponse {
        $category =
            $this->categoryService
                ->uploadImage(
                    $id,
                    $request->file(
                        'image'
                    )
                );


        return response()->json([
            'success' =>
                true,

            'message' =>
                'Category image uploaded successfully.',

            'data' => [
                'category' =>
                    new CategoryResource(
                        $category
                    ),
            ],
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Category Image
    |--------------------------------------------------------------------------
    */

    public function deleteImage(
        int $id
    ): JsonResponse {
        $category =
            $this->categoryService
                ->deleteImage(
                    $id
                );


        return response()->json([
            'success' =>
                true,

            'message' =>
                'Category image removed successfully.',

            'data' => [
                'category' =>
                    new CategoryResource(
                        $category
                    ),
            ],
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Upload Category Icon
    |--------------------------------------------------------------------------
    */

    public function uploadIcon(
        UploadCategoryIconRequest $request,
        int $id
    ): JsonResponse {
        $category =
            $this->categoryService
                ->uploadIcon(
                    $id,
                    $request->file(
                        'icon'
                    )
                );


        return response()->json([
            'success' =>
                true,

            'message' =>
                'Category icon uploaded successfully.',

            'data' => [
                'category' =>
                    new CategoryResource(
                        $category
                    ),
            ],
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Category Icon
    |--------------------------------------------------------------------------
    */

    public function deleteIcon(
        int $id
    ): JsonResponse {
        $category =
            $this->categoryService
                ->deleteIcon(
                    $id
                );


        return response()->json([
            'success' =>
                true,

            'message' =>
                'Category icon removed successfully.',

            'data' => [
                'category' =>
                    new CategoryResource(
                        $category
                    ),
            ],
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Parent Category Options
    |--------------------------------------------------------------------------
    */

    public function parentOptions(
        Request $request
    ): JsonResponse {
        $excludeId =
            $request->filled(
                'exclude_id'
            )
                ? (int) $request->input(
                    'exclude_id'
                )
                : null;


        $categories =
            $this->categoryService
                ->getParentOptions(
                    $excludeId
                );


        $options =
            $categories
                ->map(
                    function ($category) {
                        return [
                            'id' =>
                                $category->id,

                            'name' =>
                                $category->name,

                            'level' =>
                                $category->getDepth(),

                            'parent_id' =>
                                $category->parent_id,

                            'path' =>
                                $this->buildCategoryPath(
                                    $category
                                ),

                            'can_have_children' =>
                                $category->canHaveChildren(),
                        ];
                    }
                )
                ->values();


        return response()->json([
            'success' =>
                true,

            'message' =>
                'Parent category options retrieved successfully.',

            'data' => [
                'categories' =>
                    $options,
            ],
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Archive Category
    |--------------------------------------------------------------------------
    */

    public function archive(
        int $id
    ): JsonResponse {
        $category =
            $this->categoryService
                ->archiveCategory(
                    $id
                );


        return response()->json([
            'success' =>
                true,

            'message' =>
                'Category archived successfully.',

            'data' => [
                'category' =>
                    new CategoryResource(
                        $category
                    ),
            ],
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Restore Category
    |--------------------------------------------------------------------------
    */

    public function restore(
        int $id
    ): JsonResponse {
        $category =
            $this->categoryService
                ->restoreCategory(
                    $id
                );


        return response()->json([
            'success' =>
                true,

            'message' =>
                'Category restored successfully.',

            'data' => [
                'category' =>
                    new CategoryResource(
                        $category
                    ),
            ],
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Category
    |--------------------------------------------------------------------------
    */

    public function destroy(
        int $id
    ): JsonResponse {
        $this->categoryService
            ->deleteCategory(
                $id
            );


        return response()->json([
            'success' =>
                true,

            'message' =>
                'Category deleted successfully.',
        ]);
    }



    /*
|--------------------------------------------------------------------------
| Restore Deleted Category
|--------------------------------------------------------------------------
*/

public function restoreDeleted(
    int $id
): JsonResponse {
    $category =
        $this->categoryService
            ->restoreDeletedCategory(
                $id
            );


    return response()->json([
        'success' =>
            true,

        'message' =>
            'Category restored from trash successfully.',

        'data' => [
            'category' =>
                new CategoryResource(
                    $category
                ),
        ],
    ]);
}


/*
|--------------------------------------------------------------------------
| Permanently Delete Category
|--------------------------------------------------------------------------
*/

public function forceDestroy(
    int $id
): JsonResponse {
    $this->categoryService
        ->forceDeleteCategory(
            $id
        );


    return response()->json([
        'success' =>
            true,

        'message' =>
            'Category permanently deleted successfully.',
    ]);
}


    /*
    |--------------------------------------------------------------------------
    | Build Category Path
    |--------------------------------------------------------------------------
    */

    private function buildCategoryPath(
        $category
    ): string {
        $parts = [
            $category->name,
        ];


        $parent =
            $category->parent;


        while ($parent) {
            array_unshift(
                $parts,
                $parent->name
            );


            $parent =
                $parent->parent;
        }


        return implode(
            ' → ',
            $parts
        );
    }


    
}
