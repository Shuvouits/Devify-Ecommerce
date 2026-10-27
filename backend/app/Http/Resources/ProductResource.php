<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            /*
            |--------------------------------------------------------------------------
            | Core
            |--------------------------------------------------------------------------
            */

            'id' => $this->id,

            'title' => $this->title,

            'slug' => $this->slug,

            'overview' => $this->overview,

            'description' => $this->description,

            'specifications' =>
                $this->specifications ?? [],

            'tags' =>
                $this->tags ?? [],


            /*
            |--------------------------------------------------------------------------
            | Status & Publishing
            |--------------------------------------------------------------------------
            */

            'status' => $this->status,

            'is_featured' =>
                (bool) $this->is_featured,

            'publish_online_store' =>
                (bool) $this->publish_online_store,

            'publish_point_of_sale' =>
                (bool) $this->publish_point_of_sale,


            /*
            |--------------------------------------------------------------------------
            | Organization
            |--------------------------------------------------------------------------
            */

            'brand' => $this->whenLoaded(
                'brand',
                fn () => $this->brand
                    ? [
                        'id' =>
                            $this->brand->id,

                        'name' =>
                            $this->brand->name,

                        'slug' =>
                            $this->brand->slug,
                    ]
                    : null
            ),

            'category' => $this->whenLoaded(
                'category',
                fn () => $this->category
                    ? [
                        'id' =>
                            $this->category->id,

                        'name' =>
                            $this->category->name,

                        'slug' =>
                            $this->category->slug,
                    ]
                    : null
            ),

            'collections' => $this->whenLoaded(
                'collections',
                fn () =>
                    $this->collections
                        ->map(
                            fn ($collection) => [
                                'id' =>
                                    $collection->id,

                                'title' =>
                                    $collection->title,

                                'slug' =>
                                    $collection->slug,

                                'status' =>
                                    $collection->status,

                                'display_order' =>
                                    $collection->pivot
                                        ? (int)
                                          $collection->pivot
                                              ->display_order
                                        : null,
                            ]
                        )
                        ->values()
            ),


            /*
            |--------------------------------------------------------------------------
            | Ownership
            |--------------------------------------------------------------------------
            */

            'vendor' => $this->whenLoaded(
                'vendor',
                fn () => $this->vendor
                    ? [
                        'id' =>
                            $this->vendor->id,

                        'name' =>
                            $this->vendor->name,

                        'email' =>
                            $this->vendor->email,
                    ]
                    : null
            ),

            'creator' => $this->whenLoaded(
                'creator',
                fn () => $this->creator
                    ? [
                        'id' =>
                            $this->creator->id,

                        'name' =>
                            $this->creator->name,

                        'email' =>
                            $this->creator->email,
                    ]
                    : null
            ),


            /*
            |--------------------------------------------------------------------------
            | Returns
            |--------------------------------------------------------------------------
            */

            'returns' => [
                'is_final_sale' =>
                    (bool) $this->is_final_sale,

                'return_window_days' =>
                    $this->return_window_days !== null
                        ? (int)
                          $this->return_window_days
                        : null,
            ],


            /*
            |--------------------------------------------------------------------------
            | Pre-order
            |--------------------------------------------------------------------------
            */

            'preorder' => [
                'enabled' =>
                    (bool) $this->preorder_enabled,

                'expected_ship_date' =>
                    $this->preorder_expected_ship_date
                        ? $this
                            ->preorder_expected_ship_date
                            ->format('Y-m-d')
                        : null,

                'limit' =>
                    (int)
                    $this->preorder_limit,

                'payment_collection' =>
                    $this->preorder_payment_collection,

                'deposit_type' =>
                    $this->preorder_deposit_type,

                'deposit_value' =>
                    $this->preorder_deposit_value !== null
                        ? (float)
                          $this->preorder_deposit_value
                        : null,

                'supplier_eta' =>
                    $this->preorder_supplier_eta
                        ? $this
                            ->preorder_supplier_eta
                            ->format('Y-m-d')
                        : null,

                'batch_name' =>
                    $this->preorder_batch_name,

                'storefront_message' =>
                    $this->preorder_storefront_message,

                'reserved_preorders' =>
                    (int)
                    $this->reserved_preorders,

                'sell_only_as_preorder' =>
                    (bool)
                    $this->sell_only_as_preorder,

                'stop_preorders_after_release_date' =>
                    (bool)
                    $this->stop_preorders_after_release_date,
            ],


            /*
            |--------------------------------------------------------------------------
            | Pricing
            |--------------------------------------------------------------------------
            */

            'pricing' => [
                'price' =>
                    $this->price !== null
                        ? (float) $this->price
                        : null,

                'compare_at_price' =>
                    $this->compare_at_price !== null
                        ? (float)
                          $this->compare_at_price
                        : null,

                'cost_per_item' =>
                    $this->cost_per_item !== null
                        ? (float)
                          $this->cost_per_item
                        : null,

                'charge_tax' =>
                    (bool) $this->charge_tax,

                'tax_class' =>
                    $this->tax_class,
            ],


            /*
            |--------------------------------------------------------------------------
            | Base Inventory Settings
            |--------------------------------------------------------------------------
            */

            'inventory_settings' => [
                'sku' =>
                    $this->sku,

                'barcode' =>
                    $this->barcode,

                'track_quantity' =>
                    (bool)
                    $this->track_quantity,

                'continue_selling_when_out_of_stock' =>
                    (bool)
                    $this
                        ->continue_selling_when_out_of_stock,
            ],


            /*
            |--------------------------------------------------------------------------
            | Shipping & Customs
            |--------------------------------------------------------------------------
            */

            'shipping' => [
                'weight' =>
                    (float) $this->weight,

                'weight_unit' =>
                    $this->weight_unit,

                'length' =>
                    (float) $this->length,

                'width' =>
                    (float) $this->width,

                'height' =>
                    (float) $this->height,

                'size_unit' =>
                    $this->size_unit,

                'country_of_origin' =>
                    $this->country_of_origin,

                'hs_code' =>
                    $this->hs_code,

                'customs_description' =>
                    $this->customs_description,
            ],


            /*
            |--------------------------------------------------------------------------
            | Media
            |--------------------------------------------------------------------------
            */

            'media' => $this->whenLoaded(
                'media',
                fn () =>
                    $this->media
                        ->map(
                            fn ($media) => [
                                'id' =>
                                    $media->id,

                                'media_type' =>
                                    $media->media_type,

                                'file_path' =>
                                    $media->file_path,

                                'external_url' =>
                                    $media->external_url,

                                'alt_text' =>
                                    $media->alt_text,

                                'is_cover' =>
                                    (bool)
                                    $media->is_cover,

                                'display_order' =>
                                    (int)
                                    $media->display_order,
                            ]
                        )
                        ->values()
            ),


            /*
            |--------------------------------------------------------------------------
            | Global Variant Configuration
            |--------------------------------------------------------------------------
            */

            'global_variants' => $this->whenLoaded(
                'globalVariants',
                fn () =>
                    $this->globalVariants
                        ->map(
                            function ($variant) {
                                $selectedOptionIds =
                                    $this
                                        ->globalVariantOptions
                                        ->where(
                                            'global_variant_id',
                                            $variant->id
                                        )
                                        ->pluck(
                                            'global_variant_option_id'
                                        )
                                        ->map(
                                            fn ($id) =>
                                                (int) $id
                                        )
                                        ->values();

                                return [
                                    'id' =>
                                        $variant->id,

                                    'name' =>
                                        $variant->name,

                                    'slug' =>
                                        $variant->slug,

                                    'visual_type' =>
                                        $variant->visual_type,

                                    'display_order' =>
                                        $variant->pivot
                                            ? (int)
                                              $variant->pivot
                                                  ->display_order
                                            : 0,

                                    'selected_option_ids' =>
                                        $selectedOptionIds,

                                    'options' =>
                                        $variant->relationLoaded(
                                            'options'
                                        )
                                            ? $variant
                                                ->options
                                                ->map(
                                                    fn ($option) => [
                                                        'id' =>
                                                            $option->id,

                                                        'value' =>
                                                            $option->value,

                                                        'color_hex' =>
                                                            $option
                                                                ->color_hex,

                                                        'display_order' =>
                                                            (int)
                                                            $option
                                                                ->display_order,

                                                        'is_active' =>
                                                            (bool)
                                                            $option
                                                                ->is_active,

                                                        'selected' =>
                                                            $selectedOptionIds
                                                                ->contains(
                                                                    $option->id
                                                                ),
                                                    ]
                                                )
                                                ->values()
                                            : [],
                                ];
                            }
                        )
                        ->values()
            ),


            /*
            |--------------------------------------------------------------------------
            | Sellable Variants
            |--------------------------------------------------------------------------
            */

            'variants' => $this->whenLoaded(
                'variants',
                fn () =>
                    $this->variants
                        ->map(
                            fn ($variant) => [
                                'id' =>
                                    $variant->id,

                                'title' =>
                                    $variant->title,

                                'sku' =>
                                    $variant->sku,

                                'barcode' =>
                                    $variant->barcode,

                                'price' =>
                                    $variant->price !== null
                                        ? (float)
                                          $variant->price
                                        : null,

                                'compare_at_price' =>
                                    $variant
                                            ->compare_at_price !== null
                                        ? (float)
                                          $variant
                                              ->compare_at_price
                                        : null,

                                'cost_per_item' =>
                                    $variant
                                            ->cost_per_item !== null
                                        ? (float)
                                          $variant
                                              ->cost_per_item
                                        : null,

                                'image_path' =>
                                    $variant->image_path,

                                'is_active' =>
                                    (bool)
                                    $variant->is_active,

                                'display_order' =>
                                    (int)
                                    $variant->display_order,

                                'is_final_sale' =>
                                    $variant->is_final_sale !== null
                                        ? (bool)
                                          $variant->is_final_sale
                                        : null,

                                'return_window_days' =>
                                    $variant
                                            ->return_window_days !== null
                                        ? (int)
                                          $variant
                                              ->return_window_days
                                        : null,

                                'option_values' =>
                                    $variant->relationLoaded(
                                        'optionValues'
                                    )
                                        ? $variant
                                            ->optionValues
                                            ->map(
                                                fn ($value) => [
                                                    'global_variant_id' =>
                                                        $value
                                                            ->global_variant_id,

                                                    'global_variant_name' =>
                                                        $value
                                                            ->globalVariant
                                                            ?->name,

                                                    'global_variant_option_id' =>
                                                        $value
                                                            ->global_variant_option_id,

                                                    'value' =>
                                                        $value
                                                            ->globalVariantOption
                                                            ?->value,

                                                    'color_hex' =>
                                                        $value
                                                            ->globalVariantOption
                                                            ?->color_hex,
                                                ]
                                            )
                                            ->values()
                                        : [],

                                'inventories' =>
                                    $variant->relationLoaded(
                                        'inventories'
                                    )
                                        ? $variant
                                            ->inventories
                                            ->map(
                                                fn ($inventory) => [
                                                    'id' =>
                                                        $inventory->id,

                                                    'location_id' =>
                                                        $inventory
                                                            ->location_id,

                                                    'location_name' =>
                                                        $inventory
                                                            ->location
                                                            ?->name,

                                                    'quantity' =>
                                                        (int)
                                                        $inventory
                                                            ->quantity,

                                                    'reserved_quantity' =>
                                                        (int)
                                                        $inventory
                                                            ->reserved_quantity,

                                                    'incoming_quantity' =>
                                                        (int)
                                                        $inventory
                                                            ->incoming_quantity,

                                                    'available_quantity' =>
                                                        (int)
                                                        $inventory
                                                            ->available_quantity,
                                                ]
                                            )
                                            ->values()
                                        : [],
                            ]
                        )
                        ->values()
            ),


            /*
            |--------------------------------------------------------------------------
            | Base Product Inventory By Location
            |--------------------------------------------------------------------------
            */

            'inventories' => $this->whenLoaded(
                'inventories',
                fn () =>
                    $this->inventories
                        ->whereNull(
                            'product_variant_id'
                        )
                        ->map(
                            fn ($inventory) => [
                                'id' =>
                                    $inventory->id,

                                'location_id' =>
                                    $inventory->location_id,

                                'location_name' =>
                                    $inventory->location
                                        ?->name,

                                'quantity' =>
                                    (int)
                                    $inventory->quantity,

                                'reserved_quantity' =>
                                    (int)
                                    $inventory
                                        ->reserved_quantity,

                                'incoming_quantity' =>
                                    (int)
                                    $inventory
                                        ->incoming_quantity,

                                'available_quantity' =>
                                    (int)
                                    $inventory
                                        ->available_quantity,
                            ]
                        )
                        ->values()
            ),


            /*
            |--------------------------------------------------------------------------
            | SEO
            |--------------------------------------------------------------------------
            */

            'seo' => [
                'title' =>
                    $this->seo_title,

                'description' =>
                    $this->seo_description,
            ],


            /*
            |--------------------------------------------------------------------------
            | Counts
            |--------------------------------------------------------------------------
            */

            'variants_count' =>
                isset(
                    $this->variants_count
                )
                    ? (int)
                      $this->variants_count
                    : null,

            'collections_count' =>
                isset(
                    $this->collections_count
                )
                    ? (int)
                      $this->collections_count
                    : null,


            /*
            |--------------------------------------------------------------------------
            | Dates
            |--------------------------------------------------------------------------
            */

            'created_at' =>
                $this->created_at
                    ?->toISOString(),

            'updated_at' =>
                $this->updated_at
                    ?->toISOString(),
        ];
    }
}
