<?php

namespace App\Services\Admin;

use App\Models\GlobalVariant;
use App\Repositories\Admin\GlobalVariantRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class GlobalVariantService
{
    public function __construct(
        protected GlobalVariantRepositoryInterface $globalVariantRepository
    ) {
    }


    /*
    |--------------------------------------------------------------------------
    | Variant List
    |--------------------------------------------------------------------------
    */

    public function getVariants(
        array $filters = []
    ): LengthAwarePaginator {
        return $this->globalVariantRepository
            ->paginate($filters);
    }


    /*
    |--------------------------------------------------------------------------
    | Ordered Variant List
    |--------------------------------------------------------------------------
    */

    public function getOrderedVariants(): Collection
    {
        return $this->globalVariantRepository
            ->getAllOrdered();
    }


    /*
    |--------------------------------------------------------------------------
    | Single Variant
    |--------------------------------------------------------------------------
    */

    public function getVariant(
        int $id
    ): GlobalVariant {
        return $this->globalVariantRepository
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
                $this->globalVariantRepository
                    ->countAll(),

            'active' =>
                $this->globalVariantRepository
                    ->countActive(),
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | Create Variant
    |--------------------------------------------------------------------------
    */

    public function createVariant(
        array $data,
        ?int $userId = null
    ): GlobalVariant {
        return DB::transaction(
            function () use (
                $data,
                $userId
            ) {
                $options =
                    $this->normalizeOptions(
                        $data['options'] ?? [],
                        $data['visual_type'] ?? 'rectangle'
                    );

                if (count($options) === 0) {
                    throw ValidationException::withMessages([
                        'options' => [
                            'At least one option value is required.',
                        ],
                    ]);
                }

                $slug =
                    $this->generateUniqueSlug(
                        $data['name']
                    );

                $variant =
                    $this->globalVariantRepository
                        ->create([
                            'name' =>
                                $data['name'],

                            'slug' =>
                                $slug,

                            'visual_type' =>
                                $data['visual_type'] ??
                                'rectangle',

                            'display_order' =>
                                $data['display_order'] ??
                                (
                                    $this->globalVariantRepository
                                        ->getMaxDisplayOrder() + 1
                                ),

                            'is_active' =>
                                $data['is_active'] ??
                                true,

                            'created_by' =>
                                $userId,
                        ]);

                return $this->globalVariantRepository
                    ->syncOptions(
                        $variant,
                        $options
                    );
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Update Variant
    |--------------------------------------------------------------------------
    */

    public function updateVariant(
        int $id,
        array $data
    ): GlobalVariant {
        return DB::transaction(
            function () use (
                $id,
                $data
            ) {
                $variant =
                    $this->getVariant($id);

                $visualType =
                    $data['visual_type'] ??
                    $variant->visual_type;

                $payload = [];

                if (
                    array_key_exists(
                        'name',
                        $data
                    )
                ) {
                    $payload['name'] =
                        $data['name'];

                    if (
                        $data['name'] !==
                        $variant->name
                    ) {
                        $payload['slug'] =
                            $this->generateUniqueSlug(
                                $data['name'],
                                $variant->id
                            );
                    }
                }

                if (
                    array_key_exists(
                        'visual_type',
                        $data
                    )
                ) {
                    $payload['visual_type'] =
                        $data['visual_type'];
                }

                if (
                    array_key_exists(
                        'display_order',
                        $data
                    )
                ) {
                    $payload['display_order'] =
                        $data['display_order'];
                }

                if (
                    array_key_exists(
                        'is_active',
                        $data
                    )
                ) {
                    $payload['is_active'] =
                        $data['is_active'];
                }

                if (!empty($payload)) {
                    $variant =
                        $this->globalVariantRepository
                            ->update(
                                $variant,
                                $payload
                            );
                }

                if (
                    array_key_exists(
                        'options',
                        $data
                    )
                ) {
                    $options =
                        $this->normalizeOptions(
                            $data['options'],
                            $visualType
                        );

                    if (count($options) === 0) {
                        throw ValidationException::withMessages([
                            'options' => [
                                'At least one option value is required.',
                            ],
                        ]);
                    }

                    $variant =
                        $this->globalVariantRepository
                            ->syncOptions(
                                $variant,
                                $options
                            );
                }

                return $variant->fresh([
                    'options',
                    'creator:id,name,email',
                ]);
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Variant
    |--------------------------------------------------------------------------
    */

    public function deleteVariant(
        int $id
    ): bool {
        $variant =
            $this->getVariant($id);

        return $this->globalVariantRepository
            ->delete($variant);
    }


    /*
    |--------------------------------------------------------------------------
    | Normalize Options
    |--------------------------------------------------------------------------
    */

     private function normalizeOptions(
    array $options,
    string $visualType
): array {
    $normalized = [];
    $seenValues = [];

    foreach ($options as $index => $option) {
        $value = trim(
            (string) (
                $option['value'] ??
                ''
            )
        );

        if ($value === '') {
            continue;
        }

        $normalizedKey = mb_strtolower(
            $value
        );

        if (
            in_array(
                $normalizedKey,
                $seenValues,
                true
            )
        ) {
            throw ValidationException::withMessages([
                'options' => [
                    "Duplicate option value: {$value}",
                ],
            ]);
        }

        $seenValues[] = $normalizedKey;

        $colorHex = null;

        if ($visualType === 'color') {
            $colorHex = $this->normalizeColorHex(
                $option['color_hex'] ??
                null
            );
        }

        $normalized[] = [
            'id' =>
                isset($option['id'])
                    ? (int) $option['id']
                    : null,

            'value' =>
                $value,

            'color_hex' =>
                $colorHex,

            'display_order' =>
                $option['display_order'] ??
                $index + 1,

            'is_active' =>
                $option['is_active'] ??
                true,
        ];
    }

    return $normalized;
}


    /*
    |--------------------------------------------------------------------------
    | Normalize Color Hex
    |--------------------------------------------------------------------------
    */

    private function normalizeColorHex(
        ?string $colorHex
    ): ?string {
        if (
            $colorHex === null ||
            trim($colorHex) === ''
        ) {
            return null;
        }

        $colorHex =
            trim($colorHex);

        if (
            !str_starts_with(
                $colorHex,
                '#'
            )
        ) {
            $colorHex =
                '#' . $colorHex;
        }

        if (
            !preg_match(
                '/^#[0-9A-Fa-f]{6}$/',
                $colorHex
            )
        ) {
            throw ValidationException::withMessages([
                'options' => [
                    'Color values must use a valid 6-digit hex code.',
                ],
            ]);
        }

        return strtoupper(
            $colorHex
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Unique Slug
    |--------------------------------------------------------------------------
    */

    private function generateUniqueSlug(
        string $name,
        ?int $ignoreId = null
    ): string {
        $baseSlug =
            Str::slug($name);

        if ($baseSlug === '') {
            $baseSlug =
                'variant';
        }

        $slug =
            $baseSlug;

        $counter = 2;

        while (
            GlobalVariant::query()
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
