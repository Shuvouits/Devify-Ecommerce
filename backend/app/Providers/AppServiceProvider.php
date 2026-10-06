<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Auth\AuthRepository;
use App\Repositories\Auth\AuthRepositoryInterface;
use Illuminate\Auth\Notifications\ResetPassword;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            AuthRepositoryInterface::class,
            AuthRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
   public function boot(): void
{
    ResetPassword::createUrlUsing(
        function (object $notifiable, string $token) {
            return config('app.frontend_url')
                . '/reset-password?token='
                . $token
                . '&email='
                . urlencode($notifiable->getEmailForPasswordReset());
        }
    );
}
}
