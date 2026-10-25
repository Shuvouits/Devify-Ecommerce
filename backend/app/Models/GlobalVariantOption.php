<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GlobalVariantOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'global_variant_id',
        'value',
        'color_hex',
        'display_order',
        'is_active',
    ];


    protected $casts = [
        'display_order' => 'integer',
        'is_active' => 'boolean',
    ];


    /*
    |--------------------------------------------------------------------------
    | Global Variant
    |--------------------------------------------------------------------------
    */

    public function globalVariant(): BelongsTo
    {
        return $this->belongsTo(
            GlobalVariant::class
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Active Scope
    |--------------------------------------------------------------------------
    */

    public function scopeActive($query)
    {
        return $query->where(
            'is_active',
            true
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Ordered Scope
    |--------------------------------------------------------------------------
    */

    public function scopeOrdered($query)
    {
        return $query
            ->orderBy('display_order')
            ->orderBy('value');
    }
}
