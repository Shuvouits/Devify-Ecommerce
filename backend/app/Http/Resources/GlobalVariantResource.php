<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GlobalVariantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' =>
                $this->id,

            'name' =>
                $this->name,

            'slug' =>
                $this->slug,

            'visual_type' =>
                $this->visual_type,

            'display_order' =>
                $this->display_order,

            'is_active' =>
                (bool) $this->is_active,

            /*
            |--------------------------------------------------------------------------
            | Options
            |--------------------------------------------------------------------------
            */

            'options' =>
                $this->whenLoaded(
                    'options',
                    fn () =>
                        $this->options
                            ->map(
                                fn ($option) => [
                                    'id' =>
                                        $option->id,

                                    'value' =>
                                        $option->value,

                                    'color_hex' =>
                                        $option->color_hex,

                                    'display_order' =>
                                        $option->display_order,

                                    'is_active' =>
                                        (bool) $option->is_active,
                                ]
                            )
                            ->values()
                            ->all()
                ),

            /*
            |--------------------------------------------------------------------------
            | Frontend Helper
            |--------------------------------------------------------------------------
            */

            'option_count' =>
                $this->whenLoaded(
                    'options',
                    fn () =>
                        $this->options->count()
                ),

            /*
            |--------------------------------------------------------------------------
            | Creator
            |--------------------------------------------------------------------------
            */

            'creator' =>
                $this->whenLoaded(
                    'creator',
                    fn () => [
                        'id' =>
                            $this->creator?->id,

                        'name' =>
                            $this->creator?->name,

                        'email' =>
                            $this->creator?->email,
                    ]
                ),

            'created_at' =>
                $this->created_at?->toISOString(),

            'updated_at' =>
                $this->updated_at?->toISOString(),
        ];
    }
}
