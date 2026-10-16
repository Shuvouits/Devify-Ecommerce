<?php

namespace App\Repositories\Ai;

use App\Models\AiSetting;

class AiSettingRepository implements AiSettingRepositoryInterface
{
    public function getSettings(): ?AiSetting
    {
        return AiSetting::query()
            ->first();
    }


    public function create(array $data): AiSetting
    {
        return AiSetting::query()
            ->create($data);
    }


    public function update(
        AiSetting $setting,
        array $data
    ): AiSetting {
        $setting->update($data);

        return $setting->fresh();
    }
}
