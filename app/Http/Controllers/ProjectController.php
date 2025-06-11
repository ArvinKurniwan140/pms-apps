<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Permission;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Get projects based on user role
        $projects = Auth::user()->hasRole('admin')
            ? Project::with(['creator', 'members'])->get()
            : Project::where('created_by', Auth::id())
            ->orWhereHas('members', function ($query) {
                $query->where('user_id', Auth::id());
            })
            ->with(['creator', 'members'])
            ->get();

        return Inertia::render('Project/Index', [
            'projects' => $projects->map(function ($project) {
                return [
                    'id' => $project->id,
                    'name' => $project->name,
                    'description' => $project->description,
                    'start_date' => $project->start_date->format('Y-m-d'),
                    'end_date' => $project->end_date?->format('Y-m-d'),
                    'status' => $project->status,
                    'progress' => $project->progress,
                    'created_by' => $project->creator->name,
                    'member_count' => $project->members->count(),
                    'task_count' => $project->tasks->count(),
                ];
            }),
            'can' => [
                'create' => Auth::user()->can('create project'),
                'edit' => Auth::user()->can('update project'),
                'delete' => Auth::user()->can('delete project'),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create project');

        return Inertia::render('Project/ProjectForm', [
            'statusOptions' => ['planning', 'in_progress', 'on_hold', 'completed'],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        $this->authorize('create project');

        $project = Project::create([
            'name' => $request->name,
            'description' => $request->description,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'status' => $request->status,
            'progress' => $request->progress,
            'created_by' => Auth::id(),
        ]);


        return redirect()->route('projects.index')->with('success', 'Project created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        $this->authorize('view', $project);
        $availableUsers = User::whereDoesntHave('projects', function ($q) use ($project) {
            $q->where('project_members.project_id', $project->id); // Spesifik tabel pivot
        })->get(['id', 'name', 'email']);

        $project->load(['creator', 'members', 'tasks' => function ($query) {
            $query->with(['assignee', 'creator']);
        }]);


        return Inertia::render('Project/ProjectShow', [
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
                'description' => $project->description,
                'start_date' => $project->start_date->format('Y-m-d'),
                'end_date' => $project->end_date?->format('Y-m-d'),
                'status' => $project->status,
                'progress' => $project->progress,
                'created_by' => $project->creator->name,
            ],
            'members' => $project->members->map(function ($member) {
                return [
                    'id' => $member->id,
                    'name' => $member->name,
                    'email' => $member->email,
                    'role' => $member->pivot->role,
                ];
            }),
            'availableUsers' => $availableUsers->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email
                ];
            }),
            'tasks' => $project->tasks->map(function ($task) {
                return [
                    'id' => $task->id,
                    'title' => $task->title,
                    'description' => $task->description,
                    'status' => $task->status,
                    'priority' => $task->priority,
                    'due_date' => $task->due_date?->format('Y-m-d'),
                    'assignee' => $task->assignee?->name,
                    'creator' => $task->creator->name,
                ];
            }),
            'can' => [
                'edit' => auth()->user()->can('update', $project),
                'delete' => Auth::user()->can('delete project'),
                'add_task' => Auth::user()->can('assign tasks'),
                'add_member' => auth()->user()->hasAnyRole(['Admin', 'Project Manager']),
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        $this->authorize('update project');

        return Inertia::render('Project/Edit', [
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
                'description' => $project->description,
                'start_date' => $project->start_date->format('Y-m-d'),
                'end_date' => $project->end_date?->format('Y-m-d'),
                'status' => $project->status,
            ],
            'statusOptions' => ['planning', 'in_progress', 'on_hold', 'completed'],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        $this->authorize('update project');

        $project->update([
            'name' => $request->name,
            'description' => $request->description,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'status' => $request->status,
        ]);

        return redirect()->route('projects.index')->with('success', 'Project updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $this->authorize('delete project');

        $project->delete();

        return redirect()->route('projects.index')->with('success', 'Project deleted successfully.');
    }

    public function addMember(Request $request, Project $project)
    {
        if (!auth()->user()->hasAnyRole(['Admin', 'Project Manager'])) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'role' => 'required|in:manager,member',
        ]);

        if ($project->members()->where('user_id', $request->user_id)->exists()) {
            return back()->with('error', 'User already in project!');
        }

        $project->members()->attach($request->user_id, [
            'role' => $request->role,
            'joined_at' => now()
        ]);

        return back()->with('success', 'Member added successfully!');
    }
}