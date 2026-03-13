<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class ForgotController extends Controller
{
    public function showForgot(){
       return view('pages.auth.forgot',[
         'page_name' => 'FORGOT PASSWORD'
       ]);
    }
}
