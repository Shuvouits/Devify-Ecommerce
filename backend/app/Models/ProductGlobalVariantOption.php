<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductGlobalVariantOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'global_variant_id',
        'global_variant_option_id',
        'display_order',
    ];

    protected $casts = [
        'display_order' => 'integer',
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

    public function globalVariant(): BelongsTo
    {
        return $this->belongsTo(
            GlobalVariant::class
        );
    }

    public function globalVariantOption(): BelongsTo
    {
        return $this->belongsTo(
            GlobalVariantOption::class
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    public function scopeOrdered($query)
    {
        return $query
            ->orderBy(
                'display_order'
            )
            ->orderBy(
                'id'
            );
    }
}
