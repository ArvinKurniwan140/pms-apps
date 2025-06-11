<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use App\Models\User;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tasks = Task::with(['project', 'assignee', 'creator', 'comments'])->get();

        return Inertia::render('Task/Index', [
            'tasks' => $tasks,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('assign tasks');
        $projects = Project::all();
        $users = User::all();

        return Inertia::render('Task/Create', [
            'projects' => $projects,
            'users' => $users,
        ]);
    }
    /**
     * Store a newly created resource in storage.
     */
   public function store(StoreTaskRequest $request)
{
    $this->authorize('assign tasks');
    $validated = $request->validated();
    $validated['created_by'] = Auth::id();
    
    // Set a default project_id if not provided
    if (!isset($validated['project_id'])) {
        $validated['project_id'] = 1; // or some default project ID
        // or set to null if allowed:
        // $validated['project_id'] = null;
    }

    Task::create($validated);

    return redirect()->route('tasks.index')->with('success', 'Task created successfully.');
}

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        $task->load(['project', 'assignee', 'creator', 'comments']);

        return Inertia::render('Task/Show', [
            'task' => $task,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
        {
        $projects = Project::all();
        $users = User::all();

        return Inertia::render('Task/Edit', [
            'task' => $task,
            'projects' => $projects,
            'users' => $users,
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
   {
        try {
            // Validasi data yang masuk
            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|nullable|string',
                'priority' => 'sometimes|required|in:low,medium,high',
                'status' => 'sometimes|required|in:todo,in_progress,done',
                'due_date' => 'sometimes|nullable|date',
                'project_id' => 'sometimes|nullable|exists:projects,id',
                'assignee_id' => 'sometimes|nullable|exists:users,id',
            ]);

            // Update task
            $task->update($validated);

            // Reload relationships untuk response
            $task->load(['project', 'assignee', 'creator', 'comments.user']);

            // Return response sesuai request type
            if ($request->wantsJson() || $request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Task updated successfully',
                    'task' => $task
                ]);
            }

            // Untuk Inertia request
            return redirect()->route('tasks.index')
                ->with('success', 'Task updated successfully.');

        } catch (\Exception $e) {
            Log::error('Task update error: ' . $e->getMessage());

            if ($request->wantsJson() || $request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to update task',
                    'error' => $e->getMessage()
                ], 500);
            }

            return back()->withErrors(['error' => 'Failed to update task: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
   {
        $task->delete();

        return redirect()->route('tasks.index')->with('success', 'Task deleted successfully.');
    }
}
