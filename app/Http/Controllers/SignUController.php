<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class SignUController extends Controller
{
    public function showSignUp()
    {
        return view('pages.auth.signup');
    }

    public function processSignUp(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'school_id'  => 'required|string|max:50|unique:users,school_id',
            'user_type'  => 'required|in:student,faculty,staff',
            'department' => 'required|string',
            'email'      => 'required|email|unique:users,email',
            'contact'    => 'nullable|string|max:20',
            'password'   => 'required|min:8|confirmed',
        ]);

        try {
            User::create([
                'first_name' => $validated['first_name'],
                'last_name'  => $validated['last_name'],
                'school_id'  => $validated['school_id'],
                'user_type'  => $validated['user_type'],
                'department' => $validated['department'],
                'email'      => $validated['email'],
                'contact'    => $validated['contact'],
                'password'   => Hash::make($validated['password']),
            ]);

            return redirect()->route('sign_in')->with('success', 'Account created! Please sign in.');
            
        } catch (\Exception $e) {
            Log::error("Signup Error: " . $e->getMessage());
            return back()->withInput()->with('error', 'Database Error: ' . $e->getMessage());
        }
    }
}