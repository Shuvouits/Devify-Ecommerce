<?php

namespace App\Services\Admin;

use App\Models\HomepageSection;
use App\Repositories\Admin\HomepageSectionRepositoryInterface;

class HomepageSectionService
{
    public function __construct(
        protected HomepageSectionRepositoryInterface $homepageSectionRepository
    ) {
    }

    public function getSection(
        string $sectionKey
    ): HomepageSection {
        $section =
            $this->homepageSectionRepository
                ->findByKey(
                    $sectionKey
                );

        if ($section) {
            return $section;
        }

        return $this
            ->homepageSectionRepository
            ->updateOrCreate(
                $sectionKey,
                [
                    'is_active' => true,
                    'item_limit' => 8,
                    'settings' => [],
                ]
            );
    }

    public function updateSection(
        string $sectionKey,
        array $data
    ): HomepageSection {
        return $this
            ->homepageSectionRepository
            ->updateOrCreate(
                $sectionKey,
                [
                    'is_active' =>
                        $data['is_active'] ?? true,

                    'item_limit' =>
                        $data['item_limit'] ?? 8,

                    'settings' =>
                        $data['settings'] ?? [],
                ]
            );
    }
}
