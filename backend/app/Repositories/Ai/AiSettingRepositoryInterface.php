<?php

namespace App\Repositories\Ai;

use App\Models\AiSetting;

interface AiSettingRepositoryInterface
{
    public function getSettings(): ?AiSetting;

    public function create(array $data): AiSetting;

    public function update(
        AiSetting $setting,
        array $data
    ): AiSetting;
}
