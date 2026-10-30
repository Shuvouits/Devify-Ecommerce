<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Resources\CollectionResource;
use App\Services\Storefront\CollectionService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CollectionController extends Controller
{
    public function __construct(
        protected CollectionService $collectionService
    ) {
    }

    /*
    |--------------------------------------------------------------------------
    | Public Collection List
    |--------------------------------------------------------------------------
    */

    public function index(): AnonymousResourceCollection
    {
        $collections =
            $this->collectionService
                ->getPublishedCollections();

        return CollectionResource::collection(
            $collections
        );
    }
}
