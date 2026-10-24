<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Location extends Model
{
    use HasFactory;


    protected $fillable = [
        'name',
        'address',
        'can_collect',
        'ships_online_orders',
        'sells_over_counter',
        'receives_returns',
        'is_default',
        'status',
        'delivery_order',
        'created_by',
    ];


    protected $casts = [
        'can_collect' =>
            'boolean',

        'ships_online_orders' =>
            'boolean',

        'sells_over_counter' =>
            'boolean',

        'receives_returns' =>
            'boolean',

        'is_default' =>
            'boolean',

        'delivery_order' =>
            'integer',
    ];


    /*
    |--------------------------------------------------------------------------
    | Relationships
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
    | Scopes
    |--------------------------------------------------------------------------
    */

    public function scopeActive(
        $query
    ) {
        return $query->where(
            'status',
            'active'
        );
    }


    public function scopeInactive(
        $query
    ) {
        return $query->where(
            'status',
            'inactive'
        );
    }


    public function scopeDefault(
        $query
    ) {
        return $query->where(
            'is_default',
            true
        );
    }
}
