<?php

namespace App\Repositories\Storefront;

use Illuminate\Database\Eloquent\Collection;

interface HomepageSliderRepositoryInterface
{
    /*
    |--------------------------------------------------------------------------
    | Get Active Homepage Sliders
    |--------------------------------------------------------------------------
    */

    public function getActiveSliders(): Collection;
}