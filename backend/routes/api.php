<?php

use App\Http\Controllers\Admin\Settings\Email\SmtpSettingController;
use App\Http\Controllers\Api\Auth\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/refresh', [AuthController::class, 'refresh']);

    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password',[AuthController::class, 'resetPassword']);

    Route::middleware('auth:api')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});


Route::prefix('admin')->middleware(['auth:api', 'role:admin'])->group(function () {
    Route::prefix('settings')->group(function () {
        Route::get('/email', [SmtpSettingController::class, 'show']);
        Route::put('/email', [SmtpSettingController::class, 'update']);
    });
});
