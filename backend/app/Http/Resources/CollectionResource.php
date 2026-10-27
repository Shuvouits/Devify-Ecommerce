<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CollectionResource extends JsonResource
{
    public function toArray(
        Request $request
    ): array {
        return [
            'id' =>
                $this->id,

            'title' =>
                $this->title,

            'slug' =>
                $this->slug,

            'description' =>
                $this->description,

            'image_path' =>
                $this->image_path,

            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */

            'status' =>
                $this->status,

            /*
            |--------------------------------------------------------------------------
            | Publishing
            |--------------------------------------------------------------------------
            */

            'publish_online_store' =>
                (bool)
                $this->publish_online_store,

            'publish_point_of_sale' =>
                (bool)
                $this->publish_point_of_sale,

            /*
            |--------------------------------------------------------------------------
            | Collection Configuration
            |--------------------------------------------------------------------------
            */

            'kind' =>
                $this->kind,

            'collection_type' =>
                $this->collection_type,

            'automation_match_type' =>
                $this->automation_match_type,

            'automation_conditions' =>
                $this->automation_conditions,

            /*
            |--------------------------------------------------------------------------
            | Sorting & Display
            |--------------------------------------------------------------------------
            */

            'sort_order' =>
                $this->sort_order,

            'display_position' =>
                (int)
                $this->display_position,

            /*
            |--------------------------------------------------------------------------
            | SEO
            |--------------------------------------------------------------------------
            */

            'seo_title' =>
                $this->seo_title,

            'seo_description' =>
                $this->seo_description,

            /*
            |--------------------------------------------------------------------------
            | Creator
            |--------------------------------------------------------------------------
            */

            'creator' =>
                $this->whenLoaded(
                    'creator',
                    function () {
                        if (!$this->creator) {
                            return null;
                        }

                        return [
                            'id' =>
                                $this->creator->id,

                            'name' =>
                                $this->creator->name,

                            'email' =>
                                $this->creator->email,
                        ];
                    }
                ),

            /*
            |--------------------------------------------------------------------------
            | Timestamps
            |--------------------------------------------------------------------------
            */

            'created_at' =>
                $this->created_at?->toISOString(),

            'updated_at' =>
                $this->updated_at?->toISOString(),
        ];
    }
}
