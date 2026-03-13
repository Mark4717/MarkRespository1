<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\IndexController;
use App\Http\Controllers\SignController;
use App\Http\Controllers\SignUController;
use App\Http\Controllers\ForgotController;

// Landing Page
Route::get('/', [IndexController::class, 'index'])->name('home');

// Sign In Routes
Route::get('/signin', [SignController::class, 'showSignin'])->name('sign_in');
Route::post('/signin', [SignController::class, 'processSignin']); 

// Sign Up Routes
Route::get('/signup', [SignUController::class, 'showSignUp'])->name('signup');
Route::post('/signup', [SignUController::class, 'processSignUp']);

// Forgot Password Routes
Route::get('/forgot', [ForgotController::class, 'showForgot'])->name('forgot');


// Protected Area
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return view('dashboard'); // Create this view in resources/views/dashboard.blade.php
    })->name('dashboard');

    Route::post('/logout', [SignController::class, 'logout'])->name('logout');
});