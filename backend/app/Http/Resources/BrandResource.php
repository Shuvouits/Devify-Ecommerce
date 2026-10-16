<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BrandResource extends JsonResource
{
    public function toArray(
        Request $request
    ): array {
        return [
            'id' =>
                $this->id,

            'name' =>
                $this->name,

            'slug' =>
                $this->slug,

            'description' =>
                $this->description,

            'website' =>
                $this->website,

            'logo_path' =>
                $this->logo_path,

            'logo_url' =>
                $this->logo_path
                    ? asset(
                        ltrim(
                            $this->logo_path,
                            '/'
                        )
                    )
                    : null,

            'status' =>
                $this->status,

            'is_featured' =>
                $this->is_featured,

            'display_order' =>
                $this->display_order,

            'source' =>
                $this->source,

            'approval_status' =>
                $this->approval_status,

            'rejection_reason' =>
                $this->rejection_reason,

            'seo' => [
                'title' =>
                    $this->seo_title,

                'description' =>
                    $this->seo_description,

                'slug' =>
                    $this->slug,
            ],

            /*
            |--------------------------------------------------------------------------
            | Product Module Relation Comes Later
            |--------------------------------------------------------------------------
            */

            'products_count' =>
                0,

            'archived_at' =>
                $this->archived_at,

            'created_at' =>
                $this->created_at,

            'updated_at' =>
                $this->updated_at,
        ];
    }
}
