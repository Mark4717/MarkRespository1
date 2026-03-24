<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\IndexController;
use App\Http\Controllers\SignController;
use App\Http\Controllers\SignUController;
use App\Http\Controllers\ForgotController;
use App\Http\Controllers\DashboardController;

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