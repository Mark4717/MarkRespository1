<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Seed the application's admin user.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@clinic.edu.ph'],
            [
                'first_name' => 'Clinic',
                'last_name' => 'Administrator',
                'school_id' => 'ADMIN-001',
                'user_type' => 'admin',
                'department' => 'Clinic Administration',
                'contact' => '09123456789',
                'password' => Hash::make('admin1234'),
            ]
        );
    }
}
