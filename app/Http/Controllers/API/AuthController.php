<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        DB::beginTransaction();

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            // Assign default role
            $user->assignRole('Team Member');

            // Generate token
            $token = JWTAuth::fromUser($user);

            DB::commit(); // PASTIKAN INI DIPANGGIL SEBELUM RESPONSE

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'data' => [
                    'user' => new UserResource($user->load('roles')),
                    'token' => $token,
                    'token_type' => 'bearer',
                    'expires_in' => config('jwt.ttl') * 60,
                ]
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            // Tambahkan logging detail
            \Log::error('Registration Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'input' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ], 401);
            }

            $user = User::find(auth()->id());

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'user' => new UserResource($user->load('roles')),
                    'token' => $token,
                    'token_type' => 'bearer',
                    'expires_in' => config('jwt.ttl') * 60,
                ]
            ]);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Could not create token',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function me(): JsonResponse
    {
        try {
            $user = auth()->user();

            return response()->json([
                'success' => true,
                'data' => ($user instanceof \App\Models\User) ? new UserResource($user->load('roles')) : null
            ]);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token invalid',
                'error' => $e->getMessage()
            ], 401);
        }
    }

    public function logout(): JsonResponse
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());

            return response()->json([
                'success' => true,
                'message' => 'Successfully logged out'
            ]);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to logout',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function refresh(): JsonResponse
    {
        try {
            $token = JWTAuth::refresh(JWTAuth::getToken());

            return response()->json([
                'success' => true,
                'message' => 'Token refreshed successfully',
                'data' => [
                    'token' => $token,
                    'token_type' => 'bearer',
                    'expires_in' => config('jwt.ttl') * 60,
                ]
            ]);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token cannot be refreshed',
                'error' => $e->getMessage()
            ], 401);
        }
    }

    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = auth()->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect'
            ], 400);
        }

        $user->password = Hash::make($request->new_password);
        if ($user instanceof \App\Models\User) {
            $user->save();
        } else {
            return response()->json([
                'success' => false,
                'message' => 'User not found or invalid user instance'
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully'
        ]);
    }
}