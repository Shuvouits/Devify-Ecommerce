<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'vendor_id',
        'created_by',
        'brand_id',
        'category_id',

        'title',
        'slug',
        'overview',
        'description',
        'specifications',
        'tags',

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

        'sku',
        'barcode',
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

    protected $casts = [
        'specifications' => 'array',
        'tags' => 'array',

        'is_featured' => 'boolean',

        'publish_online_store' => 'boolean',
        'publish_point_of_sale' => 'boolean',

        'is_final_sale' => 'boolean',
        'return_window_days' => 'integer',

        'preorder_enabled' => 'boolean',
        'preorder_expected_ship_date' => 'date',
        'preorder_limit' => 'integer',
        'preorder_deposit_value' => 'decimal:2',
        'preorder_supplier_eta' => 'date',
        'reserved_preorders' => 'integer',
        'sell_only_as_preorder' => 'boolean',
        'stop_preorders_after_release_date' => 'boolean',

        'price' => 'decimal:2',
        'compare_at_price' => 'decimal:2',
        'cost_per_item' => 'decimal:2',

        'charge_tax' => 'boolean',

        'track_quantity' => 'boolean',
        'continue_selling_when_out_of_stock' => 'boolean',

        'weight' => 'decimal:3',
        'length' => 'decimal:2',
        'width' => 'decimal:2',
        'height' => 'decimal:2',
    ];


    /*
    |--------------------------------------------------------------------------
    | Ownership
    |--------------------------------------------------------------------------
    */

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'vendor_id'
        );
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'created_by'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Organization
    |--------------------------------------------------------------------------
    */

    public function brand(): BelongsTo
    {
        return $this->belongsTo(
            Brand::class
        );
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(
            Category::class
        );
    }

    public function collections(): BelongsToMany
    {
        return $this->belongsToMany(
            Collection::class,
            'collection_product'
        )
            ->withPivot([
                'display_order',
            ])
            ->withTimestamps()
            ->orderByPivot(
                'display_order'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Media
    |--------------------------------------------------------------------------
    */

    public function media(): HasMany
    {
        return $this->hasMany(
            ProductMedia::class
        )->orderBy(
            'display_order'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Global Variants
    |--------------------------------------------------------------------------
    */

    public function globalVariants(): BelongsToMany
    {
        return $this->belongsToMany(
            GlobalVariant::class,
            'product_global_variants'
        )
            ->withPivot([
                'display_order',
            ])
            ->withTimestamps()
            ->orderByPivot(
                'display_order'
            );
    }

    public function globalVariantOptions(): HasMany
    {
        return $this->hasMany(
            ProductGlobalVariantOption::class
        )->orderBy(
            'display_order'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Sellable Variants
    |--------------------------------------------------------------------------
    */

    public function variants(): HasMany
    {
        return $this->hasMany(
            ProductVariant::class
        )->orderBy(
            'display_order'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Inventory
    |--------------------------------------------------------------------------
    */

    public function inventories(): HasMany
    {
        return $this->hasMany(
            ProductInventory::class
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    public function scopeActive(
        Builder $query
    ): Builder {
        return $query->where(
            'status',
            'active'
        );
    }

    public function scopeDraft(
        Builder $query
    ): Builder {
        return $query->where(
            'status',
            'draft'
        );
    }

    public function scopeFeatured(
        Builder $query
    ): Builder {
        return $query->where(
            'is_featured',
            true
        );
    }

    public function scopePublishedOnline(
        Builder $query
    ): Builder {
        return $query
            ->where(
                'status',
                'active'
            )
            ->where(
                'publish_online_store',
                true
            );
    }

    public function scopeForVendor(
        Builder $query,
        int $vendorId
    ): Builder {
        return $query->where(
            'vendor_id',
            $vendorId
        );
    }

    public function scopePreorder(
        Builder $query
    ): Builder {
        return $query->where(
            'preorder_enabled',
            true
        );
    }
}
