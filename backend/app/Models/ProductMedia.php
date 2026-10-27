<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductMedia extends Model
{
    use HasFactory;

    protected $table = 'product_media';

    protected $fillable = [
        'product_id',
        'media_type',
        'file_path',
        'external_url',
        'alt_text',
        'is_cover',
        'display_order',
    ];

    protected $casts = [
        'is_cover' => 'boolean',
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

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    public function scopeImages($query)
    {
        return $query->where(
            'media_type',
            'image'
        );
    }

    public function scopeCover($query)
    {
        return $query->where(
            'is_cover',
            true
        );
    }

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
