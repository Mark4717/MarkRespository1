<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Check if column exists before dropping to avoid errors
            if (Schema::hasColumn('users', 'name')) {
                $table->dropColumn('name');
            }

            $table->string('first_name')->after('id');
            $table->string('last_name')->after('first_name');
            $table->string('school_id')->unique()->after('last_name');
            $table->enum('user_type', ['student', 'faculty', 'staff', 'admin'])->default('student')->after('school_id');
            $table->string('department')->after('user_type');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('name')->nullable();
            $table->dropColumn(['first_name', 'last_name', 'school_id', 'user_type', 'department']);
        });
    }
};