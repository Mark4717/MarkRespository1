<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            UPDATE emergency_requests
            SET status = CASE
                WHEN status = 'Responding' THEN 'Received'
                WHEN status = 'Resolved' THEN 'Completed'
                ELSE status
            END
        ");

        DB::statement("
            ALTER TABLE emergency_requests
            MODIFY status ENUM('Pending', 'Received', 'In Treatment', 'Completed', 'Cancelled')
            DEFAULT 'Pending'
        ");
    }

    public function down(): void
    {
        DB::statement("
            UPDATE emergency_requests
            SET status = CASE
                WHEN status = 'Received' THEN 'Responding'
                WHEN status = 'In Treatment' THEN 'Responding'
                WHEN status = 'Completed' THEN 'Resolved'
                ELSE status
            END
        ");

        DB::statement("
            ALTER TABLE emergency_requests
            MODIFY status ENUM('Pending', 'Responding', 'Resolved', 'Cancelled')
            DEFAULT 'Pending'
        ");
    }
};
