<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            DB::statement("
                ALTER TABLE users
                MODIFY COLUMN user_type ENUM('student', 'faculty', 'staff', 'admin')
                NOT NULL DEFAULT 'student'
            ");
        }

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_user_type_check');
            DB::statement("ALTER TABLE users ADD CONSTRAINT users_user_type_check CHECK (user_type IN ('student', 'faculty', 'staff', 'admin'))");
        }
    }

    public function down(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            DB::statement("UPDATE users SET user_type = 'staff' WHERE user_type = 'admin'");
            DB::statement("
                ALTER TABLE users
                MODIFY COLUMN user_type ENUM('student', 'faculty', 'staff')
                NOT NULL DEFAULT 'student'
            ");
        }

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_user_type_check');
            DB::statement("ALTER TABLE users ADD CONSTRAINT users_user_type_check CHECK (user_type IN ('student', 'faculty', 'staff'))");
        }
    }
};
