<?php

namespace App\Services\Settings\Email;

use App\Models\SmtpSetting;
use App\Repositories\Settings\Email\SmtpSettingRepositoryInterface;
use Illuminate\Validation\ValidationException;

class SmtpSettingService
{
    public function __construct(
        protected SmtpSettingRepositoryInterface $smtpSettingRepository
    ) {
    }

    public function getSettings(): ?SmtpSetting
    {
        return $this->smtpSettingRepository->get();
    }


    public function hasPassword(?SmtpSetting $setting = null): bool
    {
        $setting ??= $this->smtpSettingRepository->get();

        if (! $setting) {
            return false;
        }

        return filled($setting->password);
    }


    public function saveSettings(array $data): SmtpSetting
    {
        $existingSetting =
            $this->smtpSettingRepository->get();

        if (
            ! $existingSetting &&
            ($data['is_enabled'] ?? false) &&
            blank($data['password'] ?? null)
        ) {
            throw ValidationException::withMessages([
                'password' => [
                    'SMTP password is required for the initial setup.',
                ],
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | Existing row আছে কিন্তু password নেই
        |--------------------------------------------------------------------------
        */

        if (
            $existingSetting &&
            ($data['is_enabled'] ?? false) &&
            blank($existingSetting->password) &&
            blank($data['password'] ?? null)
        ) {
            throw ValidationException::withMessages([
                'password' => [
                    'SMTP password is required before enabling email delivery.',
                ],
            ]);
        }


        $data['is_enabled'] =
            (bool) ($data['is_enabled'] ?? false);

        $data['provider'] =
            strtolower($data['provider'] ?? 'custom');

        $data['encryption'] =
            strtolower($data['encryption'] ?? 'tls');


        return $this->smtpSettingRepository->save(
            $data
        );
    }
}
