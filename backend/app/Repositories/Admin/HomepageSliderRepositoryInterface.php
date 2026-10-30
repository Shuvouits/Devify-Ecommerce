<?php

namespace App\Repositories\Admin;

use App\Models\HomepageSlider;
use Illuminate\Database\Eloquent\Collection;

interface HomepageSliderRepositoryInterface
{
    public function getAll(): Collection;

    public function findOrFail(
        int $id
    ): HomepageSlider;

    public function create(
        array $data
    ): HomepageSlider;

    public function update(
        HomepageSlider $slider,
        array $data
    ): HomepageSlider;

    public function delete(
        HomepageSlider $slider
    ): void;
}