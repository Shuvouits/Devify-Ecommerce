<?php

namespace App\Services\Brand;

use App\Models\Brand;
use App\Repositories\Brand\BrandRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class BrandService
{
    public function __construct(
        protected BrandRepositoryInterface $repository
    ) {
    }


    /*
    |--------------------------------------------------------------------------
    | List
    |--------------------------------------------------------------------------
    */

    public function getBrands(
        array $filters
    ): LengthAwarePaginator {
        return $this->repository
            ->paginate($filters);
    }


    /*
    |--------------------------------------------------------------------------
    | Show
    |--------------------------------------------------------------------------
    */

    public function getBrand(
        int $id
    ): Brand {
        return $this->repository
            ->findById($id);
    }


    /*
    |--------------------------------------------------------------------------
    | Create
    |--------------------------------------------------------------------------
    */

    public function createBrand(
        array $data
    ): Brand {
        $data['slug'] =
            $this->generateUniqueSlug(
                $data['slug']
                    ?? $data['name']
            );


        $data['source'] =
            Brand::SOURCE_OFFICIAL;

        $data['approval_status'] =
            Brand::APPROVAL_APPROVED;

        $data['approved_by'] =
            auth('api')->id();

        $data['approved_at'] =
            now();

        $data['created_by'] =
            auth('api')->id();


        return $this->repository
            ->create($data);
    }


    /*
    |--------------------------------------------------------------------------
    | Update
    |--------------------------------------------------------------------------
    */

    public function updateBrand(
        int $id,
        array $data
    ): Brand {
        $brand =
            $this->repository
                ->findById($id);


        if (
            array_key_exists(
                'slug',
                $data
            )
        ) {
            $slugSource =
                filled(
                    $data['slug']
                )
                    ? $data['slug']
                    : $brand->name;


            $data['slug'] =
                $this->generateUniqueSlug(
                    $slugSource,
                    $brand->id
                );
        }


        return $this->repository
            ->update(
                $brand,
                $data
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Archive
    |--------------------------------------------------------------------------
    */

    public function archiveBrand(
        int $id
    ): Brand {
        $brand =
            $this->repository
                ->findById($id);


        if ($brand->isArchived()) {
            return $brand;
        }


        return $this->repository
            ->archive($brand);
    }


    /*
    |--------------------------------------------------------------------------
    | Restore
    |--------------------------------------------------------------------------
    */

    public function restoreBrand(
        int $id
    ): Brand {
        $brand =
            $this->repository
                ->findById($id);


        if (!$brand->isArchived()) {
            return $brand;
        }


        return $this->repository
            ->restore($brand);
    }


    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    public function deleteBrand(
        int $id
    ): void {
        $brand =
            $this->repository
                ->findById($id);


        $this->deleteLogoFile(
            $brand->logo_path
        );


        $this->repository
            ->delete($brand);
    }


    /*
    |--------------------------------------------------------------------------
    | Upload Logo
    |--------------------------------------------------------------------------
    */

    public function uploadLogo(
        int $id,
        UploadedFile $logo
    ): Brand {
        $brand =
            $this->repository
                ->findById($id);


        /*
        |--------------------------------------------------------------------------
        | Delete Previous Logo
        |--------------------------------------------------------------------------
        */

        $this->deleteLogoFile(
            $brand->logo_path
        );


        /*
        |--------------------------------------------------------------------------
        | Directory
        |--------------------------------------------------------------------------
        */

        $relativeDirectory =
            'uploads/brands/' .
            $brand->id;


        $absoluteDirectory =
            public_path(
                $relativeDirectory
            );


        if (
            !File::exists(
                $absoluteDirectory
            )
        ) {
            File::makeDirectory(
                $absoluteDirectory,
                0755,
                true
            );
        }


        /*
        |--------------------------------------------------------------------------
        | File Extension
        |--------------------------------------------------------------------------
        */

        $extension =
            strtolower(
                $logo->getClientOriginalExtension()
            );


        /*
        |--------------------------------------------------------------------------
        | File Name
        |--------------------------------------------------------------------------
        */

        $fileName =
            'brand-logo-' .
            now()->format(
                'YmdHis'
            ) .
            '-' .
            bin2hex(
                random_bytes(4)
            ) .
            '.' .
            $extension;


        /*
        |--------------------------------------------------------------------------
        | Move To Public Directory
        |--------------------------------------------------------------------------
        */

        $logo->move(
            $absoluteDirectory,
            $fileName
        );


        /*
        |--------------------------------------------------------------------------
        | Save Relative Path
        |--------------------------------------------------------------------------
        */

        $logoPath =
            $relativeDirectory .
            '/' .
            $fileName;


        return $this->repository
            ->update(
                $brand,
                [
                    'logo_path' =>
                        $logoPath,
                ]
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Logo
    |--------------------------------------------------------------------------
    */

    public function deleteLogo(
        int $id
    ): Brand {
        $brand =
            $this->repository
                ->findById($id);


        $this->deleteLogoFile(
            $brand->logo_path
        );


        return $this->repository
            ->update(
                $brand,
                [
                    'logo_path' =>
                        null,
                ]
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Physical Logo File
    |--------------------------------------------------------------------------
    */

    private function deleteLogoFile(
        ?string $logoPath
    ): void {
        if (blank($logoPath)) {
            return;
        }


        $absolutePath =
            public_path(
                ltrim(
                    $logoPath,
                    '/'
                )
            );


        if (
            File::exists(
                $absolutePath
            )
        ) {
            File::delete(
                $absolutePath
            );
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Generate Unique Slug
    |--------------------------------------------------------------------------
    */

    private function generateUniqueSlug(
        string $value,
        ?int $ignoreId = null
    ): string {
        $baseSlug =
            Str::slug($value);


        if (blank($baseSlug)) {
            $baseSlug =
                'brand';
        }


        $slug =
            $baseSlug;

        $counter =
            2;


        while (
            $this->repository
                ->slugExists(
                    $slug,
                    $ignoreId
                )
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
