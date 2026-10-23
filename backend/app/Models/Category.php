<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory;
    use SoftDeletes;


    /*
    |--------------------------------------------------------------------------
    | Constants
    |--------------------------------------------------------------------------
    */

    public const STATUS_ACTIVE = 'active';

    public const STATUS_INACTIVE = 'inactive';


    public const MAX_DEPTH = 3;


    /*
    |--------------------------------------------------------------------------
    | Fillable
    |--------------------------------------------------------------------------
    */

    protected $fillable = [
        'name',
        'slug',
        'description',

        'parent_id',

        'status',
        'is_featured',
        'display_order',

        'tax_class',

        'image_path',
        'icon_path',

        'seo_title',
        'seo_description',
        'tags',

        'archived_at',
        'created_by',
    ];


    /*
    |--------------------------------------------------------------------------
    | Casts
    |--------------------------------------------------------------------------
    */

    protected function casts(): array
    {
        return [
            'parent_id' => 'integer',

            'is_featured' => 'boolean',

            'display_order' => 'integer',

            'tags' => 'array',

            'archived_at' => 'datetime',

            'created_by' => 'integer',
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | Parent
    |--------------------------------------------------------------------------
    */

    public function parent(): BelongsTo
    {
        return $this->belongsTo(
            Category::class,
            'parent_id'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Children
    |--------------------------------------------------------------------------
    */

    public function children(): HasMany
    {
        return $this->hasMany(
            Category::class,
            'parent_id'
        )
            ->orderBy('display_order')
            ->orderBy('name');
    }


    /*
    |--------------------------------------------------------------------------
    | Active Children
    |--------------------------------------------------------------------------
    */

    public function activeChildren(): HasMany
    {
        return $this->children()
            ->where(
                'status',
                self::STATUS_ACTIVE
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
    | Scope: Active
    |--------------------------------------------------------------------------
    */

    public function scopeActive(
        Builder $query
    ): Builder {
        return $query->where(
            'status',
            self::STATUS_ACTIVE
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Scope: Inactive
    |--------------------------------------------------------------------------
    */

    public function scopeInactive(
        Builder $query
    ): Builder {
        return $query->where(
            'status',
            self::STATUS_INACTIVE
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Scope: Featured
    |--------------------------------------------------------------------------
    */

    public function scopeFeatured(
        Builder $query
    ): Builder {
        return $query->where(
            'is_featured',
            true
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Scope: Root Categories
    |--------------------------------------------------------------------------
    */

    public function scopeRoot(
        Builder $query
    ): Builder {
        return $query->whereNull(
            'parent_id'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Scope: Archived
    |--------------------------------------------------------------------------
    */

    public function scopeArchived(
        Builder $query
    ): Builder {
        return $query->whereNotNull(
            'archived_at'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Scope: Not Archived
    |--------------------------------------------------------------------------
    */

    public function scopeNotArchived(
        Builder $query
    ): Builder {
        return $query->whereNull(
            'archived_at'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    public function isActive(): bool
    {
        return $this->status ===
            self::STATUS_ACTIVE;
    }


    public function isFeatured(): bool
    {
        return (bool) $this->is_featured;
    }


    public function isArchived(): bool
    {
        return $this->archived_at !== null;
    }


    public function isRoot(): bool
    {
        return $this->parent_id === null;
    }


    /*
    |--------------------------------------------------------------------------
    | Category Depth
    |--------------------------------------------------------------------------
    |
    | Root category = Level 1
    | Child         = Level 2
    | Grandchild    = Level 3
    |
    | Level 4 will be blocked later inside CategoryService.
    |
    */

    public function getDepth(): int
    {
        $depth = 1;

        $parent =
            $this->parent;


        while ($parent) {
            $depth++;

            $parent =
                $parent->parent;


            if (
                $depth >
                self::MAX_DEPTH
            ) {
                break;
            }
        }


        return $depth;
    }


    /*
    |--------------------------------------------------------------------------
    | Can Have Children
    |--------------------------------------------------------------------------
    */

    public function canHaveChildren(): bool
    {
        return $this->getDepth() <
            self::MAX_DEPTH;
    }


    /*
    |--------------------------------------------------------------------------
    | Image URL
    |--------------------------------------------------------------------------
    */

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image_path) {
            return null;
        }


        return asset(
            ltrim(
                $this->image_path,
                '/'
            )
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Icon URL
    |--------------------------------------------------------------------------
    */

    public function getIconUrlAttribute(): ?string
    {
        if (!$this->icon_path) {
            return null;
        }


        return asset(
            ltrim(
                $this->icon_path,
                '/'
            )
        );
    }
}
