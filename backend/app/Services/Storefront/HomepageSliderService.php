<?php

namespace App\Services\Storefront;

use App\Repositories\Storefront\HomepageSliderRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class HomepageSliderService
{
    public function __construct(
        protected HomepageSliderRepositoryInterface $homepageSliderRepository
    ) {
    }

    /*
    |--------------------------------------------------------------------------
    | Get Active Homepage Sliders
    |--------------------------------------------------------------------------
    */

    public function getActiveSliders(): Collection
    {
        return $this->homepageSliderRepository
            ->getActiveSliders();
    }
}
