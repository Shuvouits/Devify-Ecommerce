<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();

            /*
            |--------------------------------------------------------------------------
            | Basic Information
            |--------------------------------------------------------------------------
            */

            $table->string('name', 150);

            $table->string('slug', 180)
                ->unique();

            $table->text('description')
                ->nullable();


            /*
            |--------------------------------------------------------------------------
            | Hierarchy
            |--------------------------------------------------------------------------
            */

            $table->foreignId('parent_id')
                ->nullable()
                ->constrained('categories')
                ->nullOnDelete()
                ->index();


            /*
            |--------------------------------------------------------------------------
            | Publishing
            |--------------------------------------------------------------------------
            */

            $table->string('status', 30)
                ->default('active')
                ->index();

            $table->boolean('is_featured')
                ->default(false)
                ->index();

            $table->integer('display_order')
                ->default(0)
                ->index();


            /*
            |--------------------------------------------------------------------------
            | Tax
            |--------------------------------------------------------------------------
            |
            | NULL means inherit the tax configuration
            | from the parent category/global settings.
            |
            */

            $table->string('tax_class', 100)
                ->nullable();


            /*
            |--------------------------------------------------------------------------
            | Media
            |--------------------------------------------------------------------------
            */

            $table->string('image_path', 500)
                ->nullable();

            $table->string('icon_path', 500)
                ->nullable();


            /*
            |--------------------------------------------------------------------------
            | SEO
            |--------------------------------------------------------------------------
            */

            $table->string('seo_title', 70)
                ->nullable();

            $table->string('seo_description', 160)
                ->nullable();

            $table->json('tags')
                ->nullable();


            /*
            |--------------------------------------------------------------------------
            | Archive
            |--------------------------------------------------------------------------
            */

            $table->timestamp('archived_at')
                ->nullable()
                ->index();


            /*
            |--------------------------------------------------------------------------
            | Audit
            |--------------------------------------------------------------------------
            */

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();


            $table->timestamps();
            $table->softDeletes();


            /*
            |--------------------------------------------------------------------------
            | Useful Indexes
            |--------------------------------------------------------------------------
            */

            $table->index([
                'parent_id',
                'status',
            ]);

            $table->index([
                'status',
                'display_order',
            ]);
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
