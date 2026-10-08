<?php

namespace App\Repositories\Settings\Email;

use App\Models\SmtpSetting;

class SmtpSettingRepository implements SmtpSettingRepositoryInterface
{
    public function __construct(
        protected SmtpSetting $smtpSetting
    ) {
    }

    public function get(): ?SmtpSetting
    {
        return $this->smtpSetting->first();
    }

    public function save(array $data): SmtpSetting
    {
        /*
        |--------------------------------------------------------------------------
        | PRESERVE EXISTING PASSWORD
        |--------------------------------------------------------------------------
        |
        | যদি frontend থেকে password blank আসে,
        | existing encrypted password overwrite করা হবে না।
        |
        */

        if (
            array_key_exists('password', $data) &&
            blank($data['password'])
        ) {
            unset($data['password']);
        }


        /*
        |--------------------------------------------------------------------------
        | GET EXISTING SMTP SETTINGS
        |--------------------------------------------------------------------------
        */

        $setting = $this->get();


        /*
        |--------------------------------------------------------------------------
        | UPDATE EXISTING
        |--------------------------------------------------------------------------
        */

        if ($setting) {
            $setting->update($data);

            return $setting->refresh();
        }


        /*
        |--------------------------------------------------------------------------
        | CREATE FIRST SMTP SETTINGS
        |--------------------------------------------------------------------------
        */

        return $this->smtpSetting->create($data);
    }
}
