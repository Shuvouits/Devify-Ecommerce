<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LocationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' =>
                $this->id,

            'name' =>
                $this->name,

            'address' =>
                $this->address,

            'can_collect' =>
                (bool) $this->can_collect,

            'ships_online_orders' =>
                (bool) $this->ships_online_orders,

            'sells_over_counter' =>
                (bool) $this->sells_over_counter,

            'receives_returns' =>
                (bool) $this->receives_returns,

            'is_default' =>
                (bool) $this->is_default,

            'status' =>
                $this->status,

            'delivery_order' =>
                $this->delivery_order,

            /*
            |--------------------------------------------------------------------------
            | Frontend-Friendly Service Labels
            |--------------------------------------------------------------------------
            */

            'services' =>
                collect([
                    $this->can_collect
                        ? 'Collection'
                        : null,

                    $this->ships_online_orders
                        ? 'Fulfillment'
                        : null,

                    $this->sells_over_counter
                        ? 'In-person sales'
                        : null,

                    $this->receives_returns
                        ? 'Returns'
                        : null,
                ])
                    ->filter()
                    ->values()
                    ->all(),

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
