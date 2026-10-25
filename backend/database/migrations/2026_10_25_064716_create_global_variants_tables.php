<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Global Variants
        |--------------------------------------------------------------------------
        */

        Schema::create('global_variants', function (Blueprint $table) {
            $table->id();

            $table->string('name', 120);

            $table->string('slug', 150)
                ->unique();

            /*
             * Examples:
             * rectangle
             * color
             *
             * String রাখা হয়েছে যাতে future-এ
             * image, button, radio ইত্যাদি visual type
             * migration ছাড়া add করা যায়।
             */
            $table->string('visual_type', 50)
                ->default('rectangle');

            $table->unsignedInteger('display_order')
                ->default(0);

            $table->boolean('is_active')
                ->default(true);

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();

            $table->index('name');
            $table->index('visual_type');
            $table->index('display_order');
            $table->index('is_active');
        });


        /*
        |--------------------------------------------------------------------------
        | Global Variant Options
        |--------------------------------------------------------------------------
        */

        Schema::create('global_variant_options', function (Blueprint $table) {
            $table->id();

            $table->foreignId('global_variant_id')
                ->constrained('global_variants')
                ->cascadeOnDelete();

            /*
             * Visible option value.
             *
             * Examples:
             * Small
             * Medium
             * 256GB
             * Cosmic Orange
             */
            $table->string('value', 150);

            /*
             * Used when visual_type = color.
             *
             * Examples:
             * #ff5a36
             * #1e293b
             */
            $table->string('color_hex', 20)
                ->nullable();

            $table->unsignedInteger('display_order')
                ->default(0);

            $table->boolean('is_active')
                ->default(true);

            $table->timestamps();

            $table->unique(
                [
                    'global_variant_id',
                    'value',
                ],
                'global_variant_option_unique'
            );

            $table->index([
                'global_variant_id',
                'display_order',
            ]);

            $table->index('is_active');
        });
    }


    public function down(): void
    {
        Schema::dropIfExists(
            'global_variant_options'
        );

        Schema::dropIfExists(
            'global_variants'
        );
    }
};
