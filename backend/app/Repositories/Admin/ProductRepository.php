<?php

namespace App\Repositories\Admin;

use App\Models\Product;
use App\Models\ProductGlobalVariantOption;
use App\Models\ProductInventory;
use App\Models\ProductMedia;
use App\Models\ProductVariant;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ProductRepository implements ProductRepositoryInterface
{
    /*
    |--------------------------------------------------------------------------
    | Product List
    |--------------------------------------------------------------------------
    */

    public function paginate(
        array $filters = []
    ): LengthAwarePaginator {


    $query = Product::query()
    ->with([
        'brand:id,name,slug',
        'category:id,name,slug',
        'vendor:id,name,email',
        'creator:id,name,email',

        'media' => function ($query) {
            $query
                ->orderByDesc('is_cover')
                ->orderBy('display_order')
                ->limit(1);
        },

        'variants' => function ($query) {
            $query
                ->orderBy('display_order')
                ->orderBy('id');
        },

        'variants.inventories.location',

        'inventories.location',
    ])
    ->withCount([
        'variants',
        'collections',
    ]);
    

        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */

        if (!empty($filters['search'])) {
            $search = trim(
                $filters['search']
            );

            $query->where(
                function ($query) use ($search) {
                    $query
                        ->where(
                            'title',
                            'like',
                            "%{$search}%"
                        )
                        ->orWhere(
                            'slug',
                            'like',
                            "%{$search}%"
                        )
                        ->orWhere(
                            'sku',
                            'like',
                            "%{$search}%"
                        )
                        ->orWhere(
                            'barcode',
                            'like',
                            "%{$search}%"
                        )
                        ->orWhereHas(
                            'brand',
                            function ($query) use ($search) {
                                $query->where(
                                    'name',
                                    'like',
                                    "%{$search}%"
                                );
                            }
                        )
                        ->orWhereHas(
                            'category',
                            function ($query) use ($search) {
                                $query->where(
                                    'name',
                                    'like',
                                    "%{$search}%"
                                );
                            }
                        );
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Status
        |--------------------------------------------------------------------------
        */

        if (!empty($filters['status'])) {
            $query->where(
                'status',
                $filters['status']
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Brand
        |--------------------------------------------------------------------------
        */

        if (!empty($filters['brand_id'])) {
            $query->where(
                'brand_id',
                (int) $filters['brand_id']
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Category
        |--------------------------------------------------------------------------
        */

        if (!empty($filters['category_id'])) {
            $query->where(
                'category_id',
                (int) $filters['category_id']
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Vendor
        |--------------------------------------------------------------------------
        */

        if (!empty($filters['vendor_id'])) {
            $query->where(
                'vendor_id',
                (int) $filters['vendor_id']
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Featured
        |--------------------------------------------------------------------------
        */

        if (
            array_key_exists(
                'is_featured',
                $filters
            ) &&
            $filters['is_featured'] !== null
        ) {
            $query->where(
                'is_featured',
                filter_var(
                    $filters['is_featured'],
                    FILTER_VALIDATE_BOOLEAN
                )
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Pre-order
        |--------------------------------------------------------------------------
        */

        if (
            array_key_exists(
                'preorder_enabled',
                $filters
            ) &&
            $filters['preorder_enabled'] !== null
        ) {
            $query->where(
                'preorder_enabled',
                filter_var(
                    $filters['preorder_enabled'],
                    FILTER_VALIDATE_BOOLEAN
                )
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Publishing
        |--------------------------------------------------------------------------
        */

        if (
            array_key_exists(
                'publish_online_store',
                $filters
            ) &&
            $filters['publish_online_store'] !== null
        ) {
            $query->where(
                'publish_online_store',
                filter_var(
                    $filters['publish_online_store'],
                    FILTER_VALIDATE_BOOLEAN
                )
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Sorting
        |--------------------------------------------------------------------------
        */

        $allowedSorts = [
            'title',
            'price',
            'created_at',
            'updated_at',
        ];

        $sortBy =
            in_array(
                $filters['sort_by'] ?? '',
                $allowedSorts,
                true
            )
                ? $filters['sort_by']
                : 'created_at';

        $sortDirection =
            strtolower(
                $filters['sort_direction'] ??
                'desc'
            ) === 'asc'
                ? 'asc'
                : 'desc';

        $perPage =
            min(
                max(
                    (int) (
                        $filters['per_page'] ??
                        20
                    ),
                    1
                ),
                100
            );

        return $query
            ->orderBy(
                $sortBy,
                $sortDirection
            )
            ->orderByDesc('id')
            ->paginate($perPage);
    }


    /*
    |--------------------------------------------------------------------------
    | Product Select List
    |--------------------------------------------------------------------------
    */

    public function getAllForSelect(
        array $filters = []
    ): Collection {
        $query = Product::query()
            ->select([
                'id',
                'title',
                'slug',
                'status',
                'brand_id',
                'category_id',
                'vendor_id',
            ])
            ->with([
                'brand:id,name',
                'category:id,name',
            ]);

        if (!empty($filters['status'])) {
            $query->where(
                'status',
                $filters['status']
            );
        }

        if (!empty($filters['vendor_id'])) {
            $query->where(
                'vendor_id',
                (int) $filters['vendor_id']
            );
        }

        return $query
            ->orderBy('title')
            ->get();
    }


    /*
    |--------------------------------------------------------------------------
    | Find Product
    |--------------------------------------------------------------------------
    */

    public function findOrFail(
        int $id
    ): Product {
        return Product::query()
            ->with([
                'brand:id,name,slug',
                'category:id,name,slug',
                'vendor:id,name,email',
                'creator:id,name,email',

                'collections',

                'media',

                'globalVariants.options',

                'globalVariantOptions.globalVariant',
                'globalVariantOptions.globalVariantOption',

                'variants.optionValues.globalVariant',
                'variants.optionValues.globalVariantOption',

                'variants.inventories.location',

                'inventories.location',
            ])
            ->findOrFail($id);
    }


    /*
    |--------------------------------------------------------------------------
    | Create Product
    |--------------------------------------------------------------------------
    */

    public function create(
        array $data
    ): Product {
        return Product::create(
            $data
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Update Product
    |--------------------------------------------------------------------------
    */

    public function update(
        Product $product,
        array $data
    ): Product {
        $product->update(
            $data
        );

        return $product->fresh();
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Product
    |--------------------------------------------------------------------------
    */

    public function delete(
        Product $product
    ): bool {
        return (bool)
            $product->delete();
    }


    /*
    |--------------------------------------------------------------------------
    | Sync Collections
    |--------------------------------------------------------------------------
    */

    public function syncCollections(
        Product $product,
        array $collections
    ): void {
        $syncData = [];

        foreach (
            $collections as $index => $collection
        ) {
            $collectionId =
                is_array($collection)
                    ? (
                        $collection['collection_id'] ??
                        $collection['id'] ??
                        null
                    )
                    : $collection;

            if (!$collectionId) {
                continue;
            }

            $syncData[
                (int) $collectionId
            ] = [
                'display_order' =>
                    is_array($collection)
                        ? (
                            $collection['display_order'] ??
                            $index + 1
                        )
                        : $index + 1,
            ];
        }

        $product
            ->collections()
            ->sync($syncData);
    }


    /*
    |--------------------------------------------------------------------------
    | Sync Media
    |--------------------------------------------------------------------------
    */

    public function syncMedia(
        Product $product,
        array $media
    ): void {
        $existingMedia =
            $product
                ->media()
                ->get()
                ->keyBy('id');

        $keptIds = [];

        foreach (
            $media as $index => $item
        ) {
            $mediaModel = null;

            if (!empty($item['id'])) {
                $mediaId =
                    (int) $item['id'];

                if (
                    $existingMedia->has(
                        $mediaId
                    )
                ) {
                    $mediaModel =
                        $existingMedia->get(
                            $mediaId
                        );
                }
            }

            $payload = [
                'media_type' =>
                    $item['media_type'] ??
                    'image',

                'file_path' =>
                    $item['file_path'] ??
                    null,

                'external_url' =>
                    $item['external_url'] ??
                    null,

                'alt_text' =>
                    $item['alt_text'] ??
                    null,

                'is_cover' =>
                    $item['is_cover'] ??
                    false,

                'display_order' =>
                    $item['display_order'] ??
                    $index + 1,
            ];

            if ($mediaModel) {
                $mediaModel->update(
                    $payload
                );

                $keptIds[] =
                    $mediaModel->id;

                continue;
            }

            $newMedia =
                $product
                    ->media()
                    ->create(
                        $payload
                    );

            $keptIds[] =
                $newMedia->id;
        }

        if (count($keptIds) > 0) {
            $product
                ->media()
                ->whereNotIn(
                    'id',
                    $keptIds
                )
                ->delete();
        } else {
            $product
                ->media()
                ->delete();
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Sync Global Variants
    |--------------------------------------------------------------------------
    |
    | Expected shape:
    |
    | [
    |     [
    |         'global_variant_id' => 1,
    |         'display_order' => 1,
    |         'option_ids' => [1, 2, 3],
    |     ],
    | ]
    |
    */

    public function syncGlobalVariants(
        Product $product,
        array $globalVariants
    ): void {
        $variantSyncData = [];

        $keptOptionRowIds = [];

        $existingOptions =
            ProductGlobalVariantOption::query()
                ->where(
                    'product_id',
                    $product->id
                )
                ->get();

        foreach (
            $globalVariants as $variantIndex => $variant
        ) {
            $globalVariantId =
                (int) (
                    $variant['global_variant_id'] ??
                    0
                );

            if (!$globalVariantId) {
                continue;
            }

            $variantSyncData[
                $globalVariantId
            ] = [
                'display_order' =>
                    $variant['display_order'] ??
                    $variantIndex + 1,
            ];

            $optionIds =
                $variant['option_ids'] ??
                [];

            foreach (
                $optionIds as $optionIndex => $optionId
            ) {
                $optionId =
                    (int) $optionId;

                $existing =
                    $existingOptions
                        ->first(
                            function ($row) use (
                                $globalVariantId,
                                $optionId
                            ) {
                                return
                                    (int) $row->global_variant_id ===
                                        $globalVariantId &&
                                    (int) $row->global_variant_option_id ===
                                        $optionId;
                            }
                        );

                if ($existing) {
                    $existing->update([
                        'display_order' =>
                            $optionIndex + 1,
                    ]);

                    $keptOptionRowIds[] =
                        $existing->id;

                    continue;
                }

                $created =
                    ProductGlobalVariantOption::create([
                        'product_id' =>
                            $product->id,

                        'global_variant_id' =>
                            $globalVariantId,

                        'global_variant_option_id' =>
                            $optionId,

                        'display_order' =>
                            $optionIndex + 1,
                    ]);

                $keptOptionRowIds[] =
                    $created->id;
            }
        }

        $product
            ->globalVariants()
            ->sync(
                $variantSyncData
            );

        $optionQuery =
            ProductGlobalVariantOption::query()
                ->where(
                    'product_id',
                    $product->id
                );

        if (
            count(
                $keptOptionRowIds
            ) > 0
        ) {
            $optionQuery
                ->whereNotIn(
                    'id',
                    $keptOptionRowIds
                )
                ->delete();
        } else {
            $optionQuery->delete();
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Sync Sellable Variants
    |--------------------------------------------------------------------------
    |
    | Existing IDs are preserved.
    |
    */

  public function syncVariants(
    Product $product,
    array $variants
): array {
    $existingVariants =
        $product
            ->variants()
            ->get()
            ->keyBy('id');

    $keptVariantIds = [];
    $syncedVariants = [];

    foreach (
        $variants as $index => $variant
    ) {
        $variantModel = null;

        /*
        |--------------------------------------------------------------------------
        | Existing Variant
        |--------------------------------------------------------------------------
        */

        if (!empty($variant['id'])) {
            $variantId =
                (int) $variant['id'];

            if (
                $existingVariants->has(
                    $variantId
                )
            ) {
                $variantModel =
                    $existingVariants->get(
                        $variantId
                    );
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Variant Data
        |--------------------------------------------------------------------------
        */

        $payload = [
            'title' =>
                $variant['title'] ??
                null,

            'sku' =>
                $variant['sku'] ??
                null,

            'barcode' =>
                $variant['barcode'] ??
                null,

            'price' =>
                $variant['price'] ??
                null,

            'compare_at_price' =>
                $variant['compare_at_price'] ??
                null,

            'cost_per_item' =>
                $variant['cost_per_item'] ??
                null,

            'image_path' =>
                $variant['image_path'] ??
                null,

            'is_active' =>
                $variant['is_active'] ??
                true,

            'display_order' =>
                $variant['display_order'] ??
                $index + 1,

            'is_final_sale' =>
                array_key_exists(
                    'is_final_sale',
                    $variant
                )
                    ? $variant['is_final_sale']
                    : null,

            'return_window_days' =>
                $variant['return_window_days'] ??
                null,
        ];

        /*
        |--------------------------------------------------------------------------
        | Create / Update Variant
        |--------------------------------------------------------------------------
        */

        if ($variantModel) {
            $variantModel->update(
                $payload
            );
        } else {
            $variantModel =
                $product
                    ->variants()
                    ->create(
                        $payload
                    );
        }

        $keptVariantIds[] =
            $variantModel->id;

        /*
        |--------------------------------------------------------------------------
        | Variant Option Values
        |--------------------------------------------------------------------------
        */

        $optionValues =
            $variant['option_values'] ??
            [];

        $variantModel
            ->optionValues()
            ->delete();

        foreach (
            $optionValues as $optionValue
        ) {
            if (
                empty(
                    $optionValue[
                        'global_variant_id'
                    ]
                ) ||
                empty(
                    $optionValue[
                        'global_variant_option_id'
                    ]
                )
            ) {
                continue;
            }

            $variantModel
                ->optionValues()
                ->create([
                    'global_variant_id' =>
                        $optionValue[
                            'global_variant_id'
                        ],

                    'global_variant_option_id' =>
                        $optionValue[
                            'global_variant_option_id'
                        ],
                ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Preserve Request Index → Database Variant
        |--------------------------------------------------------------------------
        */

        $syncedVariants[$index] =
            $variantModel->fresh();
    }

    /*
    |--------------------------------------------------------------------------
    | Remove Missing Variants
    |--------------------------------------------------------------------------
    */

    if (count($keptVariantIds) > 0) {
        $product
            ->variants()
            ->whereNotIn(
                'id',
                $keptVariantIds
            )
            ->delete();
    } else {
        $product
            ->variants()
            ->delete();
    }

    return $syncedVariants;
}


    /*
    |--------------------------------------------------------------------------
    | Sync Inventory
    |--------------------------------------------------------------------------
    |
    | Prevents duplicate inventory rows in application logic.
    |
    */

    public function syncInventories(
        Product $product,
        array $inventories
    ): void {
        $existingInventories =
            ProductInventory::query()
                ->where(
                    'product_id',
                    $product->id
                )
                ->get();

        $keptIds = [];

        foreach (
            $inventories as $inventory
        ) {
            $inventoryModel = null;

            /*
            |--------------------------------------------------------------------------
            | Match By ID
            |--------------------------------------------------------------------------
            */

            if (!empty($inventory['id'])) {
                $inventoryModel =
                    $existingInventories
                        ->firstWhere(
                            'id',
                            (int) $inventory['id']
                        );
            }

            /*
            |--------------------------------------------------------------------------
            | Match By Variant + Location
            |--------------------------------------------------------------------------
            */

            if (!$inventoryModel) {
                $variantId =
                    !empty(
                        $inventory[
                            'product_variant_id'
                        ]
                    )
                        ? (int) $inventory[
                            'product_variant_id'
                        ]
                        : null;

                $locationId =
                    (int) (
                        $inventory[
                            'location_id'
                        ] ??
                        0
                    );

                $inventoryModel =
                    $existingInventories
                        ->first(
                            function ($existing) use (
                                $variantId,
                                $locationId,
                                $keptIds
                            ) {
                                return
                                    !in_array(
                                        $existing->id,
                                        $keptIds,
                                        true
                                    ) &&
                                    (
                                        $existing->product_variant_id
                                            ? (int)
                                              $existing->product_variant_id
                                            : null
                                    ) === $variantId &&
                                    (int)
                                    $existing->location_id ===
                                    $locationId;
                            }
                        );
            }

            if (
                empty(
                    $inventory[
                        'location_id'
                    ]
                )
            ) {
                continue;
            }

            $payload = [
                'product_variant_id' =>
                    $inventory[
                        'product_variant_id'
                    ] ??
                    null,

                'location_id' =>
                    $inventory[
                        'location_id'
                    ],

                'quantity' =>
                    $inventory[
                        'quantity'
                    ] ??
                    0,

                'reserved_quantity' =>
                    $inventory[
                        'reserved_quantity'
                    ] ??
                    0,

                'incoming_quantity' =>
                    $inventory[
                        'incoming_quantity'
                    ] ??
                    0,
            ];

            if ($inventoryModel) {
                $inventoryModel->update(
                    $payload
                );

                $keptIds[] =
                    $inventoryModel->id;

                continue;
            }

            $created =
                ProductInventory::create([
                    'product_id' =>
                        $product->id,

                    ...$payload,
                ]);

            $keptIds[] =
                $created->id;
        }

        $deleteQuery =
            ProductInventory::query()
                ->where(
                    'product_id',
                    $product->id
                );

        if (count($keptIds) > 0) {
            $deleteQuery
                ->whereNotIn(
                    'id',
                    $keptIds
                )
                ->delete();
        } else {
            $deleteQuery->delete();
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Stats
    |--------------------------------------------------------------------------
    */

    public function countAll(): int
    {
        return Product::query()
            ->count();
    }


    public function countByStatus(
        string $status
    ): int {
        return Product::query()
            ->where(
                'status',
                $status
            )
            ->count();
    }


    public function countFeatured(): int
    {
        return Product::query()
            ->where(
                'is_featured',
                true
            )
            ->count();
    }


    public function countPreorder(): int
    {
        return Product::query()
            ->where(
                'preorder_enabled',
                true
            )
            ->count();
    }
}
