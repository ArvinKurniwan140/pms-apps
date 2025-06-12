<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projectId = 1;

        $memberIds = [
            'Arvin' => 2,
            'Rizki' => 3,
            'Lutfi' => 4,
        ];

        $admin = 1;

        $now = Carbon::now();

        $project = [
            [
                'name' => 'Project Management System',
                'description' => 'Tugas besar project mata kuliah web lanjut',
                'start_date' => 30 - 05 - 2023,
                'end_date' => $now->copy()->subDays(7),
                'deadline' => $now->copy(),
                'status' => 'completed',
                'progress' => 100,
                'created_by' => $admin,
            ],
        ];

        $tasks = [
            // Task Arvin
            [
                'project_id' => $projectId,
                'title' => 'Project Initialization',
                'description' => 'Set up the project repository, Database, and development environment',
                'assigned_to' => $memberIds['Arvin'],
                'priority' => 'high',
                'status' => 'done',
                'due_date' => $now->copy()->subDays(5),
                'created_by' => $memberIds['Arvin'],
            ],
            [
                'project_id' => $projectId,
                'title' => 'Implement JWT Authentication and Spatie Permissions',
                'description' => 'Create, Setup, and Configure JWT Authentication and Spatie Permissions',
                'assigned_to' => $memberIds['Arvin'],
                'priority' => 'high',
                'status' => 'todo',
                'due_date' => $now->copy()->addDays(3),
                'created_by' => $memberIds['Arvin'],
            ],
            [
                'project_id' => $projectId,
                'title' => 'API Endpoint Development',
                'description' => 'Implement RESTful API endpoints for core functionality',
                'assigned_to' => $memberIds['Arvin'],
                'priority' => 'high',
                'status' => 'in_progress',
                'due_date' => $now->copy()->addDays(4),
                'created_by' => $memberIds['Arvin'],
            ],
            [
                'project_id' => $projectId,
                'title' => 'Project',
                'description' => 'CRUD project include permission role and add member to project',
                'assigned_to' => $memberIds['Arvin'],
                'priority' => 'high',
                'status' => 'done',
                'due_date' => $now->copy()->subDays(4),
                'created_by' => $memberIds['Arvin'],
            ],
            //Task Lutfi Perwira
            [
                'project_id' => $projectId,
                'title' => 'Dashboard Layout and Design',
                'description' => 'Design dashboard layout and navigation structure',
                'assigned_to' => $memberIds['Lutfi'],
                'priority' => 'high',
                'status' => 'done',
                'due_date' => $now->copy()->subDays(4),
                'created_by' => $memberIds['Lutfi'],
            ],
            [
                'project_id' => $projectId,
                'title' => 'Project Chart Project',
                'description' => 'Chart js for project',
                'assigned_to' => $memberIds['Lutfi'],
                'priority' => 'medium',
                'status' => 'todo',
                'due_date' => $now->copy()->subDays(1),
                'created_by' => $memberIds['Lutfi'],
            ],
            //Task Rizki Hidayatulloh
            [
                'project_id' => $projectId,
                'title' => 'Task',
                'description' => 'CRUD Task include drag and drop and file attachment',
                'assigned_to' => $memberIds['Rizki'],
                'priority' => 'high',
                'status' => 'done',
                'due_date' => $now->copy()->subDays(4),
                'created_by' => $memberIds['Rizki'],
            ],
            [
                'project_id' => $projectId,
                'title' => 'Manage User',
                'description' => 'Management User for admin',
                'assigned_to' => $memberIds['Rizki'],
                'priority' => 'high',
                'status' => 'done',
                'due_date' => $now->copy()->subDays(4),
                'created_by' => $memberIds['Rizki'],
            ],
        ];

        foreach ($project as $project) {
            Project::create($project);
        }
        foreach ($tasks as $task) {
            Task::create($task);
        }
    }
}