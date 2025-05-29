<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index(Request $request)
    {
        $user = auth()->user(); // Ambil user dari request
    
        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->roles,
                    'permissions' => $user->permissions,
                ]
            ]
        ]);
    }
}
