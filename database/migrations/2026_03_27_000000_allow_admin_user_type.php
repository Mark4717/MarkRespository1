<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        DB::statement("
            ALTER TABLE users
            MODIFY COLUMN user_type ENUM('student', 'faculty', 'staff', 'admin')
            NOT NULL DEFAULT 'student'
        ");
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        DB::statement("UPDATE users SET user_type = 'staff' WHERE user_type = 'admin'");

        DB::statement("
            ALTER TABLE users
            MODIFY COLUMN user_type ENUM('student', 'faculty', 'staff')
            NOT NULL DEFAULT 'student'
        ");
    }
};
