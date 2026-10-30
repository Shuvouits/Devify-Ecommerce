<?php

namespace App\Repositories\Admin;

use App\Models\HomepageSlider;
use Illuminate\Database\Eloquent\Collection;

class HomepageSliderRepository implements HomepageSliderRepositoryInterface
{
    public function getAll(): Collection
    {
        return HomepageSlider::query()
            ->orderBy('display_order')
            ->orderByDesc('id')
            ->get();
    }

    public function findOrFail(
        int $id
    ): HomepageSlider {
        return HomepageSlider::query()
            ->findOrFail($id);
    }

    public function create(
        array $data
    ): HomepageSlider {
        return HomepageSlider::query()
            ->create($data);
    }

    public function update(
        HomepageSlider $slider,
        array $data
    ): HomepageSlider {
        $slider->update($data);

        return $slider->fresh();
    }

    public function delete(
        HomepageSlider $slider
    ): void {
        $slider->delete();
    }
}