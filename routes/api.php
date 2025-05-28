<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Protected routes
Route::middleware(['auth:api'])->group(function () {
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
    });

    // User Management Routes (Admin only)
    Route::middleware(['permission:manage-users'])->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{user}', [UserController::class, 'show']);
        Route::post('/users/{user}/assign-role', [UserController::class, 'assignRole']);
        Route::delete('/users/{user}/remove-role', [UserController::class, 'removeRole']);
    });

    // Get roles (accessible by admin and project managers)
    Route::middleware(['role:admin,project-manager'])->group(function () {
        Route::get('/roles', [UserController::class, 'getRoles']);
    });

    // Project Routes (akan dibuat nanti)
    // Route::apiResource('projects', ProjectController::class);
});