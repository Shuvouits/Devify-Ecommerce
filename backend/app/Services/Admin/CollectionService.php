<?php

namespace App\Services\Admin;

use App\Models\Collection;
use App\Repositories\Admin\CollectionRepositoryInterface;
use App\Traits\HandlesImageUploads;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection as SupportCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

use Illuminate\Http\UploadedFile;



class CollectionService
{

use HandlesImageUploads;
    public function __construct(
        protected CollectionRepositoryInterface $collectionRepository
    ) {
    }


    /*
    |--------------------------------------------------------------------------
    | Collection List
    |--------------------------------------------------------------------------
    */

    public function getCollections(
        array $filters = []
    ): LengthAwarePaginator {
        return $this->collectionRepository
            ->paginate($filters);
    }


    /*
    |--------------------------------------------------------------------------
    | Ordered Collection List
    |--------------------------------------------------------------------------
    */

    public function getOrderedCollections(): SupportCollection
    {
        return $this->collectionRepository
            ->getAllOrdered();
    }


    /*
    |--------------------------------------------------------------------------
    | Single Collection
    |--------------------------------------------------------------------------
    */

    public function getCollection(
        int $id
    ): Collection {
        return $this->collectionRepository
            ->findOrFail($id);
    }


    /*
    |--------------------------------------------------------------------------
    | Stats
    |--------------------------------------------------------------------------
    */

    public function getStats(): array
    {
        return [
            'total' =>
                $this->collectionRepository
                    ->countAll(),

            'active' =>
                $this->collectionRepository
                    ->countByStatus(
                        'active'
                    ),

            'draft' =>
                $this->collectionRepository
                    ->countByStatus(
                        'draft'
                    ),
        ];
    }


   public function createCollection(
    array $data,
    ?int $userId = null
): Collection {
    return DB::transaction(
        function () use (
            $data,
            $userId
        ) {
            $collectionType =
                $data['collection_type'] ??
                'manual';

            $this->validateAutomation(
                $collectionType,
                $data
            );

            $collection =
                $this->collectionRepository
                    ->create([
                        'title' =>
                            $data['title'],

                        'slug' =>
                            $this->generateUniqueSlug(
                                $data['slug'] ??
                                $data['title']
                            ),

                        'description' =>
                            $data['description'] ??
                            null,

                        'image_path' =>
                            $data['image_path'] ??
                            null,

                        'status' =>
                            $data['status'] ??
                            'draft',

                        'publish_online_store' =>
                            $data['publish_online_store'] ??
                            true,

                        'publish_point_of_sale' =>
                            $data['publish_point_of_sale'] ??
                            false,

                        'kind' =>
                            $data['kind'] ??
                            'collection',

                        'collection_type' =>
                            $collectionType,

                        'automation_match_type' =>
                            $collectionType === 'automated'
                                ? (
                                    $data['automation_match_type'] ??
                                    'all'
                                )
                                : null,

                        'automation_conditions' =>
                            $collectionType === 'automated'
                                ? (
                                    $data['automation_conditions'] ??
                                    []
                                )
                                : null,

                        'sort_order' =>
                            $data['sort_order'] ??
                            'manual',

                        'display_position' =>
                            $data['display_position'] ??
                            (
                                $this->collectionRepository
                                    ->getMaxDisplayPosition() + 1
                            ),

                        'seo_title' =>
                            $data['seo_title'] ??
                            null,

                        'seo_description' =>
                            $data['seo_description'] ??
                            null,

                        'created_by' =>
                            $userId,
                    ]);

            /*
            |--------------------------------------------------------------------------
            | Products
            |--------------------------------------------------------------------------
            */

            if (
                $collectionType === 'manual' &&
                array_key_exists(
                    'product_ids',
                    $data
                )
            ) {
                $this->collectionRepository
                    ->syncProducts(
                        $collection,
                        $data['product_ids'] ?? []
                    );
            }

            return $collection->fresh([
                'creator:id,name,email',
                'products',
            ]);
        }
    );
}

   public function updateCollection(
    int $id,
    array $data
): Collection {
    return DB::transaction(
        function () use (
            $id,
            $data
        ) {
            $collection =
                $this->getCollection($id);

            $collectionType =
                $data['collection_type'] ??
                $collection->collection_type;

            $this->validateAutomation(
                $collectionType,
                $data,
                $collection
            );

            $payload = [];

            /*
            |--------------------------------------------------------------------------
            | Title
            |--------------------------------------------------------------------------
            */

            if (
                array_key_exists(
                    'title',
                    $data
                )
            ) {
                $payload['title'] =
                    $data['title'];
            }

            /*
            |--------------------------------------------------------------------------
            | Slug
            |--------------------------------------------------------------------------
            */

            if (
                array_key_exists(
                    'slug',
                    $data
                )
            ) {
                $slugSource =
                    trim(
                        (string)
                        $data['slug']
                    );

                if ($slugSource === '') {
                    $slugSource =
                        $data['title'] ??
                        $collection->title;
                }

                $payload['slug'] =
                    $this->generateUniqueSlug(
                        $slugSource,
                        $collection->id
                    );
            } elseif (
                array_key_exists(
                    'title',
                    $data
                ) &&
                $data['title'] !==
                $collection->title
            ) {
                $payload['slug'] =
                    $this->generateUniqueSlug(
                        $data['title'],
                        $collection->id
                    );
            }

            /*
            |--------------------------------------------------------------------------
            | Standard Fields
            |--------------------------------------------------------------------------
            */

            $simpleFields = [
                'description',
                'image_path',
                'status',
                'publish_online_store',
                'publish_point_of_sale',
                'kind',
                'sort_order',
                'display_position',
                'seo_title',
                'seo_description',
            ];

            foreach (
                $simpleFields as $field
            ) {
                if (
                    array_key_exists(
                        $field,
                        $data
                    )
                ) {
                    $payload[$field] =
                        $data[$field];
                }
            }

            /*
            |--------------------------------------------------------------------------
            | Collection Type
            |--------------------------------------------------------------------------
            */

            if (
                array_key_exists(
                    'collection_type',
                    $data
                )
            ) {
                $payload['collection_type'] =
                    $collectionType;
            }

            /*
            |--------------------------------------------------------------------------
            | Automation
            |--------------------------------------------------------------------------
            */

            if (
                $collectionType ===
                'automated'
            ) {
                $payload['automation_match_type'] =
                    $data['automation_match_type'] ??
                    $collection->automation_match_type ??
                    'all';

                if (
                    array_key_exists(
                        'automation_conditions',
                        $data
                    )
                ) {
                    $payload['automation_conditions'] =
                        $data['automation_conditions'];
                }
            } else {
                $payload['automation_match_type'] =
                    null;

                $payload['automation_conditions'] =
                    null;
            }

            /*
            |--------------------------------------------------------------------------
            | Update Collection
            |--------------------------------------------------------------------------
            */

            if (!empty($payload)) {
                $collection =
                    $this->collectionRepository
                        ->update(
                            $collection,
                            $payload
                        );
            }

            /*
            |--------------------------------------------------------------------------
            | Products
            |--------------------------------------------------------------------------
            */

            if (
                $collectionType ===
                'manual'
            ) {
                if (
                    array_key_exists(
                        'product_ids',
                        $data
                    )
                ) {
                    $this->collectionRepository
                        ->syncProducts(
                            $collection,
                            $data['product_ids'] ?? []
                        );
                }
            } else {
                $this->collectionRepository
                    ->syncProducts(
                        $collection,
                        []
                    );
            }

            return $collection->fresh([
                'creator:id,name,email',
                'products',
            ]);
        }
    );
}


    /*
    |--------------------------------------------------------------------------
    | Delete Collection
    |--------------------------------------------------------------------------
    */

    public function deleteCollection(
        int $id
    ): bool {
        $collection =
            $this->getCollection($id);

        return $this->collectionRepository
            ->delete($collection);
    }



        /*
    |--------------------------------------------------------------------------
    | Upload Collection Image
    |--------------------------------------------------------------------------
    */

    public function uploadCollectionImage(
        UploadedFile $image,
        ?string $collectionTitle = null
    ): array {
        $path =
            $this->uploadImage(
                $image,
                'uploads/collections',
                null,
                $collectionTitle ??
                'collection'
            );

        return [
            'file_path' =>
                $path,

            'url' =>
                $this->getImageUrl(
                    $path
                ),
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Collection Image
    |--------------------------------------------------------------------------
    */

    public function deleteCollectionImage(
        string $path
    ): void {
        $normalizedPath =
            ltrim(
                trim($path),
                '/'
            );

        if (
            !str_starts_with(
                $normalizedPath,
                'uploads/collections/'
            )
        ) {
            throw ValidationException::withMessages([
                'path' => [
                    'Invalid collection image path.',
                ],
            ]);
        }

        $this->deleteImage(
            $normalizedPath
        );
    }





    /*
    |--------------------------------------------------------------------------
    | Automated Collection Validation
    |--------------------------------------------------------------------------
    */

    private function validateAutomation(
        string $collectionType,
        array $data,
        ?Collection $collection = null
    ): void {
        if (
            $collectionType !==
            'automated'
        ) {
            return;
        }

        $conditions =
            $data['automation_conditions'] ??
            $collection?->automation_conditions ??
            [];

        if (
            !is_array($conditions) ||
            count($conditions) === 0
        ) {
            throw ValidationException::withMessages([
                'automation_conditions' => [
                    'Automated collections require at least one condition.',
                ],
            ]);
        }

        foreach (
            $conditions as $index => $condition
        ) {
            $field =
                trim(
                    (string) (
                        $condition['field'] ??
                        ''
                    )
                );

            $operator =
                trim(
                    (string) (
                        $condition['operator'] ??
                        ''
                    )
                );

            if (
                $field === '' ||
                $operator === ''
            ) {
                throw ValidationException::withMessages([
                    "automation_conditions.{$index}" => [
                        'Each automated condition requires a field and operator.',
                    ],
                ]);
            }
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Unique Slug
    |--------------------------------------------------------------------------
    */

    private function generateUniqueSlug(
        string $value,
        ?int $ignoreId = null
    ): string {
        $baseSlug =
            Str::slug($value);

        if ($baseSlug === '') {
            $baseSlug =
                'collection';
        }

        $slug =
            $baseSlug;

        $counter = 2;

        while (
            Collection::query()
                ->when(
                    $ignoreId,
                    fn ($query) =>
                        $query->where(
                            'id',
                            '!=',
                            $ignoreId
                        )
                )
                ->where(
                    'slug',
                    $slug
                )
                ->exists()
        ) {
            $slug =
                $baseSlug .
                '-' .
                $counter;

            $counter++;
        }

        return $slug;
    }
}
