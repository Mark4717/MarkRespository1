<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminAuthController extends Controller
{
    public function showLogin()
    {
        if (Auth::check() && Auth::user()->user_type === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        return view('pages.auth.admin_signin', [
            'page_name' => 'Clinic Admin Portal',
        ]);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'remember' => ['nullable', 'boolean'],
        ]);

        if (! Auth::attempt([
            'email' => $validated['email'],
            'password' => $validated['password'],
            'user_type' => 'admin',
        ], (bool) ($validated['remember'] ?? false))) {
            return response()->json([
                'message' => 'Invalid admin credentials. Please try again.',
            ], 401);
        }

        $request->session()->regenerate();

        return response()->json([
            'message' => 'Login successful.',
            'redirect_url' => route('admin.dashboard'),
        ]);
    }

}
