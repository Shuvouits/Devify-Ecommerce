<?php

namespace App\Services\TwoFactor;

use App\Models\TwoFactorAuthentication;
use App\Models\User;
use App\Repositories\TwoFactor\TwoFactorRepositoryInterface;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use PragmaRX\Google2FAQRCode\Google2FA;

class TwoFactorService
{
    public function __construct(
        private readonly TwoFactorRepositoryInterface $twoFactorRepository
    ) {
    }

    public function getStatus(User $user): array
    {
        $twoFactor = $this->twoFactorRepository
            ->findByUserId($user->id);

        return [
            'enabled' => $twoFactor?->isEnabled() ?? false,
            'confirmed' => $twoFactor?->isConfirmed() ?? false,
            'configured' => !is_null($twoFactor),
        ];
    }

    public function startSetup(User $user): array
    {
        $existing = $this->twoFactorRepository
            ->findByUserId($user->id);

        if ($existing?->isEnabled()) {
            throw ValidationException::withMessages([
                'two_factor' => [
                    'Two-factor authentication is already enabled.',
                ],
            ]);
        }

        $google2fa = $this->google2fa();

        $secret = $google2fa->generateSecretKey();

        $twoFactor = $this->twoFactorRepository
            ->createOrUpdate(
                $user,
                [
                    'secret' => $secret,
                    'recovery_codes' => null,
                    'confirmed_at' => null,
                    'enabled_at' => null,
                ]
            );

        return [
            'secret' => $twoFactor->secret,
            'qr_code' => $google2fa->getQRCodeInline(
                config('app.name', 'Devify'),
                $user->email,
                $twoFactor->secret
            ),
        ];
    }

    public function confirmSetup(
        User $user,
        string $code
    ): array {
        $twoFactor = $this->getConfiguration($user);

        if ($twoFactor->isEnabled()) {
            throw ValidationException::withMessages([
                'code' => [
                    'Two-factor authentication is already enabled.',
                ],
            ]);
        }

        if (!$this->verifySecret(
            $twoFactor->secret,
            $code
        )) {
            throw ValidationException::withMessages([
                'code' => [
                    'The verification code is invalid or has expired.',
                ],
            ]);
        }

        $recoveryCodes = $this->generateRecoveryCodes();

        $twoFactor = $this->twoFactorRepository
            ->createOrUpdate(
                $user,
                [
                    'secret' => $twoFactor->secret,
                    'recovery_codes' => $recoveryCodes,
                    'confirmed_at' => now(),
                    'enabled_at' => now(),
                ]
            );

        return [
            'enabled' => $twoFactor->isEnabled(),
            'confirmed' => $twoFactor->isConfirmed(),
            'recovery_codes' => $recoveryCodes,
        ];
    }

    public function disable(
        User $user,
        string $code
    ): void {
        $twoFactor = $this->getEnabledConfiguration(
            $user
        );

        if (!$this->verifySecret(
            $twoFactor->secret,
            $code
        )) {
            throw ValidationException::withMessages([
                'code' => [
                    'The verification code is invalid or has expired.',
                ],
            ]);
        }

        $this->twoFactorRepository
            ->deleteForUser($user);
    }

    public function regenerateRecoveryCodes(
        User $user,
        string $code
    ): array {
        $twoFactor = $this->getEnabledConfiguration(
            $user
        );

        if (!$this->verifySecret(
            $twoFactor->secret,
            $code
        )) {
            throw ValidationException::withMessages([
                'code' => [
                    'The verification code is invalid or has expired.',
                ],
            ]);
        }

        $recoveryCodes = $this->generateRecoveryCodes();

        $this->twoFactorRepository
            ->createOrUpdate(
                $user,
                [
                    'secret' => $twoFactor->secret,
                    'recovery_codes' => $recoveryCodes,
                    'confirmed_at' => $twoFactor->confirmed_at,
                    'enabled_at' => $twoFactor->enabled_at,
                ]
            );

        return $recoveryCodes;
    }

    public function verifyAuthenticationCode(
        User $user,
        string $code
    ): bool {
        $twoFactor = $this->twoFactorRepository
            ->findByUserId($user->id);

        if (
            !$twoFactor ||
            !$twoFactor->isEnabled() ||
            !$twoFactor->secret
        ) {
            return false;
        }

        return $this->verifySecret(
            $twoFactor->secret,
            $code
        );
    }

    public function consumeRecoveryCode(
        User $user,
        string $recoveryCode
    ): bool {
        $twoFactor = $this->twoFactorRepository
            ->findByUserId($user->id);

        if (
            !$twoFactor ||
            !$twoFactor->isEnabled()
        ) {
            return false;
        }

        $recoveryCodes =
            $twoFactor->recovery_codes ?? [];

        $normalizedCode =
            $this->normalizeRecoveryCode(
                $recoveryCode
            );

        $matchedIndex = null;

        foreach ($recoveryCodes as $index => $storedCode) {
            if (
                hash_equals(
                    $this->normalizeRecoveryCode(
                        $storedCode
                    ),
                    $normalizedCode
                )
            ) {
                $matchedIndex = $index;
                break;
            }
        }

        if (is_null($matchedIndex)) {
            return false;
        }

        unset(
            $recoveryCodes[$matchedIndex]
        );

        $this->twoFactorRepository
            ->createOrUpdate(
                $user,
                [
                    'secret' => $twoFactor->secret,
                    'recovery_codes' => array_values(
                        $recoveryCodes
                    ),
                    'confirmed_at' => $twoFactor->confirmed_at,
                    'enabled_at' => $twoFactor->enabled_at,
                ]
            );

        return true;
    }

    private function getConfiguration(
        User $user
    ): TwoFactorAuthentication {
        $twoFactor = $this->twoFactorRepository
            ->findByUserId($user->id);

        if (
            !$twoFactor ||
            !$twoFactor->secret
        ) {
            throw ValidationException::withMessages([
                'two_factor' => [
                    'Two-factor authentication setup has not been started.',
                ],
            ]);
        }

        return $twoFactor;
    }

    private function getEnabledConfiguration(
        User $user
    ): TwoFactorAuthentication {
        $twoFactor = $this->getConfiguration(
            $user
        );

        if (!$twoFactor->isEnabled()) {
            throw ValidationException::withMessages([
                'two_factor' => [
                    'Two-factor authentication is not enabled.',
                ],
            ]);
        }

        return $twoFactor;
    }

    private function verifySecret(
        string $secret,
        string $code
    ): bool {
        $code = preg_replace(
            '/\D/',
            '',
            $code
        );

        if (
            !$code ||
            strlen($code) !== 6
        ) {
            return false;
        }

        return $this->google2fa()
            ->verifyKey(
                $secret,
                $code
            );
    }

    private function generateRecoveryCodes(): array
    {
        return collect(
            range(1, 8)
        )
            ->map(
                fn () =>
                    strtoupper(
                        Str::random(5)
                    )
                    . '-'
                    . strtoupper(
                        Str::random(5)
                    )
            )
            ->values()
            ->all();
    }

    private function normalizeRecoveryCode(
        string $code
    ): string {
        return strtoupper(
            preg_replace(
                '/[^A-Za-z0-9]/',
                '',
                trim($code)
            )
        );
    }

    private function google2fa(): Google2FA
    {
        return new Google2FA();
    }
}
