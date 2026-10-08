<?php

namespace App\Services\Mail;

use App\Repositories\Settings\Email\SmtpSettingRepositoryInterface;
use Illuminate\Support\Facades\Schema;
use Throwable;

class DynamicMailConfigService
{
    public function __construct(
        protected SmtpSettingRepositoryInterface $smtpSettingRepository
    ) {
    }

    public function apply(): void
    {
        try {
            /*
            |--------------------------------------------------------------------------
            | Table may not exist yet during initial migrations
            |--------------------------------------------------------------------------
            */

            if (! Schema::hasTable('smtp_settings')) {
                return;
            }


            $settings = $this->smtpSettingRepository->get();


            /*
            |--------------------------------------------------------------------------
            | Fall back to .env when DB SMTP is not configured/enabled
            |--------------------------------------------------------------------------
            */

            if (
                ! $settings ||
                ! $settings->is_enabled
            ) {
                return;
            }


            /*
            |--------------------------------------------------------------------------
            | SMTP Scheme
            |--------------------------------------------------------------------------
            |
            | tls  -> smtp (STARTTLS will normally be negotiated)
            | ssl  -> smtps
            |
            */

            $scheme = match ($settings->encryption) {
                'ssl' => 'smtps',
                default => 'smtp',
            };


            /*
            |--------------------------------------------------------------------------
            | Override Laravel mail configuration
            |--------------------------------------------------------------------------
            */

            config([
                'mail.default' => 'smtp',

                'mail.mailers.smtp.transport' => 'smtp',
                'mail.mailers.smtp.scheme' => $scheme,

                'mail.mailers.smtp.host' =>
                    $settings->host,

                'mail.mailers.smtp.port' =>
                    (int) $settings->port,

                'mail.mailers.smtp.username' =>
                    $settings->username,

                /*
                |--------------------------------------------------------------------------
                | Laravel encrypted cast automatically decrypts this
                |--------------------------------------------------------------------------
                */

                'mail.mailers.smtp.password' =>
                    $settings->password,

                'mail.from.address' =>
                    $settings->from_email,

                'mail.from.name' =>
                    $settings->from_name,
            ]);

        } catch (Throwable $exception) {
            /*
            |--------------------------------------------------------------------------
            | Don't break application boot if SMTP config cannot be loaded.
            | Laravel will continue using .env fallback.
            |--------------------------------------------------------------------------
            */

            report($exception);
        }
    }
}
