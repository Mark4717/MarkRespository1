<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SignController extends Controller
{
    // Show the login page
    public function showSignin()
    {
        return view('pages.auth.sign_in', [
            'page_name' => 'Login - CHMSU Online Clinic'
        ]);
    }

    // Process the login logic
    public function processSignin(Request $request)
    {
        // 1. Validate custom input names from blade
        $request->validate([
            'uid_input_001' => 'required|string',
            'pwd_input_002' => 'required|string',
        ]);

        $loginValue = $request->input('uid_input_001');
        $password = $request->input('pwd_input_002');
        $remember = $request->has('remember');

        // 2. Determine if user entered an Email or School ID
        $fieldType = filter_var($loginValue, FILTER_VALIDATE_EMAIL) ? 'email' : 'school_id';

        // 3. Attempt Login
        if (Auth::attempt([$fieldType => $loginValue, 'password' => $password], $remember)) {
            $request->session()->regenerate();
            return redirect()->intended('/dashboard')->with('success', 'Welcome back!');
        }

        // 4. Fail: Go back with error
        return back()->withErrors([
            'uid_input_001' => 'Invalid credentials. Please try again.',
        ])->onlyInput('uid_input_001');
    }

    // Handle Logout
    public function logout(Request $request)
    {
        $redirectRoute = Auth::user()?->user_type === 'admin' ? 'admin.login' : 'sign_in';

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route($redirectRoute);
    }
}
