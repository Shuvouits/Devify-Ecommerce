<?php

namespace App\Providers;

use App\Repositories\Admin\CategoryRepository;
use App\Repositories\Admin\CategoryRepositoryInterface;
use App\Repositories\Admin\LocationRepository;
use App\Repositories\Admin\LocationRepositoryInterface;
use App\Repositories\Ai\AiSettingRepository;
use App\Repositories\Ai\AiSettingRepositoryInterface;
use App\Repositories\Auth\AuthRepository;
use App\Repositories\Auth\AuthRepositoryInterface;
use App\Repositories\Auth\Social\SocialAccountRepository;
use App\Repositories\Auth\Social\SocialAccountRepositoryInterface;
use App\Repositories\Brand\BrandRepository;
use App\Repositories\Brand\BrandRepositoryInterface;
use App\Repositories\Profile\ProfileRepository;
use App\Repositories\Profile\ProfileRepositoryInterface;
use App\Repositories\Settings\Email\SmtpSettingRepository;
use App\Repositories\Settings\Email\SmtpSettingRepositoryInterface;
use App\Repositories\Settings\SocialLogin\SocialLoginRepository;
use App\Repositories\Settings\SocialLogin\SocialLoginRepositoryInterface;
use App\Repositories\TwoFactor\TwoFactorRepository;
use App\Repositories\TwoFactor\TwoFactorRepositoryInterface;
use App\Services\Mail\DynamicMailConfigService;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\ServiceProvider;

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

        $this->app->bind(
            SmtpSettingRepositoryInterface::class,
            SmtpSettingRepository::class
        );

        $this->app->bind(
            SocialLoginRepositoryInterface::class,
            SocialLoginRepository::class
        );

        $this->app->bind(
            SocialAccountRepositoryInterface::class,
            SocialAccountRepository::class
        );

        $this->app->bind(
            ProfileRepositoryInterface::class,
            ProfileRepository::class
        );

        $this->app->bind(
            TwoFactorRepositoryInterface::class,
            TwoFactorRepository::class
        );

        $this->app->bind(
            AiSettingRepositoryInterface::class,
            AiSettingRepository::class
        );

        $this->app->bind(
            BrandRepositoryInterface::class,
            BrandRepository::class
        );

        $this->app->bind(
            CategoryRepositoryInterface::class,
            CategoryRepository::class
        );

        $this->app->bind(
            LocationRepositoryInterface::class,
            LocationRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(
        DynamicMailConfigService $dynamicMailConfigService
    ): void {
        /*
        |--------------------------------------------------------------------------
        | Load dynamic SMTP config from database
        |--------------------------------------------------------------------------
        */

        $dynamicMailConfigService->apply();


        /*
        |--------------------------------------------------------------------------
        | Reset password frontend URL
        |--------------------------------------------------------------------------
        */

        ResetPassword::createUrlUsing(
            function (object $notifiable, string $token) {
                return config('app.frontend_url')
                    . '/reset-password?token='
                    . $token
                    . '&email='
                    . urlencode(
                        $notifiable->getEmailForPasswordReset()
                    );
            }
        );


        /*
        |--------------------------------------------------------------------------
        | Custom Devify password reset email
        |--------------------------------------------------------------------------
        */

        ResetPassword::toMailUsing(
            function (object $notifiable, string $token) {
                $resetUrl = config('app.frontend_url')
                    . '/reset-password?token='
                    . $token
                    . '&email='
                    . urlencode(
                        $notifiable->getEmailForPasswordReset()
                    );

                return (new MailMessage)
                    ->subject('Reset your Devify password')
                    ->view(
                        'emails.auth.reset-password',
                        [
                            'name' => $notifiable->name ?? 'there',
                            'email' => $notifiable->getEmailForPasswordReset(),
                            'resetUrl' => $resetUrl,
                            'supportEmail' => config('mail.from.address'),
                        ]
                    );
            }
        );
    }
}
