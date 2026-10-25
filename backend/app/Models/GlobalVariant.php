<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GlobalVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'visual_type',
        'display_order',
        'is_active',
        'created_by',
    ];


    protected $casts = [
        'display_order' => 'integer',
        'is_active' => 'boolean',
    ];


    /*
    |--------------------------------------------------------------------------
    | Options
    |--------------------------------------------------------------------------
    */

    public function options(): HasMany
    {
        return $this->hasMany(
            GlobalVariantOption::class
        )->orderBy(
            'display_order'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Active Options
    |--------------------------------------------------------------------------
    */

    public function activeOptions(): HasMany
    {
        return $this->hasMany(
            GlobalVariantOption::class
        )
            ->where(
                'is_active',
                true
            )
            ->orderBy(
                'display_order'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Creator
    |--------------------------------------------------------------------------
    */

    public function creator(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'created_by'
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
            ->orderBy('name');
    }
}
