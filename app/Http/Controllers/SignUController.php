<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class SignUController extends Controller
{
    public function showSignUp(){
       return view('pages.auth.signup',[
         'page_name' => 'SignUp.com'
       ]);
    }
}
