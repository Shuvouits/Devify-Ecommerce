<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('collections', function (Blueprint $table) {
            $table->id();

            /*
            |--------------------------------------------------------------------------
            | Collection Details
            |--------------------------------------------------------------------------
            */

            $table->string('title', 180);

            $table->string('slug', 200)
                ->unique();

            $table->text('description')
                ->nullable();

            $table->string('image_path', 500)
                ->nullable();


            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            |
            | draft
            | active
            |
            */

            $table->string('status', 30)
                ->default('draft')
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
            | Collection Kind
            |--------------------------------------------------------------------------
            |
            | collection = normal product collection
            | look       = styled outfit / look
            |
            */

            $table->string('kind', 30)
                ->default('collection')
                ->index();


            /*
            |--------------------------------------------------------------------------
            | Collection Type
            |--------------------------------------------------------------------------
            |
            | manual    = products added manually
            | automated = products added using conditions
            |
            */

            $table->string('collection_type', 30)
                ->default('manual')
                ->index();


            /*
            |--------------------------------------------------------------------------
            | Automated Collection Rules
            |--------------------------------------------------------------------------
            |
            | match_type:
            | all = all conditions must match
            | any = any condition may match
            |
            | automation_conditions example:
            |
            | [
            |     {
            |         "field": "tag",
            |         "operator": "equals",
            |         "value": "summer"
            |     }
            | ]
            |
            */

            $table->string('automation_match_type', 20)
                ->nullable();

            $table->json('automation_conditions')
                ->nullable();


            /*
            |--------------------------------------------------------------------------
            | Sorting & Display
            |--------------------------------------------------------------------------
            |
            | sort_order examples:
            | manual
            | best_selling
            | alphabetical_asc
            | alphabetical_desc
            | price_asc
            | price_desc
            | newest
            | oldest
            |
            */

            $table->string('sort_order', 50)
                ->default('manual')
                ->index();

            $table->integer('display_position')
                ->default(0)
                ->index();


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
            | Audit
            |--------------------------------------------------------------------------
            */

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();


            /*
            |--------------------------------------------------------------------------
            | Timestamps / Soft Delete
            |--------------------------------------------------------------------------
            */

            $table->timestamps();

            $table->softDeletes();


            /*
            |--------------------------------------------------------------------------
            | Useful Indexes
            |--------------------------------------------------------------------------
            */

            $table->index([
                'status',
                'display_position',
            ]);

            $table->index([
                'kind',
                'collection_type',
            ]);

            $table->index([
                'publish_online_store',
                'status',
            ]);
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('collections');
    }
};
