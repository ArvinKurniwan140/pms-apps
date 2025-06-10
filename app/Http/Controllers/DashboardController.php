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

        // Calculate project stats - using correct status values
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

        // Calculate task stats from all user projects
        $allTasks = collect();
        foreach ($allProjects as $project) {
            $allTasks = $allTasks->merge($project->tasks);
        }

        $taskStats = [
            'total' => $allTasks->count(),
            'todo' => $allTasks->where('status', 'todo')->count(),
            'in_progress' => $allTasks->where('status', 'in_progress')->count(),
            'done' => $allTasks->where('status', 'done')->count(),
            'overdue' => $allTasks->filter(function ($task) {
                return $task->due_date && Carbon::parse($task->due_date)->isPast() && $task->status !== 'done';
            })->count(),
        ];

        // Team stats
        $teamStats = [
            'members' => User::count(),
            'online' => User::where('last_active_at', '>=', now()->subMinutes(15))->count(),
        ];

        // Chart data
        $chartData = $this->getTaskChartData($allTasks);

        $stats = [
            'projects' => $projectStats,
            'tasks' => $taskStats,
            'team' => $teamStats,
            // 'notifications' => $user->unreadNotifications()->count(),
        ];
        // dd($projectStats);

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentProjects' => $recentProjects,
            'recentTasks' => [], // You can implement this later
            'upcomingDeadlines' => [], // You can implement this later
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