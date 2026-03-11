<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class SignController extends Controller
{
    public function showSignin(){
       return view('pages.auth.sign_in',[
         'page_name' => 'SignIn.com'
       ]);
    }
}
