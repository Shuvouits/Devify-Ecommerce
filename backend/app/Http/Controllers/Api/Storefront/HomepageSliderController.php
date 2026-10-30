<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Services\Storefront\HomepageSliderService;
use Illuminate\Http\JsonResponse;

class HomepageSliderController extends Controller
{
    public function __construct(
        protected HomepageSliderService $homepageSliderService
    ) {
    }

    /*
    |--------------------------------------------------------------------------
    | Public Homepage Sliders
    |--------------------------------------------------------------------------
    */

    public function index(): JsonResponse
    {
        $sliders =
            $this->homepageSliderService
                ->getActiveSliders();

        return response()->json([
            'success' => true,
            'data' => $sliders,
        ]);
    }
}