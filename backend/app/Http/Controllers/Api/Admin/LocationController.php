<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\Location\StoreLocationRequest;
use App\Http\Requests\Api\Admin\Location\UpdateDefaultLocationRequest;
use App\Http\Requests\Api\Admin\Location\UpdateLocationOrderRequest;
use App\Http\Requests\Api\Admin\Location\UpdateLocationRequest;
use App\Http\Resources\LocationResource;
use App\Services\Admin\LocationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class LocationController extends Controller
{
    public function __construct(
        protected LocationService $locationService
    ) {
    }


    /*
    |--------------------------------------------------------------------------
    | Location List
    |--------------------------------------------------------------------------
    */

    public function index(
        Request $request
    ): AnonymousResourceCollection {
        $locations =
            $this->locationService
                ->getLocations(
                    $request->only([
                        'search',
                        'filter',
                        'status',
                        'can_collect',
                        'ships_online_orders',
                        'sells_over_counter',
                        'receives_returns',
                        'sort_by',
                        'sort_direction',
                        'per_page',
                    ])
                );

        $stats =
            $this->locationService
                ->getLocationStats();

        return LocationResource::collection(
            $locations
        )->additional([
            'stats' =>
                $stats,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Create Location
    |--------------------------------------------------------------------------
    */

    public function store(
        StoreLocationRequest $request
    ): JsonResponse {
        $location =
            $this->locationService
                ->createLocation(
                    $request->validated(),
                    auth('api')->id()
                );

        return response()->json([
            'message' =>
                'Location created successfully.',

            'data' =>
                new LocationResource(
                    $location
                ),
        ], 201);
    }


    /*
    |--------------------------------------------------------------------------
    | Show Location
    |--------------------------------------------------------------------------
    */

    public function show(
        int $id
    ): LocationResource {
        $location =
            $this->locationService
                ->getLocation(
                    $id
                );

        return new LocationResource(
            $location
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Update Location
    |--------------------------------------------------------------------------
    */

    public function update(
        UpdateLocationRequest $request,
        int $id
    ): JsonResponse {
        $location =
            $this->locationService
                ->updateLocation(
                    $id,
                    $request->validated()
                );

        return response()->json([
            'message' =>
                'Location updated successfully.',

            'data' =>
                new LocationResource(
                    $location
                ),
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Location
    |--------------------------------------------------------------------------
    */

    public function destroy(
        int $id
    ): JsonResponse {
        $this->locationService
            ->deleteLocation(
                $id
            );

        return response()->json([
            'message' =>
                'Location deleted successfully.',
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Set Default Location
    |--------------------------------------------------------------------------
    */

    public function setDefault(
        UpdateDefaultLocationRequest $request
    ): JsonResponse {
        $location =
            $this->locationService
                ->setDefaultLocation(
                    (int) $request->validated(
                        'location_id'
                    )
                );

        return response()->json([
            'message' =>
                'Default location updated successfully.',

            'data' =>
                new LocationResource(
                    $location
                ),
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Delivery Order Locations
    |--------------------------------------------------------------------------
    */

    public function deliveryOrder(): AnonymousResourceCollection
    {
        $locations =
            $this->locationService
                ->getDeliveryOrderLocations();

        return LocationResource::collection(
            $locations
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Update Delivery Order
    |--------------------------------------------------------------------------
    */

    public function updateDeliveryOrder(
        UpdateLocationOrderRequest $request
    ): JsonResponse {
        $locations =
            $this->locationService
                ->reorderLocations(
                    $request->validated(
                        'locations'
                    )
                );

        return response()->json([
            'message' =>
                'Delivery order updated successfully.',

            'data' =>
                LocationResource::collection(
                    $locations
                ),
        ]);
    }
}
