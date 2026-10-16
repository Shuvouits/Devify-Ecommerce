<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Brand extends Model
{
    use SoftDeletes;


    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */

    public const STATUS_ACTIVE = 'active';

    public const STATUS_INACTIVE = 'inactive';


    /*
    |--------------------------------------------------------------------------
    | Approval Status
    |--------------------------------------------------------------------------
    */

    public const APPROVAL_PENDING = 'pending';

    public const APPROVAL_APPROVED = 'approved';

    public const APPROVAL_REJECTED = 'rejected';


    /*
    |--------------------------------------------------------------------------
    | Source
    |--------------------------------------------------------------------------
    */

    public const SOURCE_OFFICIAL = 'official';

    public const SOURCE_VENDOR = 'vendor';


    /*
    |--------------------------------------------------------------------------
    | Fillable
    |--------------------------------------------------------------------------
    */

    protected $fillable = [
        'name',
        'slug',
        'description',
        'website',
        'logo_path',

        'status',
        'is_featured',
        'display_order',

        'source',
        'approval_status',
        'approved_by',
        'approved_at',
        'rejection_reason',

        'seo_title',
        'seo_description',

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
            'is_featured' => 'boolean',
            'display_order' => 'integer',

            'approved_at' => 'datetime',
            'archived_at' => 'datetime',
        ];
    }


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


    public function approver(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'approved_by'
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
        return $query
            ->where(
                'status',
                self::STATUS_ACTIVE
            )
            ->where(
                'approval_status',
                self::APPROVAL_APPROVED
            )
            ->whereNull(
                'archived_at'
            );
    }


    public function scopePending(
        Builder $query
    ): Builder {
        return $query
            ->where(
                'approval_status',
                self::APPROVAL_PENDING
            )
            ->whereNull(
                'archived_at'
            );
    }


    public function scopeFeatured(
        Builder $query
    ): Builder {
        return $query
            ->where(
                'is_featured',
                true
            )
            ->whereNull(
                'archived_at'
            );
    }


    public function scopeInactive(
        Builder $query
    ): Builder {
        return $query
            ->where(
                'status',
                self::STATUS_INACTIVE
            )
            ->whereNull(
                'archived_at'
            );
    }


    public function scopeRejected(
        Builder $query
    ): Builder {
        return $query
            ->where(
                'approval_status',
                self::APPROVAL_REJECTED
            )
            ->whereNull(
                'archived_at'
            );
    }


    public function scopeArchived(
        Builder $query
    ): Builder {
        return $query
            ->whereNotNull(
                'archived_at'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    public function isArchived(): bool
    {
        return !is_null(
            $this->archived_at
        );
    }


    public function isApproved(): bool
    {
        return
            $this->approval_status ===
            self::APPROVAL_APPROVED;
    }
}