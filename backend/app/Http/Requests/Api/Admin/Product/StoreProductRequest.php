<?php

namespace App\Http\Requests\Api\Admin\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            /*
            |--------------------------------------------------------------------------
            | Basic Information
            |--------------------------------------------------------------------------
            */

            'title' => [
                'required',
                'string',
                'max:200',
            ],

            'slug' => [
                'nullable',
                'string',
                'max:220',
            ],

            'overview' => [
                'nullable',
                'string',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'specifications' => [
                'nullable',
                'array',
            ],

            'tags' => [
                'nullable',
                'array',
            ],

            'tags.*' => [
                'string',
                'max:100',
            ],


            /*
            |--------------------------------------------------------------------------
            | Ownership
            |--------------------------------------------------------------------------
            */

            'vendor_id' => [
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
                'nullable',
                'string',
                Rule::in([
                    'draft',
                    'active',
                ]),
            ],

            'is_featured' => [
                'nullable',
                'boolean',
            ],


            /*
            |--------------------------------------------------------------------------
            | Publishing
            |--------------------------------------------------------------------------
            */

            'publish_online_store' => [
                'nullable',
                'boolean',
            ],

            'publish_point_of_sale' => [
                'nullable',
                'boolean',
            ],


            'variants.*.inventories' => [
    'nullable',
    'array',
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
            | Returns
            |--------------------------------------------------------------------------
            */

            'is_final_sale' => [
                'nullable',
                'boolean',
            ],

            'return_window_days' => [
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
                'nullable',
                'boolean',
            ],

            'preorder_expected_ship_date' => [
                'nullable',
                'date',
            ],

            'preorder_limit' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'preorder_payment_collection' => [
                'nullable',
                'string',
                Rule::in([
                    'pay_later',
                    'pay_now',
                    'deposit',
                ]),
            ],

            'preorder_deposit_type' => [
                'nullable',
                'string',
                Rule::in([
                    'fixed',
                    'percentage',
                ]),
            ],

            'preorder_deposit_value' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'preorder_supplier_eta' => [
                'nullable',
                'date',
            ],

            'preorder_batch_name' => [
                'nullable',
                'string',
                'max:150',
            ],

            'preorder_storefront_message' => [
                'nullable',
                'string',
            ],

            'reserved_preorders' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'sell_only_as_preorder' => [
                'nullable',
                'boolean',
            ],

            'stop_preorders_after_release_date' => [
                'nullable',
                'boolean',
            ],


            /*
            |--------------------------------------------------------------------------
            | Base Pricing
            |--------------------------------------------------------------------------
            */

            'price' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'compare_at_price' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'cost_per_item' => [
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
                'nullable',
                'boolean',
            ],

            'tax_class' => [
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
                'nullable',
                'string',
                'max:120',
                Rule::unique(
                    'products',
                    'sku'
                ),
                Rule::unique(
                    'product_variants',
                    'sku'
                ),
            ],

            'barcode' => [
                'nullable',
                'string',
                'max:120',
                Rule::unique(
                    'products',
                    'barcode'
                ),
                Rule::unique(
                    'product_variants',
                    'barcode'
                ),
            ],

            'track_quantity' => [
                'nullable',
                'boolean',
            ],

            'continue_selling_when_out_of_stock' => [
                'nullable',
                'boolean',
            ],


            /*
            |--------------------------------------------------------------------------
            | Shipping
            |--------------------------------------------------------------------------
            */

            'weight' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'weight_unit' => [
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
                'nullable',
                'numeric',
                'min:0',
            ],

            'width' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'height' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'size_unit' => [
                'nullable',
                'string',
                Rule::in([
                    'cm',
                    'mm',
                    'in',
                ]),
            ],

            'country_of_origin' => [
                'nullable',
                'string',
                'max:100',
            ],

            'hs_code' => [
                'nullable',
                'string',
                'max:100',
            ],

            'customs_description' => [
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
                'nullable',
                'array',
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
            | Sellable Variants
            |--------------------------------------------------------------------------
            */

            'variants' => [
                'nullable',
                'array',
            ],

            'variants.*.title' => [
                'nullable',
                'string',
                'max:255',
            ],

            'variants.*.sku' => [
                'nullable',
                'string',
                'max:120',
                Rule::unique(
                    'product_variants',
                    'sku'
                ),
                Rule::unique(
                    'products',
                    'sku'
                ),
            ],

            'variants.*.barcode' => [
                'nullable',
                'string',
                'max:120',
                Rule::unique(
                    'product_variants',
                    'barcode'
                ),
                Rule::unique(
                    'products',
                    'barcode'
                ),
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
            | Inventory By Location
            |--------------------------------------------------------------------------
            |
            | Top-level inventory currently supports non-variant product inventory.
            | Variant inventory will be mapped after variant IDs exist.
            |
            */

            'inventories' => [
                'nullable',
                'array',
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
                'nullable',
                'string',
                'max:70',
            ],

            'seo_description' => [
                'nullable',
                'string',
                'max:160',
            ],
        ];
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

            'global_variants.*.global_variant_id.exists' =>
                'One of the selected global variants is invalid.',

            'global_variants.*.option_ids.min' =>
                'Each selected global variant requires at least one option.',

            'price.min' =>
                'Product price cannot be negative.',

            'compare_at_price.min' =>
                'Compare-at price cannot be negative.',

            'cost_per_item.min' =>
                'Cost per item cannot be negative.',

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
        | Boolean Fields
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
        | Normalize Media Boolean
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
        | Normalize Variant Booleans
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
            $this->merge($data);
        }
    }
}
