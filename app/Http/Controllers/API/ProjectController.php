<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ProjectController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * Display a listing of projects
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            $query = Project::with(['creator', 'members', 'tasks']);

            // Filter berdasarkan role
            if ($user->hasRole('Admin')) {
                // Admin bisa melihat semua proyek
                $projects = $query->get();
            } elseif ($user->hasRole('Project Manager')) {
                // Project Manager bisa melihat proyek yang dia buat atau dia adalah member
                $projects = $query->where(function($q) use ($user) {
                    $q->where('created_by', $user->id)
                      ->orWhereHas('members', function($memberQuery) use ($user) {
                          $memberQuery->where('user_id', $user->id);
                      });
                })->get();
            } else {
                // Team Member hanya bisa melihat proyek dimana dia adalah member
                $projects = $query->whereHas('members', function($memberQuery) use ($user) {
                    $memberQuery->where('user_id', $user->id);
                })->get();
            }

            // Transform data untuk response
            $projectsData = $projects->map(function ($project) {
                return [
                    'id' => $project->id,
                    'name' => $project->name,
                    'description' => $project->description,
                    'status' => $project->status,
                    'start_date' => $project->start_date,
                    'end_date' => $project->end_date,
                    'created_by' => $project->creator->name,
                    'created_at' => $project->created_at,
                    'updated_at' => $project->updated_at,
                    'members_count' => $project->members->count(),
                    'tasks_count' => $project->tasks->count(),
                    'completed_tasks' => $project->tasks->where('status', 'done')->count(),
                    'progress' => $project->tasks->count() > 0 ? 
                        round(($project->tasks->where('status', 'done')->count() / $project->tasks->count()) * 100, 2) : 0
                ];
            });

            return response()->json([
                'status' => 'success',
                'data' => $projectsData
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch projects',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created project
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Check permission
            if (!Auth::user()->can('create project')) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized. You do not have permission to create projects.'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'in:planning,active,on_hold,completed,cancelled',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'member_ids' => 'nullable|array',
                'member_ids.*' => 'exists:users,id'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            $project = Project::create([
                'name' => $request->name,
                'description' => $request->description,
                'status' => $request->status ?? 'planning',
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'created_by' => Auth::id()
            ]);

            // Add members if provided
            if ($request->has('member_ids') && is_array($request->member_ids)) {
                $project->members()->attach($request->member_ids);
            }

            // Add creator as a member if not already included
            if (!$project->members()->where('user_id', Auth::id())->exists()) {
                $project->members()->attach(Auth::id());
            }

            DB::commit();

            $project->load(['creator', 'members', 'tasks']);

            return response()->json([
                'status' => 'success',
                'message' => 'Project created successfully',
                'data' => $project
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create project',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified project
     */
    public function show($id): JsonResponse
    {
        try {
            $user = Auth::user();
            $project = Project::with(['creator', 'members', 'tasks.assignee', 'tasks.creator'])
                             ->findOrFail($id);

            // Check if user has access to this project
            $hasAccess = false;
            if ($user->hasRole('Admin')) {
                $hasAccess = true;
            } elseif ($user->hasRole('Project Manager')) {
                $hasAccess = $project->created_by === $user->id || 
                            $project->members()->where('user_id', $user->id)->exists();
            } else {
                $hasAccess = $project->members()->where('user_id', $user->id)->exists();
            }

            if (!$hasAccess) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized to access this project'
                ], 403);
            }

            $projectData = [
                'id' => $project->id,
                'name' => $project->name,
                'description' => $project->description,
                'status' => $project->status,
                'start_date' => $project->start_date,
                'end_date' => $project->end_date,
                'created_by' => $project->creator->name,
                'created_at' => $project->created_at,
                'updated_at' => $project->updated_at,
                'members' => $project->members->map(function($member) {
                    return [
                        'id' => $member->id,
                        'name' => $member->name,
                        'email' => $member->email,
                        'roles' => $member->getRoleNames()
                    ];
                }),
                'tasks' => $project->tasks->map(function($task) {
                    return [
                        'id' => $task->id,
                        'title' => $task->title,
                        'description' => $task->description,
                        'status' => $task->status,
                        'priority' => $task->priority,
                        'due_date' => $task->due_date,
                        'assigned_to' => $task->assignee ? $task->assignee->name : null,
                        'created_by' => $task->creator->name,
                        'created_at' => $task->created_at
                    ];
                }),
                'statistics' => [
                    'total_tasks' => $project->tasks->count(),
                    'completed_tasks' => $project->tasks->where('status', 'done')->count(),
                    'in_progress_tasks' => $project->tasks->where('status', 'in_progress')->count(),
                    'todo_tasks' => $project->tasks->where('status', 'to_do')->count(),
                    'progress_percentage' => $project->tasks->count() > 0 ? 
                        round(($project->tasks->where('status', 'done')->count() / $project->tasks->count()) * 100, 2) : 0
                ]
            ];

            return response()->json([
                'status' => 'success',
                'data' => $projectData
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Project not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified project
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $user = Auth::user();
            $project = Project::findOrFail($id);

            // Check permission
            $canUpdate = false;
            if ($user->hasRole('Admin')) {
                $canUpdate = true;
            } elseif ($user->hasRole('Project Manager') && 
                     ($project->created_by === $user->id || $user->can('update project'))) {
                $canUpdate = true;
            }

            if (!$canUpdate) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized to update this project'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'sometimes|in:planning,active,on_hold,completed,cancelled',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'member_ids' => 'nullable|array',
                'member_ids.*' => 'exists:users,id'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            $project->update($request->only([
                'name', 'description', 'status', 'start_date', 'end_date'
            ]));

            // Update members if provided
            if ($request->has('member_ids')) {
                $memberIds = $request->member_ids ?? [];
                
                // Ensure creator is always a member
                if (!in_array($project->created_by, $memberIds)) {
                    $memberIds[] = $project->created_by;
                }
                
                $project->members()->sync($memberIds);
            }

            DB::commit();

            $project->load(['creator', 'members', 'tasks']);

            return response()->json([
                'status' => 'success',
                'message' => 'Project updated successfully',
                'data' => $project
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update project',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified project
     */
    public function destroy($id): JsonResponse
    {
        try {
            $project = Project::findOrFail($id);

            // Check permission - only Admin can delete projects
            if (!Auth::user()->can('delete project')) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized. Only admins can delete projects.'
                ], 403);
            }

            DB::beginTransaction();

            // Delete related data
            $project->tasks()->delete();
            $project->members()->detach();
            $project->delete();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Project deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete project',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available users to add as project members
     */
    public function getAvailableMembers(): JsonResponse
    {
        try {
            $users = User::select('id', 'name', 'email')
                         ->with('roles')
                         ->get()
                         ->map(function($user) {
                             return [
                                 'id' => $user->id,
                                 'name' => $user->name,
                                 'email' => $user->email,
                                 'roles' => $user->getRoleNames()
                             ];
                         });

            return response()->json([
                'status' => 'success',
                'data' => $users
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch users',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}