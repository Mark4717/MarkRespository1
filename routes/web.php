<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\IndexController;
use App\Http\Controllers\SignController;
use App\Http\Controllers\SignUController;

//main
Route::get('/', [IndexController::class, 'index'])->name('home');
//login
Route::get('/signin', [SignController::class, 'showSignin'])->name('sign_in');
//signup
Route::get('/signup', [SignUController::class, 'showSignUp'])->name('signup');
