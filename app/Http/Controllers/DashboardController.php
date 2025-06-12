<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Get projects based on user role
        $projectsQuery = $user->hasRole('admin')
            ? Project::query()
            : Project::where('created_by', $user->id)
            ->orWhereHas('members', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            });

        // Get all projects with progress calculation
        $allProjects = $projectsQuery->withProgress()->with(['creator', 'members', 'tasks'])->get();

        // Calculate project stats
        $projectStats = [
            'total' => $allProjects->count(),
            'active' => $allProjects->where('status', 'active')->count(),
            'completed' => $allProjects->where('status', 'completed')->count(),
            'overdue' => $allProjects->filter(function ($project) {
                return $project->is_overdue;
            })->count(),
        ];

        // Get recent projects (last 5)
        $recentProjects = $allProjects->sortByDesc('updated_at')->take(5)->map(function ($project) {
            return [
                'id' => $project->id,
                'name' => $project->name,
                'progress' => $project->progress,
                'status' => $project->status,
                'deadline' => $project->end_date ? $project->end_date->format('Y-m-d') : null,
                'team_count' => $project->members->count(),
                'tasks_count' => $project->tasks->count(),
                'days_remaining' => $project->days_remaining,
            ];
        })->values();

        // Get all tasks for user's projects
        $allTaskIds = $allProjects->pluck('tasks')->flatten()->pluck('id');
        $tasksQuery = Task::whereIn('id', $allTaskIds)
            ->with(['project', 'assignee', 'creator']);

        // Calculate task stats
        $taskStats = [
            'total' => $tasksQuery->count(),
            'todo' => $tasksQuery->where('status', 'todo')->count(),
            'in_progress' => $tasksQuery->where('status', 'in_progress')->count(),
            'done' => $tasksQuery->where('status', 'done')->count(),
            'overdue' => $tasksQuery->overdue()->count(),
        ];

        // Get recent tasks (last 5)
        $recentTasks = $tasksQuery->latest()->take(5)->get()->map(function ($task) {
            return [
                'id' => $task->id,
                'title' => $task->title,
                'project_id' => $task->project_id,
                'project_name' => $task->project->name,
                'status' => $task->status,
                'priority' => $task->priority,
                'assignee_name' => $task->assignee ? $task->assignee->name : 'Unassigned',
                'due_date' => $task->due_date ? $task->due_date->format('Y-m-d') : null,
                'is_overdue' => $task->is_overdue,
            ];
        });

        // Get upcoming deadlines (next 7 days)
        $upcomingDeadlines = $tasksQuery->upcoming(7)
            ->orderBy('due_date')
            ->get()
            ->map(function ($task) {
                return [
                    'id' => $task->id,
                    'title' => $task->title,
                    'due_date' => $task->due_date ? $task->due_date->format('Y-m-d') : null,
                    'days_remaining' => $task->days_remaining,
                    'project_name' => $task->project->name,
                    'priority' => $task->priority,
                ];
            });

        // Team stats - simplified without last_active_at
        $teamStats = [
            'members' => User::count(),
            'online' => User::count(), // Menampilkan jumlah total user sebagai online
        ];

        // Chart data
        $chartData = $this->getTaskChartData($tasksQuery->get());

        $stats = [
            'projects' => $projectStats,
            'tasks' => $taskStats,
            'team' => $teamStats,
            'notifications' => 0, // Diset ke 0 karena tidak menggunakan notifikasi
        ];

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentProjects' => $recentProjects,
            'recentTasks' => $recentTasks,
            'upcomingDeadlines' => $upcomingDeadlines,
            'chartData' => $chartData,

        ]);
    }

    protected function getTaskChartData($tasks)
    {
        $months = [];
        $taskCounts = [];

        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthYear = $date->format('M Y');

            $count = $tasks->filter(function ($task) use ($date) {
                return Carbon::parse($task->created_at)->format('Y-m') === $date->format('Y-m');
            })->count();

            $months[] = $monthYear;
            $taskCounts[] = $count;
        }

        return [
            'months' => $months,
            'taskCounts' => $taskCounts,
        ];
    }
}