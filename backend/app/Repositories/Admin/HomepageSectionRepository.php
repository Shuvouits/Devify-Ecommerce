<?php

namespace App\Repositories\Admin;

use App\Models\HomepageSection;

class HomepageSectionRepository implements HomepageSectionRepositoryInterface
{
    public function findByKey(
        string $sectionKey
    ): ?HomepageSection {
        return HomepageSection::query()
            ->where(
                'section_key',
                $sectionKey
            )
            ->first();
    }

    public function updateOrCreate(
        string $sectionKey,
        array $data
    ): HomepageSection {
        return HomepageSection::query()
            ->updateOrCreate(
                [
                    'section_key' =>
                        $sectionKey,
                ],
                $data
            );
    }
}
