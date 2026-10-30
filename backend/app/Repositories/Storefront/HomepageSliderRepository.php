<?php

namespace App\Repositories\Storefront;

use App\Models\HomepageSlider;
use Illuminate\Database\Eloquent\Collection;

class HomepageSliderRepository implements HomepageSliderRepositoryInterface
{
    /*
    |--------------------------------------------------------------------------
    | Get Active Homepage Sliders
    |--------------------------------------------------------------------------
    */

    public function getActiveSliders(): Collection
    {
        return HomepageSlider::query()
            ->where('is_active', true)
            ->orderBy('display_order')
            ->orderBy('id')
            ->get();
    }
}