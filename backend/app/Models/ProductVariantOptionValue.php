<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariantOptionValue extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_variant_id',
        'global_variant_id',
        'global_variant_option_id',
    ];


    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function productVariant(): BelongsTo
    {
        return $this->belongsTo(
            ProductVariant::class
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
}
