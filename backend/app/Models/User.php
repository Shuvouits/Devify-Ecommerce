<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;


    /*
    |--------------------------------------------------------------------------
    | Roles
    |--------------------------------------------------------------------------
    */

    public const ROLE_ADMIN = 'admin';
    public const ROLE_CUSTOMER = 'customer';
    public const ROLE_VENDOR = 'vendor';


    /*
    |--------------------------------------------------------------------------
    | Statuses
    |--------------------------------------------------------------------------
    */

    public const STATUS_ACTIVE = 'active';
    public const STATUS_INACTIVE = 'inactive';
    public const STATUS_SUSPENDED = 'suspended';


    /*
    |--------------------------------------------------------------------------
    | Fillable
    |--------------------------------------------------------------------------
    */

    protected $fillable = [
        'name',
        'first_name',
        'last_name',
        'email',
        'phone',
        'birthday',
        'gender',
        'profile_photo_path',
        'password',
        'role',
        'status',
        'last_login_at',
    ];


    /*
    |--------------------------------------------------------------------------
    | Hidden
    |--------------------------------------------------------------------------
    */

    protected $hidden = [
        'password',
        'remember_token',
    ];


    /*
    |--------------------------------------------------------------------------
    | Casts
    |--------------------------------------------------------------------------
    */

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'birthday' => 'date',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | JWT
    |--------------------------------------------------------------------------
    */

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }


    public function getJWTCustomClaims(): array
    {
        return [];
    }


    /*
    |--------------------------------------------------------------------------
    | Social Accounts
    |--------------------------------------------------------------------------
    */

    public function socialAccounts(): HasMany
    {
        return $this->hasMany(
            SocialAccount::class
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Social Avatar
    |--------------------------------------------------------------------------
    */

    public function getSocialAvatarUrl(): ?string
    {
        $this->loadMissing(
            'socialAccounts'
        );


        $googleAccount =
            $this->socialAccounts
                ->firstWhere(
                    'provider',
                    'google'
                );


        return $googleAccount?->avatar_url;
    }


    /*
    |--------------------------------------------------------------------------
    | Full Profile Name
    |--------------------------------------------------------------------------
    */

    public function getProfileFullName(): string
    {
        $fullName =
            trim(
                collect([
                    $this->first_name,
                    $this->last_name,
                ])
                    ->filter()
                    ->implode(' ')
            );


        return $fullName !== ''
            ? $fullName
            : $this->name;
    }


    /*
    |--------------------------------------------------------------------------
    | Role Helpers
    |--------------------------------------------------------------------------
    */

    public function isAdmin(): bool
    {
        return $this->role ===
            self::ROLE_ADMIN;
    }


    public function isCustomer(): bool
    {
        return $this->role ===
            self::ROLE_CUSTOMER;
    }


    public function isVendor(): bool
    {
        return $this->role ===
            self::ROLE_VENDOR;
    }


    /*
    |--------------------------------------------------------------------------
    | Status Helper
    |--------------------------------------------------------------------------
    */

    public function isActive(): bool
    {
        return $this->status ===
            self::STATUS_ACTIVE;
    }


    public function twoFactorAuthentication(): HasOne
{
    return $this->hasOne(TwoFactorAuthentication::class);
}


}
