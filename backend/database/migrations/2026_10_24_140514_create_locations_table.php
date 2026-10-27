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
        | Products
        |--------------------------------------------------------------------------
        */

        Schema::create('products', function (Blueprint $table) {
            $table->id();

            /*
            |--------------------------------------------------------------------------
            | Ownership
            |--------------------------------------------------------------------------
            */

            $table->foreignId('vendor_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();


            /*
            |--------------------------------------------------------------------------
            | Organization
            |--------------------------------------------------------------------------
            */

            $table->foreignId('brand_id')
                ->nullable()
                ->constrained('brands')
                ->nullOnDelete();

            $table->foreignId('category_id')
                ->nullable()
                ->constrained('categories')
                ->nullOnDelete();


            /*
            |--------------------------------------------------------------------------
            | Basic Information
            |--------------------------------------------------------------------------
            */

            $table->string('title', 200);

            $table->string('slug', 220)
                ->unique();

            $table->text('overview')
                ->nullable();

            $table->longText('description')
                ->nullable();

            $table->json('specifications')
                ->nullable();

            $table->json('tags')
                ->nullable();


            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */

            $table->string('status', 30)
                ->default('draft')
                ->index();

            $table->boolean('is_featured')
                ->default(false)
                ->index();


            /*
            |--------------------------------------------------------------------------
            | Publishing
            |--------------------------------------------------------------------------
            */

            $table->boolean('publish_online_store')
                ->default(true)
                ->index();

            $table->boolean('publish_point_of_sale')
                ->default(false)
                ->index();


            /*
            |--------------------------------------------------------------------------
            | Returns
            |--------------------------------------------------------------------------
            */

            $table->boolean('is_final_sale')
                ->default(false);

            /*
             * NULL means use store default.
             */
            $table->unsignedInteger('return_window_days')
                ->nullable();


            /*
            |--------------------------------------------------------------------------
            | Pre-orders
            |--------------------------------------------------------------------------
            */

            $table->boolean('preorder_enabled')
                ->default(false)
                ->index();

            $table->date('preorder_expected_ship_date')
                ->nullable();

            /*
             * 0 means no fixed limit.
             */
            $table->unsignedInteger('preorder_limit')
                ->default(0);

            $table->string('preorder_payment_collection', 30)
                ->default('pay_later');

            $table->string('preorder_deposit_type', 30)
                ->nullable();

            $table->decimal(
                'preorder_deposit_value',
                12,
                2
            )->nullable();

            $table->date('preorder_supplier_eta')
                ->nullable();

            $table->string('preorder_batch_name', 150)
                ->nullable();

            $table->text('preorder_storefront_message')
                ->nullable();

            $table->unsignedInteger('reserved_preorders')
                ->default(0);

            $table->boolean('sell_only_as_preorder')
                ->default(false);

            $table->boolean('stop_preorders_after_release_date')
                ->default(false);


            /*
            |--------------------------------------------------------------------------
            | Base Pricing
            |--------------------------------------------------------------------------
            |
            | Used when product has no variants.
            | When variants exist, pricing is managed per variant.
            |
            */

            $table->decimal('price', 12, 2)
                ->nullable();

            $table->decimal('compare_at_price', 12, 2)
                ->nullable();

            $table->decimal('cost_per_item', 12, 2)
                ->nullable();


            /*
            |--------------------------------------------------------------------------
            | Tax
            |--------------------------------------------------------------------------
            */

            $table->boolean('charge_tax')
                ->default(true);

            /*
             * NULL means inherit from category/store.
             */
            $table->string('tax_class', 100)
                ->nullable();


            /*
            |--------------------------------------------------------------------------
            | Base Inventory
            |--------------------------------------------------------------------------
            |
            | Used for products without variants.
            |
            */

            $table->string('sku', 120)
                ->nullable()
                ->unique();

            $table->string('barcode', 120)
                ->nullable()
                ->unique();

            $table->boolean('track_quantity')
                ->default(true);

            $table->boolean('continue_selling_when_out_of_stock')
                ->default(false);


            /*
            |--------------------------------------------------------------------------
            | Shipping
            |--------------------------------------------------------------------------
            */

            $table->decimal('weight', 10, 3)
                ->default(0);

            $table->string('weight_unit', 20)
                ->default('kg');

            $table->decimal('length', 10, 2)
                ->default(0);

            $table->decimal('width', 10, 2)
                ->default(0);

            $table->decimal('height', 10, 2)
                ->default(0);

            $table->string('size_unit', 20)
                ->default('cm');

            $table->string('country_of_origin', 100)
                ->nullable();

            $table->string('hs_code', 100)
                ->nullable();

            $table->string('customs_description', 500)
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
            | Timestamps
            |--------------------------------------------------------------------------
            */

            $table->timestamps();
            $table->softDeletes();


            /*
            |--------------------------------------------------------------------------
            | Indexes
            |--------------------------------------------------------------------------
            */

            $table->index([
                'vendor_id',
                'status',
            ]);

            $table->index([
                'category_id',
                'status',
            ]);

            $table->index([
                'brand_id',
                'status',
            ]);

            $table->index([
                'status',
                'created_at',
            ]);
        });


        /*
        |--------------------------------------------------------------------------
        | Product Media
        |--------------------------------------------------------------------------
        */

        Schema::create('product_media', function (Blueprint $table) {
            $table->id();

            $table->foreignId('product_id')
                ->constrained('products')
                ->cascadeOnDelete();

            /*
             * image
             * video
             * youtube
             * vimeo
             * model_3d
             */
            $table->string('media_type', 30)
                ->default('image');

            $table->string('file_path', 500)
                ->nullable();

            $table->string('external_url', 1000)
                ->nullable();

            $table->string('alt_text', 255)
                ->nullable();

            $table->boolean('is_cover')
                ->default(false);

            $table->unsignedInteger('display_order')
                ->default(0);

            $table->timestamps();

            $table->index([
                'product_id',
                'display_order',
            ]);

            $table->index([
                'product_id',
                'is_cover',
            ]);
        });


        /*
        |--------------------------------------------------------------------------
        | Product Collections
        |--------------------------------------------------------------------------
        |
        | A product can belong to multiple collections.
        |
        */

        Schema::create('collection_product', function (Blueprint $table) {
            $table->id();

            $table->foreignId('collection_id')
                ->constrained('collections')
                ->cascadeOnDelete();

            $table->foreignId('product_id')
                ->constrained('products')
                ->cascadeOnDelete();

            $table->unsignedInteger('display_order')
                ->default(0);

            $table->timestamps();

            $table->unique([
                'collection_id',
                'product_id',
            ]);

            $table->index([
                'product_id',
                'display_order',
            ]);
        });


        /*
        |--------------------------------------------------------------------------
        | Product Global Variants
        |--------------------------------------------------------------------------
        |
        | Example:
        | Product -> Color
        | Product -> Storage
        |
        */

        Schema::create('product_global_variants', function (Blueprint $table) {
            $table->id();

            $table->foreignId('product_id')
                ->constrained('products')
                ->cascadeOnDelete();

            $table->foreignId('global_variant_id')
                ->constrained('global_variants')
                ->restrictOnDelete();

            $table->unsignedInteger('display_order')
                ->default(0);

            $table->timestamps();

            $table->unique([
                'product_id',
                'global_variant_id',
            ], 'product_global_variant_unique');

            $table->index([
                'product_id',
                'display_order',
            ]);
        });


        /*
        |--------------------------------------------------------------------------
        | Product Allowed Variant Options
        |--------------------------------------------------------------------------
        |
        | Example:
        | Product uses Color:
        | Black, Silver, Gold
        |
        | Product does not need to use every option from the global variant.
        |
        */

        Schema::create(
            'product_global_variant_options',
            function (Blueprint $table) {
                $table->id();

                $table->foreignId('product_id')
                    ->constrained('products')
                    ->cascadeOnDelete();

                $table->foreignId('global_variant_id')
                    ->constrained('global_variants')
                    ->restrictOnDelete();

                $table->foreignId('global_variant_option_id')
                    ->constrained('global_variant_options')
                    ->restrictOnDelete();

                $table->unsignedInteger('display_order')
                    ->default(0);

                $table->timestamps();

                $table->unique(
                    [
                        'product_id',
                        'global_variant_option_id',
                    ],
                    'product_global_option_unique'
                );

                $table->index([
                    'product_id',
                    'global_variant_id',
                    'display_order',
                ], 'product_global_option_order_idx');
            }
        );


        /*
        |--------------------------------------------------------------------------
        | Product Variants
        |--------------------------------------------------------------------------
        |
        | Each row represents a sellable combination.
        |
        | Example:
        | Black / 256GB
        | Black / 512GB
        | Silver / 256GB
        |
        */

        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();

            $table->foreignId('product_id')
                ->constrained('products')
                ->cascadeOnDelete();

            $table->string('title', 255)
                ->nullable();

            $table->string('sku', 120)
                ->nullable()
                ->unique();

            $table->string('barcode', 120)
                ->nullable()
                ->unique();

            $table->decimal('price', 12, 2)
                ->nullable();

            $table->decimal('compare_at_price', 12, 2)
                ->nullable();

            $table->decimal('cost_per_item', 12, 2)
                ->nullable();

            $table->string('image_path', 500)
                ->nullable();

            $table->boolean('is_active')
                ->default(true)
                ->index();

            $table->unsignedInteger('display_order')
                ->default(0);

            /*
             * Optional per-variant override.
             * NULL means use product-level return policy.
             */
            $table->boolean('is_final_sale')
                ->nullable();

            $table->unsignedInteger('return_window_days')
                ->nullable();

            $table->timestamps();

            $table->index([
                'product_id',
                'display_order',
            ]);

            $table->index([
                'product_id',
                'is_active',
            ]);
        });


        /*
        |--------------------------------------------------------------------------
        | Variant Option Values
        |--------------------------------------------------------------------------
        |
        | Connects a generated product variant with the exact selected global
        | option values that make up the combination.
        |
        */

        Schema::create(
            'product_variant_option_values',
            function (Blueprint $table) {
                $table->id();

                $table->foreignId('product_variant_id')
                    ->constrained('product_variants')
                    ->cascadeOnDelete();

                $table->foreignId('global_variant_id')
                    ->constrained('global_variants')
                    ->restrictOnDelete();

                $table->foreignId('global_variant_option_id')
                    ->constrained('global_variant_options')
                    ->restrictOnDelete();

                $table->timestamps();

                $table->unique(
                    [
                        'product_variant_id',
                        'global_variant_id',
                    ],
                    'product_variant_global_unique'
                );

                $table->index(
                    'global_variant_option_id'
                );
            }
        );


        /*
        |--------------------------------------------------------------------------
        | Inventory By Location
        |--------------------------------------------------------------------------
        |
        | Supports both non-variant and variant products.
        |
        | For non-variant product:
        | product_variant_id = NULL
        |
        | For variant product:
        | product_variant_id = variant ID
        |
        */

        Schema::create(
            'product_inventories',
            function (Blueprint $table) {
                $table->id();

                $table->foreignId('product_id')
                    ->constrained('products')
                    ->cascadeOnDelete();

                $table->foreignId('product_variant_id')
                    ->nullable()
                    ->constrained('product_variants')
                    ->cascadeOnDelete();

                $table->foreignId('location_id')
                    ->constrained('locations')
                    ->cascadeOnDelete();

                $table->integer('quantity')
                    ->default(0);

                $table->integer('reserved_quantity')
                    ->default(0);

                $table->integer('incoming_quantity')
                    ->default(0);

                $table->timestamps();

                $table->index([
                    'product_id',
                    'location_id',
                ]);

                $table->index([
                    'product_variant_id',
                    'location_id',
                ]);

                $table->unique(
                    [
                        'product_id',
                        'product_variant_id',
                        'location_id',
                    ],
                    'product_inventory_unique'
                );
            }
        );
    }


    public function down(): void
    {
        Schema::dropIfExists(
            'product_inventories'
        );

        Schema::dropIfExists(
            'product_variant_option_values'
        );

        Schema::dropIfExists(
            'product_variants'
        );

        Schema::dropIfExists(
            'product_global_variant_options'
        );

        Schema::dropIfExists(
            'product_global_variants'
        );

        Schema::dropIfExists(
            'collection_product'
        );

        Schema::dropIfExists(
            'product_media'
        );

        Schema::dropIfExists(
            'products'
        );
    }
};