<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SmtpSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'is_enabled',
        'provider',
        'host',
        'port',
        'encryption',
        'username',
        'password',
        'from_email',
        'from_name',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'is_enabled' => 'boolean',
            'password' => 'encrypted',
        ];
    }
}
