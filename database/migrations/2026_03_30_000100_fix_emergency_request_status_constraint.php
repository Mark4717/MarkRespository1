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

        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            DB::statement("
                ALTER TABLE emergency_requests
                MODIFY COLUMN status ENUM('Pending', 'Received', 'In Treatment', 'Completed', 'Cancelled')
                NOT NULL DEFAULT 'Pending'
            ");
        }

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE emergency_requests DROP CONSTRAINT IF EXISTS emergency_requests_status_check');
            DB::statement("ALTER TABLE emergency_requests ADD CONSTRAINT emergency_requests_status_check CHECK (status IN ('Pending', 'Received', 'In Treatment', 'Completed', 'Cancelled'))");
        }
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

        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            DB::statement("
                ALTER TABLE emergency_requests
                MODIFY COLUMN status ENUM('Pending', 'Responding', 'Resolved', 'Cancelled')
                NOT NULL DEFAULT 'Pending'
            ");
        }

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE emergency_requests DROP CONSTRAINT IF EXISTS emergency_requests_status_check');
            DB::statement("ALTER TABLE emergency_requests ADD CONSTRAINT emergency_requests_status_check CHECK (status IN ('Pending', 'Responding', 'Resolved', 'Cancelled'))");
        }
    }
};
