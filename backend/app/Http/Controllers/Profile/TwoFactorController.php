<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\TwoFactor\ConfirmTwoFactorRequest;
use App\Http\Requests\TwoFactor\DisableTwoFactorRequest;
use App\Http\Requests\TwoFactor\RegenerateRecoveryCodesRequest;
use App\Services\TwoFactor\TwoFactorService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class TwoFactorController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        private readonly TwoFactorService $twoFactorService
    ) {
    }

    public function status(Request $request)
    {
        $status = $this->twoFactorService
            ->getStatus(
                $request->user('api')
            );

        return $this->successResponse(
            [
                'two_factor' => $status,
            ],
            'Two-factor authentication status retrieved successfully.'
        );
    }

    public function setup(Request $request)
    {
        $setup = $this->twoFactorService
            ->startSetup(
                $request->user('api')
            );

        return $this->successResponse(
            [
                'two_factor' => $setup,
            ],
            'Two-factor authentication setup started successfully.'
        );
    }

    public function confirm(
        ConfirmTwoFactorRequest $request
    ) {
        $result = $this->twoFactorService
            ->confirmSetup(
                $request->user('api'),
                $request->validated('code')
            );

        return $this->successResponse(
            [
                'two_factor' => $result,
            ],
            'Two-factor authentication enabled successfully.'
        );
    }

    public function disable(
        DisableTwoFactorRequest $request
    ) {
        $this->twoFactorService
            ->disable(
                $request->user('api'),
                $request->validated('code')
            );

        return $this->successResponse(
            null,
            'Two-factor authentication disabled successfully.'
        );
    }

    public function regenerateRecoveryCodes(
        RegenerateRecoveryCodesRequest $request
    ) {
        $recoveryCodes = $this->twoFactorService
            ->regenerateRecoveryCodes(
                $request->user('api'),
                $request->validated('code')
            );

        return $this->successResponse(
            [
                'recovery_codes' => $recoveryCodes,
            ],
            'Recovery codes regenerated successfully.'
        );
    }
}
