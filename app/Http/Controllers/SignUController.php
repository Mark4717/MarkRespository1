<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SignUController extends Controller
{
    public function showSignUp()
    {
        return view('pages.auth.signup');
    }

    public function processSignUp(Request $request)
    {
        // 1. Validation
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'school_id'  => 'required|string|max:50|unique:users',
            'user_type'  => 'required|in:student,faculty,admin',
            'department' => 'required|string',
            'email'      => 'required|email|unique:users',
            'password'   => 'required|min:8|confirmed',
        ]);

        // 2. Database Insert 
        User::create([
            'first_name' => $validated['first_name'],
            'last_name'  => $validated['last_name'],
            'school_id'  => $validated['school_id'],
            'user_type'  => $validated['user_type'],
            'department' => $validated['department'],
            'email'      => $validated['email'],
            'password'   => Hash::make($validated['password']),
        ]);

        return redirect('/signin')->with('success', 'Account created! Please sign in.');
    }
}