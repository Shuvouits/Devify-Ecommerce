<?php

namespace App\Services\Admin;

use App\Models\Category;
use App\Repositories\Admin\CategoryRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CategoryService
{
    public function __construct(
        protected CategoryRepositoryInterface $categoryRepository
    ) {
    }


    /*
    |--------------------------------------------------------------------------
    | Category List
    |--------------------------------------------------------------------------
    */

    public function getCategories(
        array $filters = []
    ): LengthAwarePaginator {
        return $this->categoryRepository
            ->paginate(
                $filters
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Get Category
    |--------------------------------------------------------------------------
    */

    public function getCategory(
        int $id
    ): Category {
        return $this->categoryRepository
            ->findOrFail(
                $id
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Get Trashed Category
    |--------------------------------------------------------------------------
    */

    public function getTrashedCategory(
        int $id
    ): Category {
        return $this->categoryRepository
            ->findTrashedOrFail(
                $id
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Create Category
    |--------------------------------------------------------------------------
    */

    public function createCategory(
        array $data,
        ?int $userId = null
    ): Category {
        return DB::transaction(
            function () use (
                $data,
                $userId
            ) {
                $parent =
                    $this->resolveParent(
                        $data['parent_id'] ?? null
                    );


                if ($parent) {
                    $this->validateParentDepth(
                        $parent
                    );
                }


                $data['slug'] =
                    $this->prepareSlug(
                        $data['slug'] ?? null,
                        $data['name']
                    );


                $data['parent_id'] =
                    $parent?->id;


                $data['created_by'] =
                    $userId;


                $data['tags'] =
                    $this->cleanTags(
                        $data['tags'] ?? []
                    );


                return $this
                    ->categoryRepository
                    ->create(
                        $data
                    );
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Update Category
    |--------------------------------------------------------------------------
    */

    public function updateCategory(
        int $id,
        array $data
    ): Category {
        return DB::transaction(
            function () use (
                $id,
                $data
            ) {
                $category =
                    $this->getCategory(
                        $id
                    );


                $parent =
                    $this->resolveParent(
                        $data['parent_id'] ??
                        $category->parent_id
                    );


                $this->validateParentForUpdate(
                    $category,
                    $parent
                );


                if (
                    array_key_exists(
                        'slug',
                        $data
                    ) ||
                    array_key_exists(
                        'name',
                        $data
                    )
                ) {
                    $data['slug'] =
                        $this->prepareSlug(
                            $data['slug'] ??
                            $category->slug,

                            $data['name'] ??
                            $category->name
                        );
                }


                if (
                    array_key_exists(
                        'parent_id',
                        $data
                    )
                ) {
                    $data['parent_id'] =
                        $parent?->id;
                }


                if (
                    array_key_exists(
                        'tags',
                        $data
                    )
                ) {
                    $data['tags'] =
                        $this->cleanTags(
                            $data['tags']
                        );
                }


                return $this
                    ->categoryRepository
                    ->update(
                        $category,
                        $data
                    );
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Upload Category Image
    |--------------------------------------------------------------------------
    */

    public function uploadImage(
        int $id,
        UploadedFile $image
    ): Category {
        $category =
            $this->getCategory(
                $id
            );


        $this->deleteMediaFile(
            $category->image_path
        );


        $relativeDirectory =
            'uploads/categories/' .
            $category->id;


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


        $extension =
            strtolower(
                $image->getClientOriginalExtension()
            );


        $fileName =
            'category-image-' .
            now()->format(
                'YmdHis'
            ) .
            '-' .
            bin2hex(
                random_bytes(4)
            ) .
            '.' .
            $extension;


        $image->move(
            $absoluteDirectory,
            $fileName
        );


        $imagePath =
            $relativeDirectory .
            '/' .
            $fileName;


        return $this
            ->categoryRepository
            ->update(
                $category,
                [
                    'image_path' =>
                        $imagePath,
                ]
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Category Image
    |--------------------------------------------------------------------------
    */

    public function deleteImage(
        int $id
    ): Category {
        $category =
            $this->getCategory(
                $id
            );


        $this->deleteMediaFile(
            $category->image_path
        );


        return $this
            ->categoryRepository
            ->update(
                $category,
                [
                    'image_path' =>
                        null,
                ]
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Upload Category Icon
    |--------------------------------------------------------------------------
    */

    public function uploadIcon(
        int $id,
        UploadedFile $icon
    ): Category {
        $category =
            $this->getCategory(
                $id
            );


        $this->deleteMediaFile(
            $category->icon_path
        );


        $relativeDirectory =
            'uploads/categories/' .
            $category->id;


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


        $extension =
            strtolower(
                $icon->getClientOriginalExtension()
            );


        $fileName =
            'category-icon-' .
            now()->format(
                'YmdHis'
            ) .
            '-' .
            bin2hex(
                random_bytes(4)
            ) .
            '.' .
            $extension;


        $icon->move(
            $absoluteDirectory,
            $fileName
        );


        $iconPath =
            $relativeDirectory .
            '/' .
            $fileName;


        return $this
            ->categoryRepository
            ->update(
                $category,
                [
                    'icon_path' =>
                        $iconPath,
                ]
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Category Icon
    |--------------------------------------------------------------------------
    */

    public function deleteIcon(
        int $id
    ): Category {
        $category =
            $this->getCategory(
                $id
            );


        $this->deleteMediaFile(
            $category->icon_path
        );


        return $this
            ->categoryRepository
            ->update(
                $category,
                [
                    'icon_path' =>
                        null,
                ]
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Archive Category
    |--------------------------------------------------------------------------
    */

    public function archiveCategory(
        int $id
    ): Category {
        $category =
            $this->getCategory(
                $id
            );


        if (
            $category->archived_at
        ) {
            return $category;
        }


        $category->update([
            'archived_at' =>
                now(),
        ]);


        return $category->fresh();
    }


    /*
    |--------------------------------------------------------------------------
    | Restore Archived Category
    |--------------------------------------------------------------------------
    */

    public function restoreCategory(
        int $id
    ): Category {
        $category =
            $this->getCategory(
                $id
            );


        if (
            !$category->archived_at
        ) {
            return $category;
        }


        $category->update([
            'archived_at' =>
                null,
        ]);


        return $category->fresh();
    }


    /*
    |--------------------------------------------------------------------------
    | Soft Delete Category
    |--------------------------------------------------------------------------
    |
    | Important:
    | Do NOT remove image/icon files here.
    | The category may later be restored from Trash.
    |
    |--------------------------------------------------------------------------
    */





    /*
|--------------------------------------------------------------------------
| Permanently Delete Category
|--------------------------------------------------------------------------
*/

public function deleteCategory(
    int $id
): bool {
    $category =
        $this->getCategory(
            $id
        );


    if (
        $category
            ->children()
            ->exists()
    ) {
        throw ValidationException::withMessages([
            'category' => [
                'This category has child categories. Move or delete the child categories first.',
            ],
        ]);
    }


    $imagePath =
        $category->image_path;

    $iconPath =
        $category->icon_path;


    $deleted =
        $this->categoryRepository
            ->forceDelete(
                $category
            );


    if ($deleted) {
        $this->deleteMediaFile(
            $imagePath
        );

        $this->deleteMediaFile(
            $iconPath
        );
    }


    return $deleted;
}

    /*
    |--------------------------------------------------------------------------
    | Restore Category From Trash
    |--------------------------------------------------------------------------
    */

    public function restoreDeletedCategory(
        int $id
    ): Category {
        $category =
            $this->getTrashedCategory(
                $id
            );


        $restored =
            $this->categoryRepository
                ->restore(
                    $category
                );


        if (!$restored) {
            throw ValidationException::withMessages([
                'category' => [
                    'Unable to restore this category.',
                ],
            ]);
        }


        return $this->getCategory(
            $id
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Permanently Delete Category
    |--------------------------------------------------------------------------
    */

    public function forceDeleteCategory(
        int $id
    ): bool {
        $category =
            $this->getTrashedCategory(
                $id
            );


        /*
        |--------------------------------------------------------------------------
        | Delete Physical Media Only On Permanent Delete
        |--------------------------------------------------------------------------
        */

        $this->deleteMediaFile(
            $category->image_path
        );


        $this->deleteMediaFile(
            $category->icon_path
        );


        return $this
            ->categoryRepository
            ->forceDelete(
                $category
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Parent Options
    |--------------------------------------------------------------------------
    */

    public function getParentOptions(
        ?int $excludeId = null
    ): Collection {
        return $this
            ->categoryRepository
            ->getParentOptions(
                $excludeId
            )
            ->filter(
                function (
                    Category $category
                ) use (
                    $excludeId
                ) {
                    if (
                        $category->getDepth() >=
                        Category::MAX_DEPTH
                    ) {
                        return false;
                    }


                    if (
                        $excludeId &&
                        $this->isDescendantOf(
                            $category,
                            $excludeId
                        )
                    ) {
                        return false;
                    }


                    return true;
                }
            )
            ->values();
    }


    /*
    |--------------------------------------------------------------------------
    | Resolve Parent
    |--------------------------------------------------------------------------
    */

    private function resolveParent(
        mixed $parentId
    ): ?Category {
        if (
            $parentId === null ||
            $parentId === '' ||
            $parentId === 0 ||
            $parentId === '0'
        ) {
            return null;
        }


        return $this
            ->categoryRepository
            ->findOrFail(
                (int) $parentId
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Validate Parent Depth
    |--------------------------------------------------------------------------
    */

    private function validateParentDepth(
        Category $parent
    ): void {
        if (
            $parent->getDepth() >=
            Category::MAX_DEPTH
        ) {
            throw ValidationException::withMessages([
                'parent_id' => [
                    'A category can have a maximum of 3 hierarchy levels.',
                ],
            ]);
        }


        if (
            $parent->archived_at
        ) {
            throw ValidationException::withMessages([
                'parent_id' => [
                    'An archived category cannot be selected as a parent.',
                ],
            ]);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Validate Parent During Update
    |--------------------------------------------------------------------------
    */

    private function validateParentForUpdate(
        Category $category,
        ?Category $parent
    ): void {
        if (!$parent) {
            $this->validateSubtreeDepth(
                $category,
                1
            );

            return;
        }


        if (
            $parent->id ===
            $category->id
        ) {
            throw ValidationException::withMessages([
                'parent_id' => [
                    'A category cannot be its own parent.',
                ],
            ]);
        }


        if (
            $this->isDescendantOf(
                $parent,
                $category->id
            )
        ) {
            throw ValidationException::withMessages([
                'parent_id' => [
                    'A child category cannot be selected as its parent.',
                ],
            ]);
        }


        $this->validateParentDepth(
            $parent
        );


        $newLevel =
            $parent->getDepth() +
            1;


        $this->validateSubtreeDepth(
            $category,
            $newLevel
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Validate Subtree Depth
    |--------------------------------------------------------------------------
    */

    private function validateSubtreeDepth(
        Category $category,
        int $newLevel
    ): void {
        $subtreeHeight =
            $this->getSubtreeHeight(
                $category
            );


        $deepestLevel =
            $newLevel +
            $subtreeHeight -
            1;


        if (
            $deepestLevel >
            Category::MAX_DEPTH
        ) {
            throw ValidationException::withMessages([
                'parent_id' => [
                    'Moving this category would create more than 3 hierarchy levels.',
                ],
            ]);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Get Subtree Height
    |--------------------------------------------------------------------------
    */

    private function getSubtreeHeight(
        Category $category
    ): int {
        $children =
            $category
                ->children()
                ->get();


        if (
            $children->isEmpty()
        ) {
            return 1;
        }


        $height =
            1;


        foreach (
            $children as $child
        ) {
            $height =
                max(
                    $height,
                    1 +
                    $this->getSubtreeHeight(
                        $child
                    )
                );
        }


        return $height;
    }


    /*
    |--------------------------------------------------------------------------
    | Descendant Check
    |--------------------------------------------------------------------------
    */

    private function isDescendantOf(
        Category $category,
        int $possibleAncestorId
    ): bool {
        $parent =
            $category->parent;


        while ($parent) {
            if (
                $parent->id ===
                $possibleAncestorId
            ) {
                return true;
            }


            $parent =
                $parent->parent;
        }


        return false;
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Physical Media
    |--------------------------------------------------------------------------
    */

    private function deleteMediaFile(
        ?string $path
    ): void {
        if (
            blank(
                $path
            )
        ) {
            return;
        }


        $absolutePath =
            public_path(
                ltrim(
                    $path,
                    '/'
                )
            );


        if (
            File::exists(
                $absolutePath
            )
        ) {
            File::delete(
                $absolutePath
            );
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Prepare Slug
    |--------------------------------------------------------------------------
    */

    private function prepareSlug(
        ?string $slug,
        string $name
    ): string {
        $value =
            trim(
                $slug ?: $name
            );


        return Str::slug(
            $value
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Clean Tags
    |--------------------------------------------------------------------------
    */

    private function cleanTags(
        mixed $tags
    ): array {
        if (
            !is_array(
                $tags
            )
        ) {
            return [];
        }


        return collect(
            $tags
        )
            ->filter(
                fn ($tag) =>
                    is_string(
                        $tag
                    ) &&
                    trim(
                        $tag
                    ) !== ''
            )
            ->map(
                fn ($tag) =>
                    trim(
                        $tag
                    )
            )
            ->unique()
            ->values()
            ->all();
    }
}
