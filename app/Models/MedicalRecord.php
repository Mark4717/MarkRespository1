<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicalRecord extends Model
{
    protected $fillable = [
        'user_id',
        'appointment_id',
        'visit_date',
        'service_type',
        'symptoms',
        'diagnosis',
        'treatment',
        'medications',
        'notes',
        'doctor_name',
        'record_type'
    ];

    protected $casts = [
        'visit_date' => 'date'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }
}
