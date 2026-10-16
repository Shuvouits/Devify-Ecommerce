<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_settings', function (Blueprint $table) {
            $table->id();

            $table->string('provider', 50)
                ->default('openrouter');

            $table->text('api_key')
                ->nullable();

            $table->string('model', 255)
                ->default('openrouter/free');

                $table->string('image_model', 255)
    ->nullable();

            $table->string('url', 500)
                ->default('https://openrouter.ai/api/v1/chat/completions');

            $table->string('base_url', 500)
                ->default('https://openrouter.ai/api/v1');

            $table->boolean('is_enabled')
                ->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_settings');
    }
};
