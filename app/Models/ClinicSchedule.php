<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClinicSchedule extends Model
{
    protected $fillable = [
        'day_key',
        'day_name',
        'start_time',
        'end_time',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
