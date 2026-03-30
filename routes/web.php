<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;
use App\Http\Controllers\IndexController;
use App\Http\Controllers\SignController;
use App\Http\Controllers\SignUController;
use App\Http\Controllers\ForgotController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminDashboardController;

Route::get('/users', function () {
    return \App\Models\User::all();
});
// Health check
Route::get('/up', function () {
    return response('ok', 200);
});

// Temporary setup endpoint for Render free tier (remove after run)
Route::get('/setup-admin', function () {
    if (config('app.env') !== 'local' && env('APP_DEBUG', false) !== true) {
        abort(403, 'Forbidden');
    }

    try {
        // PostgreSQL check constraint update for user_type
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_user_type_check');
            DB::statement("ALTER TABLE users ADD CONSTRAINT users_user_type_check CHECK (user_type IN ('student', 'faculty', 'staff', 'admin'))");
        }

        // run pending migrations and seed admin
        Artisan::call('migrate', ['--force' => true]);
        Artisan::call('db:seed', ['--class' => 'Database\\Seeders\\AdminUserSeeder', '--force' => true]);

        return response('setup complete', 200);
    } catch (\Exception $e) {
        return response('setup failed: ' . $e->getMessage(), 500);
    }
});

// Landing Page
Route::get('/', [IndexController::class, 'index'])->name('home');

// Sign In Routes
Route::get('/signin', [SignController::class, 'showSignin'])->name('sign_in');
Route::get('/login', function () {
    return redirect()->route('sign_in');
})->name('login');
Route::post('/signin', [SignController::class, 'processSignin']); 

// Sign Up Routes
Route::get('/signup', [SignUController::class, 'showSignUp'])->name('signup');
Route::get('/register', function () {
    return redirect()->route('signup');
})->name('register');
Route::post('/signup', [SignUController::class, 'processSignUp']);

// Forgot Password Routes
Route::get('/forgot', [ForgotController::class, 'showForgot'])->name('forgot');

// Admin Sign In Routes
Route::get('/admin/signin', [AdminAuthController::class, 'showLogin'])->name('admin.login');
Route::post('/admin/signin', [AdminAuthController::class, 'login'])->name('admin.login.submit');

// Protected Area
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Dashboard AJAX endpoints
    Route::get('/dashboard/appointments', [DashboardController::class, 'getAppointments'])->name('dashboard.appointments');
    Route::get('/dashboard/medical-records', [DashboardController::class, 'getMedicalRecords'])->name('dashboard.medical-records');
    Route::get('/dashboard/emergency-requests', [DashboardController::class, 'getEmergencyRequests'])->name('dashboard.emergency-requests');
    Route::post('/dashboard/book-appointment', [DashboardController::class, 'bookAppointment'])->name('dashboard.book-appointment');
    Route::post('/dashboard/emergency', [DashboardController::class, 'submitEmergency'])->name('dashboard.emergency');
    Route::post('/dashboard/cancel-appointment', [DashboardController::class, 'cancelAppointment'])->name('dashboard.cancel-appointment');
    Route::post('/dashboard/profile', [DashboardController::class, 'updateProfile'])->name('dashboard.profile.update');

    Route::post('/logout', [SignController::class, 'logout'])->name('logout');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('/admin/dashboard/data', [AdminDashboardController::class, 'data'])->name('admin.data');
    Route::match(['patch', 'post'], '/admin/appointments/{appointment}/status', [AdminDashboardController::class, 'updateAppointmentStatus'])->name('admin.appointments.status');
    Route::match(['patch', 'post'], '/admin/emergency-requests/{emergencyRequest}/status', [AdminDashboardController::class, 'updateEmergencyStatus'])->name('admin.emergency-requests.status');
    Route::post('/admin/medical-records', [AdminDashboardController::class, 'storeMedicalRecord'])->name('admin.medical-records.store');
    Route::put('/admin/medical-records/{medicalRecord}', [AdminDashboardController::class, 'updateMedicalRecord'])->name('admin.medical-records.update');
    Route::delete('/admin/medical-records/{medicalRecord}', [AdminDashboardController::class, 'destroyMedicalRecord'])->name('admin.medical-records.destroy');
    Route::post('/admin/system/schedule', [AdminDashboardController::class, 'saveSchedule'])->name('admin.system.schedule');
    Route::post('/admin/services', [AdminDashboardController::class, 'storeService'])->name('admin.services.store');
    Route::put('/admin/services/{clinicService}', [AdminDashboardController::class, 'updateService'])->name('admin.services.update');
    Route::delete('/admin/services/{clinicService}', [AdminDashboardController::class, 'destroyService'])->name('admin.services.destroy');
});
