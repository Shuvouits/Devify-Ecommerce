<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Collection extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'image_path',
        'status',
        'publish_online_store',
        'publish_point_of_sale',
        'kind',
        'collection_type',
        'automation_match_type',
        'automation_conditions',
        'sort_order',
        'display_position',
        'seo_title',
        'seo_description',
        'created_by',
    ];

    protected $casts = [
        'publish_online_store' => 'boolean',
        'publish_point_of_sale' => 'boolean',
        'automation_conditions' => 'array',
        'display_position' => 'integer',
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

    public function scopeManual(
        Builder $query
    ): Builder {
        return $query->where(
            'collection_type',
            'manual'
        );
    }

    public function scopeAutomated(
        Builder $query
    ): Builder {
        return $query->where(
            'collection_type',
            'automated'
        );
    }

    public function scopeOrdered(
        Builder $query
    ): Builder {
        return $query
            ->orderBy(
                'display_position'
            )
            ->orderBy(
                'title'
            );
    }

    public function products(): BelongsToMany
{
    return $this->belongsToMany(
        Product::class,
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


}
