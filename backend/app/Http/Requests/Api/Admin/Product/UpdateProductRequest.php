<?php

namespace App\Http\Requests\Api\Admin\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        $productId =
            (int) $this->route('id');

        $rules = [
            /*
            |--------------------------------------------------------------------------
            | Basic Information
            |--------------------------------------------------------------------------
            */

            'title' => [
                'sometimes',
                'required',
                'string',
                'max:200',
            ],

            'slug' => [
                'sometimes',
                'nullable',
                'string',
                'max:220',
            ],

            'overview' => [
                'sometimes',
                'nullable',
                'string',
            ],

            'description' => [
                'sometimes',
                'nullable',
                'string',
            ],

            'specifications' => [
                'sometimes',
                'nullable',
                'array',
            ],

            'tags' => [
                'sometimes',
                'nullable',
                'array',
            ],

            'tags.*' => [
                'string',
                'max:100',
            ],


            'variants.*.inventories' => [
    'nullable',
    'array',
],

'variants.*.inventories.*.id' => [
    'nullable',
    'integer',

    Rule::exists(
        'product_inventories',
        'id'
    )->where(
        fn ($query) =>
            $query->where(
                'product_id',
                $productId
            )
    ),
],

'variants.*.inventories.*.location_id' => [
    'required_with:variants.*.inventories',
    'integer',

    Rule::exists(
        'locations',
        'id'
    ),
],

'variants.*.inventories.*.quantity' => [
    'nullable',
    'integer',
    'min:0',
],

'variants.*.inventories.*.reserved_quantity' => [
    'nullable',
    'integer',
    'min:0',
],

'variants.*.inventories.*.incoming_quantity' => [
    'nullable',
    'integer',
    'min:0',
],


            /*
            |--------------------------------------------------------------------------
            | Ownership
            |--------------------------------------------------------------------------
            */

            'vendor_id' => [
                'sometimes',
                'nullable',
                'integer',
                Rule::exists(
                    'users',
                    'id'
                ),
            ],


            /*
            |--------------------------------------------------------------------------
            | Organization
            |--------------------------------------------------------------------------
            */

            'brand_id' => [
                'sometimes',
                'nullable',
                'integer',
                Rule::exists(
                    'brands',
                    'id'
                )->whereNull(
                    'deleted_at'
                ),
            ],

            'category_id' => [
                'sometimes',
                'nullable',
                'integer',
                Rule::exists(
                    'categories',
                    'id'
                )->whereNull(
                    'deleted_at'
                ),
            ],


            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */

            'status' => [
                'sometimes',
                'required',
                'string',
                Rule::in([
                    'draft',
                    'active',
                ]),
            ],

            'is_featured' => [
                'sometimes',
                'boolean',
            ],


            /*
            |--------------------------------------------------------------------------
            | Publishing
            |--------------------------------------------------------------------------
            */

            'publish_online_store' => [
                'sometimes',
                'boolean',
            ],

            'publish_point_of_sale' => [
                'sometimes',
                'boolean',
            ],


            /*
            |--------------------------------------------------------------------------
            | Returns
            |--------------------------------------------------------------------------
            */

            'is_final_sale' => [
                'sometimes',
                'boolean',
            ],

            'return_window_days' => [
                'sometimes',
                'nullable',
                'integer',
                'min:0',
            ],


            /*
            |--------------------------------------------------------------------------
            | Pre-order
            |--------------------------------------------------------------------------
            */

            'preorder_enabled' => [
                'sometimes',
                'boolean',
            ],

            'preorder_expected_ship_date' => [
                'sometimes',
                'nullable',
                'date',
            ],

            'preorder_limit' => [
                'sometimes',
                'nullable',
                'integer',
                'min:0',
            ],

            'preorder_payment_collection' => [
                'sometimes',
                'nullable',
                'string',
                Rule::in([
                    'pay_later',
                    'pay_now',
                    'deposit',
                ]),
            ],

            'preorder_deposit_type' => [
                'sometimes',
                'nullable',
                'string',
                Rule::in([
                    'fixed',
                    'percentage',
                ]),
            ],

            'preorder_deposit_value' => [
                'sometimes',
                'nullable',
                'numeric',
                'min:0',
            ],

            'preorder_supplier_eta' => [
                'sometimes',
                'nullable',
                'date',
            ],

            'preorder_batch_name' => [
                'sometimes',
                'nullable',
                'string',
                'max:150',
            ],

            'preorder_storefront_message' => [
                'sometimes',
                'nullable',
                'string',
            ],

            'reserved_preorders' => [
                'sometimes',
                'nullable',
                'integer',
                'min:0',
            ],

            'sell_only_as_preorder' => [
                'sometimes',
                'boolean',
            ],

            'stop_preorders_after_release_date' => [
                'sometimes',
                'boolean',
            ],


            /*
            |--------------------------------------------------------------------------
            | Base Pricing
            |--------------------------------------------------------------------------
            */

            'price' => [
                'sometimes',
                'nullable',
                'numeric',
                'min:0',
            ],

            'compare_at_price' => [
                'sometimes',
                'nullable',
                'numeric',
                'min:0',
            ],

            'cost_per_item' => [
                'sometimes',
                'nullable',
                'numeric',
                'min:0',
            ],


            /*
            |--------------------------------------------------------------------------
            | Tax
            |--------------------------------------------------------------------------
            */

            'charge_tax' => [
                'sometimes',
                'boolean',
            ],

            'tax_class' => [
                'sometimes',
                'nullable',
                'string',
                'max:100',
            ],


            /*
            |--------------------------------------------------------------------------
            | Base Inventory
            |--------------------------------------------------------------------------
            */

            'sku' => [
                'sometimes',
                'nullable',
                'string',
                'max:120',

                Rule::unique(
                    'products',
                    'sku'
                )->ignore(
                    $productId
                ),

                Rule::unique(
                    'product_variants',
                    'sku'
                ),
            ],

            'barcode' => [
                'sometimes',
                'nullable',
                'string',
                'max:120',

                Rule::unique(
                    'products',
                    'barcode'
                )->ignore(
                    $productId
                ),

                Rule::unique(
                    'product_variants',
                    'barcode'
                ),
            ],

            'track_quantity' => [
                'sometimes',
                'boolean',
            ],

            'continue_selling_when_out_of_stock' => [
                'sometimes',
                'boolean',
            ],


            /*
            |--------------------------------------------------------------------------
            | Shipping
            |--------------------------------------------------------------------------
            */

            'weight' => [
                'sometimes',
                'nullable',
                'numeric',
                'min:0',
            ],

            'weight_unit' => [
                'sometimes',
                'nullable',
                'string',
                Rule::in([
                    'kg',
                    'g',
                    'lb',
                    'oz',
                ]),
            ],

            'length' => [
                'sometimes',
                'nullable',
                'numeric',
                'min:0',
            ],

            'width' => [
                'sometimes',
                'nullable',
                'numeric',
                'min:0',
            ],

            'height' => [
                'sometimes',
                'nullable',
                'numeric',
                'min:0',
            ],

            'size_unit' => [
                'sometimes',
                'nullable',
                'string',
                Rule::in([
                    'cm',
                    'mm',
                    'in',
                ]),
            ],

            'country_of_origin' => [
                'sometimes',
                'nullable',
                'string',
                'max:100',
            ],

            'hs_code' => [
                'sometimes',
                'nullable',
                'string',
                'max:100',
            ],

            'customs_description' => [
                'sometimes',
                'nullable',
                'string',
                'max:500',
            ],


            /*
            |--------------------------------------------------------------------------
            | Collections
            |--------------------------------------------------------------------------
            */

            'collections' => [
                'sometimes',
                'nullable',
                'array',
            ],

            'collections.*.collection_id' => [
                'required_with:collections',
                'integer',

                Rule::exists(
                    'collections',
                    'id'
                )->whereNull(
                    'deleted_at'
                ),
            ],

            'collections.*.display_order' => [
                'nullable',
                'integer',
                'min:0',
            ],


            /*
            |--------------------------------------------------------------------------
            | Media
            |--------------------------------------------------------------------------
            */

            'media' => [
                'sometimes',
                'nullable',
                'array',
            ],

            'media.*.id' => [
                'nullable',
                'integer',

                Rule::exists(
                    'product_media',
                    'id'
                )->where(
                    fn ($query) =>
                        $query->where(
                            'product_id',
                            $productId
                        )
                ),
            ],

            'media.*.media_type' => [
                'required_with:media',
                'string',
                Rule::in([
                    'image',
                    'video',
                    'youtube',
                    'vimeo',
                    'model_3d',
                ]),
            ],

            'media.*.file_path' => [
                'nullable',
                'string',
                'max:500',
            ],

            'media.*.external_url' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'media.*.alt_text' => [
                'nullable',
                'string',
                'max:255',
            ],

            'media.*.is_cover' => [
                'nullable',
                'boolean',
            ],

            'media.*.display_order' => [
                'nullable',
                'integer',
                'min:0',
            ],


            /*
            |--------------------------------------------------------------------------
            | Global Variants
            |--------------------------------------------------------------------------
            */

            'global_variants' => [
                'sometimes',
                'nullable',
                'array',
            ],

            'global_variants.*.global_variant_id' => [
                'required_with:global_variants',
                'integer',

                Rule::exists(
                    'global_variants',
                    'id'
                ),
            ],

            'global_variants.*.display_order' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'global_variants.*.option_ids' => [
                'required_with:global_variants',
                'array',
                'min:1',
            ],

            'global_variants.*.option_ids.*' => [
                'integer',

                Rule::exists(
                    'global_variant_options',
                    'id'
                ),
            ],


            /*
            |--------------------------------------------------------------------------
            | Product Variants
            |--------------------------------------------------------------------------
            */

            'variants' => [
                'sometimes',
                'nullable',
                'array',
            ],

            'variants.*.id' => [
                'nullable',
                'integer',

                Rule::exists(
                    'product_variants',
                    'id'
                )->where(
                    fn ($query) =>
                        $query->where(
                            'product_id',
                            $productId
                        )
                ),
            ],

            'variants.*.title' => [
                'nullable',
                'string',
                'max:255',
            ],

            'variants.*.price' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'variants.*.compare_at_price' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'variants.*.cost_per_item' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'variants.*.image_path' => [
                'nullable',
                'string',
                'max:500',
            ],

            'variants.*.is_active' => [
                'nullable',
                'boolean',
            ],

            'variants.*.display_order' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'variants.*.is_final_sale' => [
                'nullable',
                'boolean',
            ],

            'variants.*.return_window_days' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'variants.*.option_values' => [
                'required_with:variants',
                'array',
                'min:1',
            ],

            'variants.*.option_values.*.global_variant_id' => [
                'required',
                'integer',

                Rule::exists(
                    'global_variants',
                    'id'
                ),
            ],

            'variants.*.option_values.*.global_variant_option_id' => [
                'required',
                'integer',

                Rule::exists(
                    'global_variant_options',
                    'id'
                ),
            ],


            /*
            |--------------------------------------------------------------------------
            | Inventory
            |--------------------------------------------------------------------------
            */

            'inventories' => [
                'sometimes',
                'nullable',
                'array',
            ],

            'inventories.*.id' => [
                'nullable',
                'integer',

                Rule::exists(
                    'product_inventories',
                    'id'
                )->where(
                    fn ($query) =>
                        $query->where(
                            'product_id',
                            $productId
                        )
                ),
            ],

            'inventories.*.location_id' => [
                'required_with:inventories',
                'integer',

                Rule::exists(
                    'locations',
                    'id'
                ),
            ],

            'inventories.*.product_variant_id' => [
                'nullable',
                'integer',

                Rule::exists(
                    'product_variants',
                    'id'
                )->where(
                    fn ($query) =>
                        $query->where(
                            'product_id',
                            $productId
                        )
                ),
            ],

            'inventories.*.quantity' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'inventories.*.reserved_quantity' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'inventories.*.incoming_quantity' => [
                'nullable',
                'integer',
                'min:0',
            ],


            /*
            |--------------------------------------------------------------------------
            | SEO
            |--------------------------------------------------------------------------
            */

            'seo_title' => [
                'sometimes',
                'nullable',
                'string',
                'max:70',
            ],

            'seo_description' => [
                'sometimes',
                'nullable',
                'string',
                'max:160',
            ],
        ];


        /*
        |--------------------------------------------------------------------------
        | Dynamic Variant SKU / Barcode Validation
        |--------------------------------------------------------------------------
        */

        $variants =
            $this->input(
                'variants',
                []
            );

        if (is_array($variants)) {
            foreach (
                $variants as $index => $variant
            ) {
                $variantId =
                    !empty(
                        $variant['id']
                    )
                        ? (int)
                          $variant['id']
                        : null;

                $rules[
                    "variants.{$index}.sku"
                ] = [
                    'nullable',
                    'string',
                    'max:120',

                    Rule::unique(
                        'product_variants',
                        'sku'
                    )->ignore(
                        $variantId
                    ),

                    Rule::unique(
                        'products',
                        'sku'
                    )->ignore(
                        $productId
                    ),
                ];

                $rules[
                    "variants.{$index}.barcode"
                ] = [
                    'nullable',
                    'string',
                    'max:120',

                    Rule::unique(
                        'product_variants',
                        'barcode'
                    )->ignore(
                        $variantId
                    ),

                    Rule::unique(
                        'products',
                        'barcode'
                    )->ignore(
                        $productId
                    ),
                ];
            }
        }

        return $rules;
    }


    public function messages(): array
    {
        return [
            'title.required' =>
                'Product title is required.',

            'status.in' =>
                'Product status must be draft or active.',

            'brand_id.exists' =>
                'The selected brand is invalid.',

            'category_id.exists' =>
                'The selected category is invalid.',

            'vendor_id.exists' =>
                'The selected vendor is invalid.',

            'collections.*.collection_id.exists' =>
                'One of the selected collections is invalid.',

            'media.*.id.exists' =>
                'One of the selected media items does not belong to this product.',

            'global_variants.*.global_variant_id.exists' =>
                'One of the selected global variants is invalid.',

            'global_variants.*.option_ids.min' =>
                'Each global variant requires at least one option.',

            'variants.*.id.exists' =>
                'One of the selected product variants does not belong to this product.',

            'inventories.*.id.exists' =>
                'One of the inventory records does not belong to this product.',

            'inventories.*.product_variant_id.exists' =>
                'One of the inventory variants does not belong to this product.',

            'sku.unique' =>
                'This SKU is already in use.',

            'barcode.unique' =>
                'This barcode is already in use.',

            'variants.*.sku.unique' =>
                'One of the variant SKUs is already in use.',

            'variants.*.barcode.unique' =>
                'One of the variant barcodes is already in use.',

            'seo_title.max' =>
                'SEO title may not be greater than 70 characters.',

            'seo_description.max' =>
                'SEO description may not be greater than 160 characters.',
        ];
    }


    protected function prepareForValidation(): void
    {
        $data = [];

        /*
        |--------------------------------------------------------------------------
        | Product Boolean Fields
        |--------------------------------------------------------------------------
        */

        $booleanFields = [
            'is_featured',
            'publish_online_store',
            'publish_point_of_sale',
            'is_final_sale',
            'preorder_enabled',
            'sell_only_as_preorder',
            'stop_preorders_after_release_date',
            'charge_tax',
            'track_quantity',
            'continue_selling_when_out_of_stock',
        ];

        foreach ($booleanFields as $field) {
            if (
                array_key_exists(
                    $field,
                    $this->all()
                )
            ) {
                $data[$field] =
                    $this->boolean(
                        $field
                    );
            }
        }


        /*
        |--------------------------------------------------------------------------
        | Empty Slug
        |--------------------------------------------------------------------------
        */

        if (
            array_key_exists(
                'slug',
                $this->all()
            ) &&
            trim(
                (string)
                $this->input('slug')
            ) === ''
        ) {
            $data['slug'] = null;
        }


        /*
        |--------------------------------------------------------------------------
        | Media Boolean Fields
        |--------------------------------------------------------------------------
        */

        if (
            array_key_exists(
                'media',
                $this->all()
            ) &&
            is_array(
                $this->input('media')
            )
        ) {
            $media =
                array_map(
                    function ($item) {
                        if (
                            array_key_exists(
                                'is_cover',
                                $item
                            )
                        ) {
                            $item['is_cover'] =
                                filter_var(
                                    $item['is_cover'],
                                    FILTER_VALIDATE_BOOLEAN
                                );
                        }

                        return $item;
                    },
                    $this->input(
                        'media',
                        []
                    )
                );

            $data['media'] =
                $media;
        }


        /*
        |--------------------------------------------------------------------------
        | Variant Boolean Fields
        |--------------------------------------------------------------------------
        */

        if (
            array_key_exists(
                'variants',
                $this->all()
            ) &&
            is_array(
                $this->input('variants')
            )
        ) {
            $variants =
                array_map(
                    function ($variant) {
                        foreach (
                            [
                                'is_active',
                                'is_final_sale',
                            ] as $field
                        ) {
                            if (
                                array_key_exists(
                                    $field,
                                    $variant
                                )
                            ) {
                                $variant[$field] =
                                    filter_var(
                                        $variant[$field],
                                        FILTER_VALIDATE_BOOLEAN
                                    );
                            }
                        }

                        return $variant;
                    },
                    $this->input(
                        'variants',
                        []
                    )
                );

            $data['variants'] =
                $variants;
        }


        if (!empty($data)) {
            $this->merge(
                $data
            );
        }
    }
}
