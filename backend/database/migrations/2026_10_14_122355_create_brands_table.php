<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('brands', function (Blueprint $table) {
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

            $table->string('website', 500)
                ->nullable();

            $table->string('logo_path', 500)
                ->nullable();


            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */

            $table->string('status', 30)
                ->default('active')
                ->index();

            $table->boolean('is_featured')
                ->default(false)
                ->index();

            $table->unsignedInteger('display_order')
                ->default(0)
                ->index();


            /*
            |--------------------------------------------------------------------------
            | Source & Approval
            |--------------------------------------------------------------------------
            */

            $table->string('source', 30)
                ->default('official')
                ->index();

            $table->string('approval_status', 30)
                ->default('approved')
                ->index();

            $table->foreignId('approved_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('approved_at')
                ->nullable();

            $table->text('rejection_reason')
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
            | Creator
            |--------------------------------------------------------------------------
            */

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();


            $table->timestamps();

            /*
            |--------------------------------------------------------------------------
            | Permanent Delete Safety
            |--------------------------------------------------------------------------
            */

            $table->softDeletes();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('brands');
    }
};
