<?php

namespace App\Services\Admin;

use App\Models\HomepageSlider;
use App\Repositories\Admin\HomepageSliderRepositoryInterface;
use App\Traits\HandlesImageUploads;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\ValidationException;

class HomepageSliderService
{
    use HandlesImageUploads;

    public function __construct(
        protected HomepageSliderRepositoryInterface $homepageSliderRepository
    ) {
    }

    public function getAll(): Collection
    {
        return $this->homepageSliderRepository
            ->getAll();
    }

    public function getById(
        int $id
    ): HomepageSlider {
        return $this->homepageSliderRepository
            ->findOrFail($id);
    }

    public function create(
        array $data
    ): HomepageSlider {
        return $this->homepageSliderRepository
            ->create($data);
    }

    public function update(
        int $id,
        array $data
    ): HomepageSlider {
        $slider =
            $this->homepageSliderRepository
                ->findOrFail($id);

        return $this->homepageSliderRepository
            ->update(
                $slider,
                $data
            );
    }

    public function delete(
        int $id
    ): void {
        $slider =
            $this->homepageSliderRepository
                ->findOrFail($id);

        if ($slider->image_path) {
            $this->deleteImage(
                $slider->image_path
            );
        }

        $this->homepageSliderRepository
            ->delete($slider);
    }

    public function uploadSliderImage(
        UploadedFile $image,
        ?string $title = null
    ): array {
        $path =
            $this->uploadImage(
                $image,
                'uploads/homepage-sliders',
                null,
                $title ?: 'homepage-slider'
            );

        return [
            'file_path' => $path,
            'url' => $this->getImageUrl($path),
        ];
    }

    public function deleteSliderImage(
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
                'uploads/homepage-sliders/'
            )
        ) {
            throw ValidationException::withMessages([
                'path' => [
                    'Invalid homepage slider image path.',
                ],
            ]);
        }

        $this->deleteImage(
            $normalizedPath
        );
    }
}