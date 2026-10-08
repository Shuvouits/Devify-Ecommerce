<?php

namespace App\Repositories\Settings\Email;

use App\Models\SmtpSetting;

interface SmtpSettingRepositoryInterface
{
    public function get(): ?SmtpSetting;

    public function save(array $data): SmtpSetting;
}
