<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'title',
        'sku',
        'barcode',
        'price',
        'compare_at_price',
        'cost_per_item',
        'image_path',
        'is_active',
        'display_order',
        'is_final_sale',
        'return_window_days',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'compare_at_price' => 'decimal:2',
        'cost_per_item' => 'decimal:2',
        'is_active' => 'boolean',
        'display_order' => 'integer',
        'is_final_sale' => 'boolean',
        'return_window_days' => 'integer',
    ];


    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function product(): BelongsTo
    {
        return $this->belongsTo(
            Product::class
        );
    }

    public function optionValues(): HasMany
    {
        return $this->hasMany(
            ProductVariantOptionValue::class
        );
    }

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
            'is_active',
            true
        );
    }

    public function scopeOrdered(
        Builder $query
    ): Builder {
        return $query
            ->orderBy(
                'display_order'
            )
            ->orderBy(
                'id'
            );
    }
}
