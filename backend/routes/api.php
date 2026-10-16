<?php

use App\Http\Controllers\Admin\Settings\Email\SmtpSettingController;
use App\Http\Controllers\Admin\Settings\SocialLogin\SocialLoginController;
use App\Http\Controllers\Api\Admin\BrandAiController;
use App\Http\Controllers\Api\Admin\BrandAiImageController;
use App\Http\Controllers\Api\Admin\BrandController;
use App\Http\Controllers\Api\Admin\BrandSeoController;
use App\Http\Controllers\Api\Admin\Settings\AiImageModelController;
use App\Http\Controllers\Api\Admin\Settings\AiSettingController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\Profile\ProfileController;
use App\Http\Controllers\Profile\TwoFactorController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/two-factor/verify', [AuthController::class, 'verifyTwoFactor']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    Route::get('/social/{provider}/redirect', [SocialAuthController::class, 'redirect'])->where('provider', 'google');
    Route::get('/social/{provider}/callback', [SocialAuthController::class, 'callback'])->where('provider', 'google');
    Route::post('/social/exchange', [SocialAuthController::class, 'exchange']);

    Route::middleware('auth:api')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

Route::prefix('profile')->middleware('auth:api')->group(function () {
    Route::get('/', [ProfileController::class, 'show']);
    Route::put('/', [ProfileController::class, 'update']);
    Route::post('/photo', [ProfileController::class, 'uploadPhoto']);
    Route::delete('/photo', [ProfileController::class, 'deletePhoto']);
    Route::put('/password', [ProfileController::class, 'updatePassword']);

    Route::prefix('two-factor')->group(function () {
        Route::get('/status', [TwoFactorController::class, 'status']);
        Route::post('/setup', [TwoFactorController::class, 'setup']);
        Route::post('/confirm', [TwoFactorController::class, 'confirm']);
        Route::delete('/', [TwoFactorController::class, 'disable']);
        Route::post('/recovery-codes', [TwoFactorController::class, 'regenerateRecoveryCodes']);
    });
});

Route::prefix('admin')->middleware(['auth:api', 'role:admin'])->group(function () {
    Route::prefix('settings')->group(function () {
        Route::get('/email', [SmtpSettingController::class, 'show']);
        Route::put('/email', [SmtpSettingController::class, 'update']);

        Route::prefix('social-login')->group(function () {
            Route::get('/', [SocialLoginController::class, 'index']);
            Route::get('/{provider}', [SocialLoginController::class, 'show']);
            Route::put('/{provider}', [SocialLoginController::class, 'update']);
        });

        Route::get('/ai', [AiSettingController::class, 'show']);
        Route::put('/ai', [AiSettingController::class, 'update']);
        Route::get('/ai/image-models', [AiImageModelController::class, 'index']);
    });



    Route::prefix('brands')->group(function () {
    /*
    |--------------------------------------------------------------------------
    | AI
    |--------------------------------------------------------------------------
    */

    Route::post('/ai/description', [BrandAiController::class, 'generateDescription']);
    Route::post('/ai/seo', [BrandAiController::class, 'generateSeo']);
    Route::post('/seo/analyze', [BrandSeoController::class, 'analyze']);
    Route::post('/ai/image', [BrandAiImageController::class, 'generate']);


    /*
    |--------------------------------------------------------------------------
    | Brand List / Create
    |--------------------------------------------------------------------------
    */

    Route::get('/', [BrandController::class, 'index']);
    Route::post('/', [BrandController::class, 'store']);


    /*
    |--------------------------------------------------------------------------
    | Brand Logo Source
    |--------------------------------------------------------------------------
    */

    Route::get('/{id}/logo-source', [BrandController::class, 'logoSource']);


    /*
    |--------------------------------------------------------------------------
    | Brand Show / Update
    |--------------------------------------------------------------------------
    */

    Route::get('/{id}', [BrandController::class, 'show']);
    Route::put('/{id}', [BrandController::class, 'update']);


    /*
    |--------------------------------------------------------------------------
    | Brand Logo
    |--------------------------------------------------------------------------
    */

    Route::post('/{id}/logo', [BrandController::class, 'uploadLogo']);
    Route::delete('/{id}/logo', [BrandController::class, 'deleteLogo']);


    /*
    |--------------------------------------------------------------------------
    | Archive / Restore
    |--------------------------------------------------------------------------
    */

    Route::patch('/{id}/archive', [BrandController::class, 'archive']);
    Route::patch('/{id}/restore', [BrandController::class, 'restore']);


    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    Route::delete('/{id}', [BrandController::class, 'destroy']);
});



});
