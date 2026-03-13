<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop default name if you don't want to use it
            $table->dropColumn('name');

            $table->string('first_name');
            $table->string('last_name');
            $table->string('school_id')->unique()->nullable();
            $table->enum('user_type', ['student', 'faculty', 'admin'])->default('student');
            $table->string('department')->nullable();

            // Optional: if you want email to be nullable (not recommended)
            // $table->string('email')->nullable()->change();
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