<?php

namespace App\Repositories\Admin;

use App\Models\HomepageSection;

interface HomepageSectionRepositoryInterface
{
    public function findByKey(
        string $sectionKey
    ): ?HomepageSection;

    public function updateOrCreate(
        string $sectionKey,
        array $data
    ): HomepageSection;
}
