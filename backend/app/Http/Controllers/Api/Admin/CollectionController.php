<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\Collection\StoreCollectionRequest;
use App\Http\Requests\Api\Admin\Collection\UpdateCollectionRequest;
use App\Http\Resources\CollectionResource;
use App\Services\Admin\CollectionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

use App\Http\Requests\Api\Admin\Collection\UploadCollectionImageRequest;
use App\Http\Requests\Api\Admin\Collection\DeleteCollectionImageRequest;

class CollectionController extends Controller
{
    public function __construct(
        protected CollectionService $collectionService
    ) {
    }


    /*
    |--------------------------------------------------------------------------
    | Collection List
    |--------------------------------------------------------------------------
    */

    public function index(
        Request $request
    ): AnonymousResourceCollection {
        $collections =
            $this->collectionService
                ->getCollections(
                    $request->only([
                        'search',
                        'status',
                        'kind',
                        'collection_type',
                        'publish_online_store',
                        'publish_point_of_sale',
                        'sort_by',
                        'sort_direction',
                        'per_page',
                    ])
                );

        $stats =
            $this->collectionService
                ->getStats();

        return CollectionResource::collection(
            $collections
        )->additional([
            'stats' => $stats,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Ordered Collection List
    |--------------------------------------------------------------------------
    */

    public function ordered(): AnonymousResourceCollection
    {
        $collections =
            $this->collectionService
                ->getOrderedCollections();

        return CollectionResource::collection(
            $collections
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Create Collection
    |--------------------------------------------------------------------------
    */

    public function store(
        StoreCollectionRequest $request
    ): JsonResponse {
        $collection =
            $this->collectionService
                ->createCollection(
                    $request->validated(),
                    auth('api')->id()
                );

        return response()->json([
            'message' =>
                'Collection created successfully.',

            'data' =>
                new CollectionResource(
                    $collection
                ),
        ], 201);
    }


    /*
    |--------------------------------------------------------------------------
    | Show Collection
    |--------------------------------------------------------------------------
    */

    public function show(
        int $id
    ): CollectionResource {
        $collection =
            $this->collectionService
                ->getCollection($id);

        return new CollectionResource(
            $collection
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Update Collection
    |--------------------------------------------------------------------------
    */

    public function update(
        UpdateCollectionRequest $request,
        int $id
    ): JsonResponse {
        $collection =
            $this->collectionService
                ->updateCollection(
                    $id,
                    $request->validated()
                );

        return response()->json([
            'message' =>
                'Collection updated successfully.',

            'data' =>
                new CollectionResource(
                    $collection
                ),
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Collection
    |--------------------------------------------------------------------------
    */

    public function destroy(
        int $id
    ): JsonResponse {
        $this->collectionService
            ->deleteCollection($id);

        return response()->json([
            'message' =>
                'Collection deleted successfully.',
        ]);
    }

        public function uploadImage(
        UploadCollectionImageRequest $request
    ): JsonResponse {
        $result =
            $this->collectionService
                ->uploadCollectionImage(
                    $request->file('image'),
                    $request->input('collection_title')
                );

        return response()->json([
            'success' => true,

            'message' =>
                'Collection image uploaded successfully.',

            'data' =>
                $result,
        ]);
    }


    public function deleteImage(
        DeleteCollectionImageRequest $request
    ): JsonResponse {
        $this->collectionService
            ->deleteCollectionImage(
                $request->validated('path')
            );

        return response()->json([
            'success' => true,
            'message' =>
                'Collection image deleted successfully.',
        ]);
    }




}
