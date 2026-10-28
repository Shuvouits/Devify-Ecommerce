<?php

use App\Http\Controllers\Admin\Settings\Email\SmtpSettingController;
use App\Http\Controllers\Admin\Settings\SocialLogin\SocialLoginController;
use App\Http\Controllers\Api\Admin\BrandAiController;
use App\Http\Controllers\Api\Admin\BrandAiImageController;
use App\Http\Controllers\Api\Admin\BrandController;
use App\Http\Controllers\Api\Admin\BrandSeoController;
use App\Http\Controllers\Api\Admin\CategoryAiController;
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\CollectionController;
use App\Http\Controllers\Api\Admin\GlobalVariantController;
use App\Http\Controllers\Api\Admin\Settings\AiImageModelController;
use App\Http\Controllers\Api\Admin\Settings\AiSettingController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\Profile\ProfileController;
use App\Http\Controllers\Profile\TwoFactorController;
use App\Http\Controllers\Api\Admin\LocationController;
use App\Http\Controllers\Api\Admin\ProductController;
use App\Http\Controllers\Api\Admin\ProductAiController;
use App\Http\Controllers\Api\Admin\ProductSeoController;
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


        Route::post('/ai/description', [BrandAiController::class, 'generateDescription']);
        Route::post('/ai/seo', [BrandAiController::class, 'generateSeo']);
        Route::post('/seo/analyze', [BrandSeoController::class, 'analyze']);
        Route::post('/ai/image', [BrandAiImageController::class, 'generate']);




        Route::get('/', [BrandController::class, 'index']);
        Route::post('/', [BrandController::class, 'store']);




        Route::get('/{id}/logo-source', [BrandController::class, 'logoSource']);



        Route::get('/{id}', [BrandController::class, 'show']);
        Route::put('/{id}', [BrandController::class, 'update']);



        Route::post('/{id}/logo', [BrandController::class, 'uploadLogo']);
        Route::delete('/{id}/logo', [BrandController::class, 'deleteLogo']);




        Route::patch('/{id}/archive', [BrandController::class, 'archive']);
        Route::patch('/{id}/restore', [BrandController::class, 'restore']);



        Route::delete('/{id}', [BrandController::class, 'destroy']);
    });
});



Route::prefix('admin')->middleware(['auth:api', 'role:admin'])->group(function () {


    Route::prefix('categories')->group(function () {
        Route::post('/ai/description', [CategoryAiController::class, 'generateDescription']);
        Route::post('/ai/seo', [CategoryAiController::class, 'generateSeo']);

        Route::get('/parent-options', [CategoryController::class, 'parentOptions']);
        Route::get('/', [CategoryController::class, 'index']);
        Route::post('/', [CategoryController::class, 'store']);

        Route::post('/{id}/image', [CategoryController::class, 'uploadImage']);
        Route::delete('/{id}/image', [CategoryController::class, 'deleteImage']);

        Route::post('/{id}/icon', [CategoryController::class, 'uploadIcon']);
        Route::delete('/{id}/icon', [CategoryController::class, 'deleteIcon']);

        Route::patch('/{id}/trash/restore', [CategoryController::class, 'restoreDeleted']);
        Route::delete('/{id}/trash/force', [CategoryController::class, 'forceDestroy']);

        Route::get('/{id}', [CategoryController::class, 'show']);
        Route::put('/{id}', [CategoryController::class, 'update']);

        Route::patch('/{id}/archive', [CategoryController::class, 'archive']);
        Route::patch('/{id}/restore', [CategoryController::class, 'restore']);

        Route::delete('/{id}', [CategoryController::class, 'destroy']);
    });
});



Route::prefix('admin')->middleware(['auth:api', 'role:admin'])->group(function () {
    Route::prefix('locations')->group(function () {
        Route::get('/', [LocationController::class, 'index']);
        Route::post('/', [LocationController::class, 'store']);

        Route::get('/delivery-order', [LocationController::class, 'deliveryOrder']);
        Route::put('/delivery-order', [LocationController::class, 'updateDeliveryOrder']);

        Route::patch('/default', [LocationController::class, 'setDefault']);

        Route::get('/{id}', [LocationController::class, 'show']);
        Route::put('/{id}', [LocationController::class, 'update']);

        Route::delete('/{id}', [LocationController::class, 'destroy']);
    });
});



Route::prefix('admin')->middleware(['auth:api', 'role:admin'])->group(function () {


    Route::prefix('global-variants')->group(function () {
        Route::get('/', [GlobalVariantController::class, 'index']);

        Route::get('/ordered', [GlobalVariantController::class, 'ordered']);

        Route::post('/', [GlobalVariantController::class, 'store']);

        Route::get('/{id}', [GlobalVariantController::class, 'show']);

        Route::put('/{id}', [GlobalVariantController::class, 'update']);

        Route::delete('/{id}', [GlobalVariantController::class, 'destroy']);
    });
});



Route::prefix('admin')->middleware(['auth:api', 'role:admin'])->group(function () {

    Route::prefix('collections')->group(function () {
        Route::get('/ordered', [CollectionController::class, 'ordered']);

        Route::get('/', [CollectionController::class, 'index']);
        Route::post('/', [CollectionController::class, 'store']);

        Route::post('/upload-image', [CollectionController::class, 'uploadImage']);
        Route::delete('/delete-image', [CollectionController::class, 'deleteImage']);

        Route::get('/{id}', [CollectionController::class, 'show']);
        Route::put('/{id}', [CollectionController::class, 'update']);
        Route::delete('/{id}', [CollectionController::class, 'destroy']);
    });
});


Route::prefix('admin')->middleware(['auth:api', 'role:admin'])->group(function () {

    Route::prefix('products')->group(function () {
        Route::get('/select', [ProductController::class, 'select']);
        Route::get('/stats', [ProductController::class, 'stats']);
        Route::post('/upload-image', [ProductController::class, 'uploadImage']);

        Route::delete('/delete-image', [ProductController::class, 'deleteImage']);

        Route::get('/', [ProductController::class, 'index']);
        Route::post('/', [ProductController::class, 'store']);

        Route::get('/{id}', [ProductController::class, 'show']);
        Route::put('/{id}', [ProductController::class, 'update']);
        Route::delete('/{id}', [ProductController::class, 'destroy']);

        Route::post('/ai/description', [ProductAiController::class, 'generateDescription']);
        Route::post('/ai/seo', [ProductAiController::class, 'generateSeo']);
        Route::post('/seo/analyze', [ProductSeoController::class, 'analyze']);
    });
});
