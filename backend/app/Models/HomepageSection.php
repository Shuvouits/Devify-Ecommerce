<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomepageSection extends Model
{
    protected $fillable = [
        'section_key',
        'is_active',
        'item_limit',
        'settings',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'item_limit' => 'integer',
        'settings' => 'array',
    ];
}
