<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

trait HandlesImageUploads
{
    /*
    |--------------------------------------------------------------------------
    | Upload Image To Public Folder
    |--------------------------------------------------------------------------
    */

    protected function uploadImage(
        UploadedFile $file,
        string $directory,
        ?string $oldPath = null,
        ?string $prefix = null
    ): string {
        /*
        |--------------------------------------------------------------------------
        | Delete Previous Image
        |--------------------------------------------------------------------------
        */

        if ($oldPath) {
            $this->deleteImage(
                $oldPath
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Normalize Directory
        |--------------------------------------------------------------------------
        */

        $directory =
            trim(
                $directory,
                '/'
            );


        /*
        |--------------------------------------------------------------------------
        | Create Directory If Missing
        |--------------------------------------------------------------------------
        */

        $targetDirectory =
            public_path(
                $directory
            );


        File::ensureDirectoryExists(
            $targetDirectory,
            0755,
            true
        );


        /*
        |--------------------------------------------------------------------------
        | Resolve Extension
        |--------------------------------------------------------------------------
        */

        $extension =
            strtolower(
                $file->extension()
            );


        /*
        |--------------------------------------------------------------------------
        | Generate Unique File Name
        |--------------------------------------------------------------------------
        */

        $fileName =
            (
                $prefix
                    ? Str::slug(
                        $prefix
                    ) . '-'
                    : ''
            )
            . Str::uuid()
            . '.'
            . $extension;


        /*
        |--------------------------------------------------------------------------
        | Move Image To Public Directory
        |--------------------------------------------------------------------------
        */

        $file->move(
            $targetDirectory,
            $fileName
        );


        /*
        |--------------------------------------------------------------------------
        | Return Relative Public Path
        |--------------------------------------------------------------------------
        */

        return $directory
            . '/'
            . $fileName;
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Image From Public Folder
    |--------------------------------------------------------------------------
    */

    protected function deleteImage(
        ?string $path
    ): void {
        if (! $path) {
            return;
        }


        $fullPath =
            public_path(
                ltrim(
                    $path,
                    '/'
                )
            );


        if (
            File::exists(
                $fullPath
            )
        ) {
            File::delete(
                $fullPath
            );
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Get Public Image URL
    |--------------------------------------------------------------------------
    */

    protected function getImageUrl(
        ?string $path
    ): ?string {
        if (! $path) {
            return null;
        }


        return asset(
            ltrim(
                $path,
                '/'
            )
        );
    }
}
