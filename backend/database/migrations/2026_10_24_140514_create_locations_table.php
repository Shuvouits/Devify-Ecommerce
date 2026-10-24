<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->id();

            $table->string('name');

            $table->text('address')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Location Services
            |--------------------------------------------------------------------------
            */

            $table->boolean('can_collect')
                ->default(false);

            $table->boolean('ships_online_orders')
                ->default(false);

            $table->boolean('sells_over_counter')
                ->default(false);

            $table->boolean('receives_returns')
                ->default(false);


            /*
            |--------------------------------------------------------------------------
            | Location Settings
            |--------------------------------------------------------------------------
            */

            $table->boolean('is_default')
                ->default(false);

            $table->enum(
                'status',
                [
                    'active',
                    'inactive',
                ]
            )->default('active');

            $table->unsignedInteger('delivery_order')
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

            $table->timestamps();


            /*
            |--------------------------------------------------------------------------
            | Indexes
            |--------------------------------------------------------------------------
            */

            $table->index('status');

            $table->index('is_default');

            $table->index('delivery_order');
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
