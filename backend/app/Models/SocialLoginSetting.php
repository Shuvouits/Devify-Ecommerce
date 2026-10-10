<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SocialLoginSetting extends Model
{
    use HasFactory;

    public const PROVIDER_GOOGLE = 'google';

    public const PROVIDER_MICROSOFT = 'microsoft';

    public const PROVIDER_FACEBOOK = 'facebook';

    public const PROVIDER_GITHUB = 'github';


    protected $fillable = [
        'provider',
        'is_enabled',
        'client_id',
        'client_secret',
        'redirect_uri',
        'scopes',
    ];


    /*
    |--------------------------------------------------------------------------
    | Sensitive Fields
    |--------------------------------------------------------------------------
    */

    protected $hidden = [
        'client_secret',
    ];


    /*
    |--------------------------------------------------------------------------
    | Casts
    |--------------------------------------------------------------------------
    */

    protected function casts(): array
    {
        return [
            'is_enabled' => 'boolean',

            'client_secret' => 'encrypted',

            'scopes' => 'array',
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    public function isEnabled(): bool
    {
        return $this->is_enabled;
    }


    public function isGoogle(): bool
    {
        return $this->provider === self::PROVIDER_GOOGLE;
    }
}
