<?php

namespace App\Services\Storefront;

use App\Models\Collection;
use Illuminate\Support\Collection as SupportCollection;

class CollectionService
{
    /*
    |--------------------------------------------------------------------------
    | Published Collections
    |--------------------------------------------------------------------------
    */

    public function getPublishedCollections(): SupportCollection
    {
        return Collection::query()
            ->where(
                'status',
                'active'
            )
            ->where(
                'publish_online_store',
                true
            )
            ->orderBy(
                'display_position'
            )
            ->orderBy(
                'title'
            )
            ->get();
    }
}
