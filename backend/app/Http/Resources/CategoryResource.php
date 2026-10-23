<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
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


            'parent_id' =>
                $this->parent_id,

            'parent' =>
                $this->whenLoaded(
                    'parent',
                    fn () => $this->parent
                        ? [
                            'id' =>
                                $this->parent->id,

                            'name' =>
                                $this->parent->name,

                            'parent_id' =>
                                $this->parent->parent_id,
                        ]
                        : null
                ),


            'level' =>
                $this->getDepth(),


            'status' =>
                $this->status,

            'is_featured' =>
                (bool) $this->is_featured,

            'display_order' =>
                (int) $this->display_order,


            'tax_class' =>
                $this->tax_class,

            'inherits_tax' =>
                blank(
                    $this->tax_class
                ),


            'image_url' =>
                $this->image_url,

            'icon_url' =>
                $this->icon_url,


            'seo' => [
                'title' =>
                    $this->seo_title,

                'description' =>
                    $this->seo_description,

                'slug' =>
                    $this->slug,
            ],


            'tags' =>
                $this->tags ?? [],


            'is_archived' =>
                $this->archived_at !== null,

            'archived_at' =>
                $this->archived_at?->toISOString(),


            /*
             * Product relationship will be
             * connected when product-category
             * assignment is implemented.
             */
            'products_count' =>
                0,


            'created_at' =>
                $this->created_at?->toISOString(),

            'updated_at' =>
                $this->updated_at?->toISOString(),
        ];
    }
}
