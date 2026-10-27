<?php

namespace App\Services\Admin;

use App\Models\Product;
use App\Models\User;
use App\Repositories\Admin\ProductRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

use App\Traits\HandlesImageUploads;
use Illuminate\Http\UploadedFile;


class ProductService
{

 use HandlesImageUploads;

    public function __construct(
        protected ProductRepositoryInterface $productRepository
    ) {
    }

    /*
    |--------------------------------------------------------------------------
    | Product List
    |--------------------------------------------------------------------------
    */

    public function getProducts(
        array $filters = []
    ): LengthAwarePaginator {
        return $this->productRepository
            ->paginate($filters);
    }

    /*
    |--------------------------------------------------------------------------
    | Product Select List
    |--------------------------------------------------------------------------
    */

    public function getProductsForSelect(
        array $filters = []
    ): Collection {
        return $this->productRepository
            ->getAllForSelect($filters);
    }

    /*
    |--------------------------------------------------------------------------
    | Single Product
    |--------------------------------------------------------------------------
    */

    public function getProduct(
        int $id
    ): Product {
        return $this->productRepository
            ->findOrFail($id);
    }

    /*
    |--------------------------------------------------------------------------
    | Stats
    |--------------------------------------------------------------------------
    */

    public function getStats(): array
    {
        return [
            'total' =>
                $this->productRepository
                    ->countAll(),

            'active' =>
                $this->productRepository
                    ->countByStatus('active'),

            'draft' =>
                $this->productRepository
                    ->countByStatus('draft'),

            'featured' =>
                $this->productRepository
                    ->countFeatured(),

            'preorder' =>
                $this->productRepository
                    ->countPreorder(),
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Create Product
    |--------------------------------------------------------------------------
    */

    public function createProduct(
        array $data,
        ?int $userId = null
    ): Product {
        return DB::transaction(
            function () use (
                $data,
                $userId
            ) {
                $this->validateVendor(
                    $data['vendor_id'] ??
                    null
                );

                $this->validatePricing(
                    $data
                );

                $this->validatePreorder(
                    $data
                );

                $product =
                    $this->productRepository
                        ->create(
                            $this->buildCreatePayload(
                                $data,
                                $userId
                            )
                        );

                /*
                |--------------------------------------------------------------------------
                | Collections
                |--------------------------------------------------------------------------
                */

                if (
                    array_key_exists(
                        'collections',
                        $data
                    )
                ) {
                    $this->productRepository
                        ->syncCollections(
                            $product,
                            $data['collections'] ??
                            []
                        );
                }

                /*
                |--------------------------------------------------------------------------
                | Media
                |--------------------------------------------------------------------------
                */

                if (
                    array_key_exists(
                        'media',
                        $data
                    )
                ) {
                    $this->productRepository
                        ->syncMedia(
                            $product,
                            $data['media'] ??
                            []
                        );
                }

                /*
                |--------------------------------------------------------------------------
                | Global Variants
                |--------------------------------------------------------------------------
                */

                if (
                    array_key_exists(
                        'global_variants',
                        $data
                    )
                ) {
                    $this->productRepository
                        ->syncGlobalVariants(
                            $product,
                            $data['global_variants'] ??
                            []
                        );
                }

                /*
                |--------------------------------------------------------------------------
                | Sellable Variants
                |--------------------------------------------------------------------------
                */

                $syncedVariants = [];

                if (
                    array_key_exists(
                        'variants',
                        $data
                    )
                ) {
                    $syncedVariants =
                        $this->productRepository
                            ->syncVariants(
                                $product,
                                $data['variants'] ??
                                []
                            );
                }

                /*
                |--------------------------------------------------------------------------
                | Variant Inventory Mapping
                |--------------------------------------------------------------------------
                */

                $variantInventories =
                    $this->buildVariantInventories(
                        $data['variants'] ?? [],
                        $syncedVariants
                    );

                /*
                |--------------------------------------------------------------------------
                | Inventory
                |--------------------------------------------------------------------------
                */

                if (
                    array_key_exists(
                        'inventories',
                        $data
                    ) ||
                    count(
                        $variantInventories
                    ) > 0
                ) {
                    $inventories =
                        array_merge(
                            $data['inventories'] ??
                            [],
                            $variantInventories
                        );

                    $this->productRepository
                        ->syncInventories(
                            $product,
                            $inventories
                        );
                }

                return $this->productRepository
                    ->findOrFail(
                        $product->id
                    );
            }
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Update Product
    |--------------------------------------------------------------------------
    */

    public function updateProduct(
        int $id,
        array $data
    ): Product {
        return DB::transaction(
            function () use (
                $id,
                $data
            ) {
                $product =
                    $this->getProduct($id);

                /*
                |--------------------------------------------------------------------------
                | Business Validation
                |--------------------------------------------------------------------------
                */

                if (
                    array_key_exists(
                        'vendor_id',
                        $data
                    )
                ) {
                    $this->validateVendor(
                        $data['vendor_id']
                    );
                }

                $this->validatePricing(
                    $data,
                    $product
                );

                $this->validatePreorder(
                    $data,
                    $product
                );

                /*
                |--------------------------------------------------------------------------
                | Core Product
                |--------------------------------------------------------------------------
                */

                $payload =
                    $this->buildUpdatePayload(
                        $product,
                        $data
                    );

                if (!empty($payload)) {
                    $product =
                        $this->productRepository
                            ->update(
                                $product,
                                $payload
                            );
                }

                /*
                |--------------------------------------------------------------------------
                | Collections
                |--------------------------------------------------------------------------
                */

                if (
                    array_key_exists(
                        'collections',
                        $data
                    )
                ) {
                    $this->productRepository
                        ->syncCollections(
                            $product,
                            $data['collections'] ??
                            []
                        );
                }

                /*
                |--------------------------------------------------------------------------
                | Media
                |--------------------------------------------------------------------------
                */

                if (
                    array_key_exists(
                        'media',
                        $data
                    )
                ) {
                    $this->productRepository
                        ->syncMedia(
                            $product,
                            $data['media'] ??
                            []
                        );
                }

                /*
                |--------------------------------------------------------------------------
                | Global Variants
                |--------------------------------------------------------------------------
                */

                if (
                    array_key_exists(
                        'global_variants',
                        $data
                    )
                ) {
                    $this->productRepository
                        ->syncGlobalVariants(
                            $product,
                            $data['global_variants'] ??
                            []
                        );
                }

                /*
                |--------------------------------------------------------------------------
                | Sellable Variants
                |--------------------------------------------------------------------------
                */

                $syncedVariants = [];

                if (
                    array_key_exists(
                        'variants',
                        $data
                    )
                ) {
                    $syncedVariants =
                        $this->productRepository
                            ->syncVariants(
                                $product,
                                $data['variants'] ??
                                []
                            );
                }

                /*
                |--------------------------------------------------------------------------
                | Variant Inventory Mapping
                |--------------------------------------------------------------------------
                */

                $variantInventories =
                    $this->buildVariantInventories(
                        $data['variants'] ?? [],
                        $syncedVariants
                    );

                /*
                |--------------------------------------------------------------------------
                | Inventory
                |--------------------------------------------------------------------------
                */

                if (
                    array_key_exists(
                        'inventories',
                        $data
                    ) ||
                    count(
                        $variantInventories
                    ) > 0
                ) {
                    $inventories =
                        array_merge(
                            $data['inventories'] ??
                            [],
                            $variantInventories
                        );

                    $this->productRepository
                        ->syncInventories(
                            $product,
                            $inventories
                        );
                }

                return $this->productRepository
                    ->findOrFail(
                        $product->id
                    );
            }
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Product
    |--------------------------------------------------------------------------
    */

    public function deleteProduct(
        int $id
    ): bool {
        $product =
            $this->getProduct($id);

        return $this->productRepository
            ->delete($product);
    }



    public function uploadProductImage(
    UploadedFile $image,
    ?string $productTitle = null
): array {
    $path =
        $this->uploadImage(
            $image,
            'uploads/products',
            null,
            $productTitle ??
            'product'
        );

    return [
        'file_path' =>
            $path,

        'url' =>
            $this->getImageUrl(
                $path
            ),
    ];
}


public function deleteProductImage(
    string $path
): void {
    $normalizedPath =
        ltrim(
            trim($path),
            '/'
        );

    if (
        !str_starts_with(
            $normalizedPath,
            'uploads/products/'
        )
    ) {
        throw ValidationException::withMessages([
            'path' => [
                'Invalid product image path.',
            ],
        ]);
    }

    $this->deleteImage(
        $normalizedPath
    );
}


    /*
    |--------------------------------------------------------------------------
    | Create Payload
    |--------------------------------------------------------------------------
    */

    private function buildCreatePayload(
        array $data,
        ?int $userId
    ): array {
        return [
            'vendor_id' =>
                $data['vendor_id'] ??
                null,

            'created_by' =>
                $userId,

            'brand_id' =>
                $data['brand_id'] ??
                null,

            'category_id' =>
                $data['category_id'] ??
                null,

            'title' =>
                $data['title'],

            'slug' =>
                $this->generateUniqueSlug(
                    $data['slug'] ??
                    $data['title']
                ),

            'overview' =>
                $data['overview'] ??
                null,

            'description' =>
                $data['description'] ??
                null,

            'specifications' =>
                $data['specifications'] ??
                null,

            'tags' =>
                $this->normalizeTags(
                    $data['tags'] ??
                    []
                ),

            'status' =>
                $data['status'] ??
                'draft',

            'is_featured' =>
                $data['is_featured'] ??
                false,

            'publish_online_store' =>
                $data['publish_online_store'] ??
                true,

            'publish_point_of_sale' =>
                $data['publish_point_of_sale'] ??
                false,

            'is_final_sale' =>
                $data['is_final_sale'] ??
                false,

            'return_window_days' =>
                $data['return_window_days'] ??
                null,

            'preorder_enabled' =>
                $data['preorder_enabled'] ??
                false,

            'preorder_expected_ship_date' =>
                $data['preorder_expected_ship_date'] ??
                null,

            'preorder_limit' =>
                $data['preorder_limit'] ??
                0,

            'preorder_payment_collection' =>
                $data['preorder_payment_collection'] ??
                'pay_later',

            'preorder_deposit_type' =>
                $data['preorder_deposit_type'] ??
                null,

            'preorder_deposit_value' =>
                $data['preorder_deposit_value'] ??
                null,

            'preorder_supplier_eta' =>
                $data['preorder_supplier_eta'] ??
                null,

            'preorder_batch_name' =>
                $data['preorder_batch_name'] ??
                null,

            'preorder_storefront_message' =>
                $data['preorder_storefront_message'] ??
                null,

            'reserved_preorders' =>
                $data['reserved_preorders'] ??
                0,

            'sell_only_as_preorder' =>
                $data['sell_only_as_preorder'] ??
                false,

            'stop_preorders_after_release_date' =>
                $data['stop_preorders_after_release_date'] ??
                false,

            'price' =>
                $data['price'] ??
                null,

            'compare_at_price' =>
                $data['compare_at_price'] ??
                null,

            'cost_per_item' =>
                $data['cost_per_item'] ??
                null,

            'charge_tax' =>
                $data['charge_tax'] ??
                true,

            'tax_class' =>
                $data['tax_class'] ??
                null,

            'sku' =>
                $this->emptyToNull(
                    $data['sku'] ??
                    null
                ),

            'barcode' =>
                $this->emptyToNull(
                    $data['barcode'] ??
                    null
                ),

            'track_quantity' =>
                $data['track_quantity'] ??
                true,

            'continue_selling_when_out_of_stock' =>
                $data['continue_selling_when_out_of_stock'] ??
                false,

            'weight' =>
                $data['weight'] ??
                0,

            'weight_unit' =>
                $data['weight_unit'] ??
                'kg',

            'length' =>
                $data['length'] ??
                0,

            'width' =>
                $data['width'] ??
                0,

            'height' =>
                $data['height'] ??
                0,

            'size_unit' =>
                $data['size_unit'] ??
                'cm',

            'country_of_origin' =>
                $data['country_of_origin'] ??
                null,

            'hs_code' =>
                $data['hs_code'] ??
                null,

            'customs_description' =>
                $data['customs_description'] ??
                null,

            'seo_title' =>
                $data['seo_title'] ??
                null,

            'seo_description' =>
                $data['seo_description'] ??
                null,
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Update Payload
    |--------------------------------------------------------------------------
    */

    private function buildUpdatePayload(
        Product $product,
        array $data
    ): array {
        $payload = [];

        $fields = [
            'vendor_id',

            'brand_id',
            'category_id',

            'overview',
            'description',
            'specifications',

            'status',
            'is_featured',

            'publish_online_store',
            'publish_point_of_sale',

            'is_final_sale',
            'return_window_days',

            'preorder_enabled',
            'preorder_expected_ship_date',
            'preorder_limit',
            'preorder_payment_collection',
            'preorder_deposit_type',
            'preorder_deposit_value',
            'preorder_supplier_eta',
            'preorder_batch_name',
            'preorder_storefront_message',
            'reserved_preorders',
            'sell_only_as_preorder',
            'stop_preorders_after_release_date',

            'price',
            'compare_at_price',
            'cost_per_item',

            'charge_tax',
            'tax_class',

            'track_quantity',
            'continue_selling_when_out_of_stock',

            'weight',
            'weight_unit',
            'length',
            'width',
            'height',
            'size_unit',
            'country_of_origin',
            'hs_code',
            'customs_description',

            'seo_title',
            'seo_description',
        ];

        foreach ($fields as $field) {
            if (
                array_key_exists(
                    $field,
                    $data
                )
            ) {
                $payload[$field] =
                    $data[$field];
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Title
        |--------------------------------------------------------------------------
        */

        if (
            array_key_exists(
                'title',
                $data
            )
        ) {
            $payload['title'] =
                $data['title'];
        }

        /*
        |--------------------------------------------------------------------------
        | Slug
        |--------------------------------------------------------------------------
        */

        if (
            array_key_exists(
                'slug',
                $data
            )
        ) {
            $slugSource =
                trim(
                    (string)
                    $data['slug']
                );

            if ($slugSource === '') {
                $slugSource =
                    $data['title'] ??
                    $product->title;
            }

            $payload['slug'] =
                $this->generateUniqueSlug(
                    $slugSource,
                    $product->id
                );
        } elseif (
            array_key_exists(
                'title',
                $data
            ) &&
            $data['title'] !==
            $product->title
        ) {
            $payload['slug'] =
                $this->generateUniqueSlug(
                    $data['title'],
                    $product->id
                );
        }

        /*
        |--------------------------------------------------------------------------
        | Tags
        |--------------------------------------------------------------------------
        */

        if (
            array_key_exists(
                'tags',
                $data
            )
        ) {
            $payload['tags'] =
                $this->normalizeTags(
                    $data['tags'] ??
                    []
                );
        }

        /*
        |--------------------------------------------------------------------------
        | SKU
        |--------------------------------------------------------------------------
        */

        if (
            array_key_exists(
                'sku',
                $data
            )
        ) {
            $payload['sku'] =
                $this->emptyToNull(
                    $data['sku']
                );
        }

        /*
        |--------------------------------------------------------------------------
        | Barcode
        |--------------------------------------------------------------------------
        */

        if (
            array_key_exists(
                'barcode',
                $data
            )
        ) {
            $payload['barcode'] =
                $this->emptyToNull(
                    $data['barcode']
                );
        }

        /*
        |--------------------------------------------------------------------------
        | Disable Pre-order Cleanup
        |--------------------------------------------------------------------------
        */

        $preorderEnabled =
            array_key_exists(
                'preorder_enabled',
                $data
            )
                ? (bool)
                  $data['preorder_enabled']
                : (bool)
                  $product->preorder_enabled;

        if (!$preorderEnabled) {
            $payload['preorder_expected_ship_date'] =
                null;

            $payload['preorder_limit'] =
                0;

            $payload['preorder_deposit_type'] =
                null;

            $payload['preorder_deposit_value'] =
                null;

            $payload['preorder_supplier_eta'] =
                null;

            $payload['preorder_batch_name'] =
                null;

            $payload['preorder_storefront_message'] =
                null;

            $payload['reserved_preorders'] =
                0;

            $payload['sell_only_as_preorder'] =
                false;

            $payload['stop_preorders_after_release_date'] =
                false;
        }

        return $payload;
    }

    /*
    |--------------------------------------------------------------------------
    | Build Variant Inventories
    |--------------------------------------------------------------------------
    |
    | Maps each request variant index to the actual variant ID created or
    | updated by the repository.
    |
    */

    private function buildVariantInventories(
        array $variants,
        array $syncedVariants
    ): array {
        $inventories = [];

        foreach (
            $variants as $variantIndex => $variant
        ) {
            if (
                !isset(
                    $syncedVariants[
                        $variantIndex
                    ]
                )
            ) {
                continue;
            }

            $variantModel =
                $syncedVariants[
                    $variantIndex
                ];

            $variantInventories =
                $variant['inventories'] ??
                [];

            if (
                !is_array(
                    $variantInventories
                )
            ) {
                continue;
            }

            foreach (
                $variantInventories as $inventory
            ) {
                if (
                    empty(
                        $inventory[
                            'location_id'
                        ]
                    )
                ) {
                    continue;
                }

                $inventories[] = [
                    'id' =>
                        $inventory['id'] ??
                        null,

                    'product_variant_id' =>
                        $variantModel->id,

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
            }
        }

        return $inventories;
    }

    /*
    |--------------------------------------------------------------------------
    | Vendor Validation
    |--------------------------------------------------------------------------
    */

    private function validateVendor(
        ?int $vendorId
    ): void {
        if (!$vendorId) {
            return;
        }

        $vendor =
            User::query()
                ->find($vendorId);

        if (!$vendor) {
            throw ValidationException::withMessages([
                'vendor_id' => [
                    'The selected vendor does not exist.',
                ],
            ]);
        }

        if ($vendor->role !== 'vendor') {
            throw ValidationException::withMessages([
                'vendor_id' => [
                    'The selected user is not a vendor.',
                ],
            ]);
        }

        if ($vendor->status !== 'active') {
            throw ValidationException::withMessages([
                'vendor_id' => [
                    'The selected vendor is not active.',
                ],
            ]);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Pricing Validation
    |--------------------------------------------------------------------------
    */

    private function validatePricing(
        array $data,
        ?Product $product = null
    ): void {
        $price =
            array_key_exists(
                'price',
                $data
            )
                ? $data['price']
                : $product?->price;

        $compareAtPrice =
            array_key_exists(
                'compare_at_price',
                $data
            )
                ? $data['compare_at_price']
                : $product?->compare_at_price;

        $costPerItem =
            array_key_exists(
                'cost_per_item',
                $data
            )
                ? $data['cost_per_item']
                : $product?->cost_per_item;

        if (
            $price !== null &&
            (float) $price < 0
        ) {
            throw ValidationException::withMessages([
                'price' => [
                    'Product price cannot be negative.',
                ],
            ]);
        }

        if (
            $compareAtPrice !== null &&
            (float) $compareAtPrice < 0
        ) {
            throw ValidationException::withMessages([
                'compare_at_price' => [
                    'Compare-at price cannot be negative.',
                ],
            ]);
        }

        if (
            $costPerItem !== null &&
            (float) $costPerItem < 0
        ) {
            throw ValidationException::withMessages([
                'cost_per_item' => [
                    'Cost per item cannot be negative.',
                ],
            ]);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Pre-order Validation
    |--------------------------------------------------------------------------
    */

    private function validatePreorder(
        array $data,
        ?Product $product = null
    ): void {
        $enabled =
            array_key_exists(
                'preorder_enabled',
                $data
            )
                ? (bool)
                  $data['preorder_enabled']
                : (bool)
                  $product?->preorder_enabled;

        if (!$enabled) {
            return;
        }

        $paymentCollection =
            $data[
                'preorder_payment_collection'
            ] ??
            $product?->preorder_payment_collection ??
            'pay_later';

        if (
            !in_array(
                $paymentCollection,
                [
                    'pay_later',
                    'pay_now',
                    'deposit',
                ],
                true
            )
        ) {
            throw ValidationException::withMessages([
                'preorder_payment_collection' => [
                    'Invalid pre-order payment collection method.',
                ],
            ]);
        }

        if (
            $paymentCollection ===
            'deposit'
        ) {
            $depositType =
                $data[
                    'preorder_deposit_type'
                ] ??
                $product?->preorder_deposit_type;

            $depositValue =
                $data[
                    'preorder_deposit_value'
                ] ??
                $product?->preorder_deposit_value;

            if (
                !in_array(
                    $depositType,
                    [
                        'fixed',
                        'percentage',
                    ],
                    true
                )
            ) {
                throw ValidationException::withMessages([
                    'preorder_deposit_type' => [
                        'Deposit type must be fixed or percentage.',
                    ],
                ]);
            }

            if (
                $depositValue === null ||
                (float) $depositValue <= 0
            ) {
                throw ValidationException::withMessages([
                    'preorder_deposit_value' => [
                        'A valid deposit value is required.',
                    ],
                ]);
            }

            if (
                $depositType ===
                'percentage' &&
                (float) $depositValue > 100
            ) {
                throw ValidationException::withMessages([
                    'preorder_deposit_value' => [
                        'Percentage deposit cannot be greater than 100.',
                    ],
                ]);
            }
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Normalize Tags
    |--------------------------------------------------------------------------
    */

    private function normalizeTags(
        array $tags
    ): array {
        $normalized = [];

        foreach ($tags as $tag) {
            $value =
                trim(
                    (string)
                    $tag
                );

            if ($value === '') {
                continue;
            }

            $key =
                mb_strtolower(
                    $value
                );

            if (
                array_key_exists(
                    $key,
                    $normalized
                )
            ) {
                continue;
            }

            $normalized[$key] =
                $value;
        }

        return array_values(
            $normalized
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Empty String To Null
    |--------------------------------------------------------------------------
    */

    private function emptyToNull(
        mixed $value
    ): mixed {
        if (
            is_string($value) &&
            trim($value) === ''
        ) {
            return null;
        }

        return $value;
    }

    /*
    |--------------------------------------------------------------------------
    | Unique Product Slug
    |--------------------------------------------------------------------------
    */

    private function generateUniqueSlug(
        string $value,
        ?int $ignoreId = null
    ): string {
        $baseSlug =
            Str::slug($value);

        if ($baseSlug === '') {
            $baseSlug =
                'product';
        }

        $slug =
            $baseSlug;

        $counter = 2;

        while (
            Product::query()
                ->when(
                    $ignoreId,
                    fn ($query) =>
                        $query->where(
                            'id',
                            '!=',
                            $ignoreId
                        )
                )
                ->where(
                    'slug',
                    $slug
                )
                ->exists()
        ) {
            $slug =
                $baseSlug .
                '-' .
                $counter;

            $counter++;
        }

        return $slug;
    }
}
