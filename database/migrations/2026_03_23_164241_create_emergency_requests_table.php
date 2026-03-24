<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('emergency_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('patient_name');
            $table->string('contact_number');
            $table->string('current_location');
            $table->enum('emergency_type', [
                'Medical Emergency',
                'Accident/Injury',
                'Breathing Difficulty',
                'Chest Pain',
                'Unconsciousness',
                'Severe Bleeding',
                'Severe Allergic Reaction',
                'Other'
            ]);
            $table->text('symptoms');
            $table->enum('status', ['Pending', 'Responding', 'Resolved', 'Cancelled'])->default('Pending');
            $table->text('response_notes')->nullable();
            $table->timestamp('responded_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('emergency_requests');
    }
};
