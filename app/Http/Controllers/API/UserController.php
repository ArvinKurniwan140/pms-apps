<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::with('roles')->get();
        
        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    public function show(User $user): JsonResponse
    {
        $user->load('roles', 'permissions');
        
        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    public function assignRole(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'role' => 'required|string|exists:roles,name'
        ]);

        $user->syncRoles([$request->role]);

        return response()->json([
            'success' => true,
            'message' => 'Role assigned successfully',
            'data' => $user->load('roles')
        ]);
    }

    public function removeRole(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'role' => 'required|string|exists:roles,name'
        ]);

        $user->removeRole($request->role);

        return response()->json([
            'success' => true,
            'message' => 'Role removed successfully',
            'data' => $user->load('roles')
        ]);
    }

    public function getRoles(): JsonResponse
    {
        $roles = Role::with('permissions')->get();
        
        return response()->json([
            'success' => true,
            'data' => $roles
        ]);
    }
}