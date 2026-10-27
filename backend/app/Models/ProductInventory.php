<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductInventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'product_variant_id',
        'location_id',
        'quantity',
        'reserved_quantity',
        'incoming_quantity',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'reserved_quantity' => 'integer',
        'incoming_quantity' => 'integer',
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

    public function productVariant(): BelongsTo
    {
        return $this->belongsTo(
            ProductVariant::class
        );
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(
            Location::class
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Computed Stock
    |--------------------------------------------------------------------------
    */

    public function getAvailableQuantityAttribute(): int
    {
        return max(
            $this->quantity -
            $this->reserved_quantity,
            0
        );
    }
}
