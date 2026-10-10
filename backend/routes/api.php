<?php

use App\Http\Controllers\Admin\Settings\Email\SmtpSettingController;
use App\Http\Controllers\Admin\Settings\SocialLogin\SocialLoginController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Auth\SocialAuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/refresh', [AuthController::class, 'refresh']);

    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    /*
    |--------------------------------------------------------------------------
    | Social Login
    |--------------------------------------------------------------------------
    */

    Route::get('/social/{provider}/redirect', [SocialAuthController::class, 'redirect'])->where('provider', 'google');
    Route::get('/social/{provider}/callback', [SocialAuthController::class, 'callback'])->where('provider', 'google');
    Route::post('/social/exchange', [SocialAuthController::class, 'exchange']);

    /*
    |--------------------------------------------------------------------------
    | Protected Authentication
    |--------------------------------------------------------------------------
    */

    Route::middleware('auth:api')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->middleware(['auth:api', 'role:admin'])->group(function () {
    /*
    |--------------------------------------------------------------------------
    | Settings
    |--------------------------------------------------------------------------
    */

    Route::prefix('settings')->group(function () {
        /*
        |--------------------------------------------------------------------------
        | SMTP Settings
        |--------------------------------------------------------------------------
        */

        Route::get('/email', [SmtpSettingController::class, 'show']);
        Route::put('/email', [SmtpSettingController::class, 'update']);

        /*
        |--------------------------------------------------------------------------
        | Social Login Settings
        |--------------------------------------------------------------------------
        */

        Route::prefix('social-login')->group(function () {
            Route::get('/', [SocialLoginController::class, 'index']);
            Route::get('/{provider}', [SocialLoginController::class, 'show']);
            Route::put('/{provider}', [SocialLoginController::class, 'update']);
        });
    });
});
