<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

use App\Repositories\Auth\AuthRepository;
use App\Repositories\Auth\AuthRepositoryInterface;
use App\Repositories\Auth\Social\SocialAccountRepository;
use App\Repositories\Auth\Social\SocialAccountRepositoryInterface;
use App\Repositories\Settings\Email\SmtpSettingRepository;
use App\Repositories\Settings\Email\SmtpSettingRepositoryInterface;
use App\Repositories\Settings\SocialLogin\SocialLoginRepository;
use App\Repositories\Settings\SocialLogin\SocialLoginRepositoryInterface;
use App\Services\Mail\DynamicMailConfigService;

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

