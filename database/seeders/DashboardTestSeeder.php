<?php

// File: database/seeders/DashboardTestSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Project;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DashboardTestSeeder extends Seeder
{
    public function run()
    {
        // Create roles if they don't exist
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $pmRole = Role::firstOrCreate(['name' => 'project manager']);
        $memberRole = Role::firstOrCreate(['name' => 'member']);

        // Create test users
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'last_active_at' => now(),
        ]);
        $admin->assignRole('admin');

        $pm = User::create([
            'name' => 'Project Manager',
            'email' => 'pm@example.com',
            'password' => Hash::make('password'),
            'last_active_at' => now()->subMinutes(5),
        ]);
        $pm->assignRole('project manager');

        $users = [];
        for ($i = 1; $i <= 5; $i++) {
            $user = User::create([
                'name' => "Team Member $i",
                'email' => "member$i@example.com",
                'password' => Hash::make('password'),
                'last_active_at' => rand(0, 1) ? now()->subMinutes(rand(1, 30)) : now()->subHours(rand(1, 48)),
            ]);
            $user->assignRole('member');
            $users[] = $user;
        }

        // Create test projects
        $projects = [];
        for ($i = 1; $i <= 6; $i++) {
            $project = Project::create([
                'name' => "Project Alpha $i",
                'description' => "Description for project $i",
                'start_date' => now()->subDays(rand(30, 90)),
                'end_date' => now()->addDays(rand(10, 60)),
                'status' => collect(['in_progress', 'completed', 'planning'])->random(),
                'created_by' => $pm->id,
                'progress' => rand(0, 100),
            ]);

            // Attach random team members to project
            $randomUsers = collect([$admin, $pm, ...$users])->random(rand(2, 4));
            foreach ($randomUsers as $user) {
                $project->members()->attach($user->id, [
                    'role' => $user->id === $pm->id ? 'manager' : 'member',
                    'joined_at' => now()->subDays(rand(1, 30)),
                ]);
            }

            $projects[] = $project;
        }

        // Create test tasks
        foreach ($projects as $project) {
            for ($i = 1; $i <= rand(5, 15); $i++) {
                $assignedUser = $project->members->random();

                Task::create([
                    'project_id' => $project->id,
                    'title' => "Task $i for {$project->name}",
                    'description' => "Description for task $i",
                    'assigned_to' => $assignedUser->id,
                    'priority' => collect(['low', 'medium', 'high'])->random(),
                    'status' => collect(['todo', 'in_progress', 'done'])->random(),
                    'due_date' => rand(0, 1) ? now()->addDays(rand(-5, 30)) : null,
                    'created_by' => $pm->id,
                    'created_at' => now()->subDays(rand(1, 60)),
                ]);
            }
        }

        $this->command->info('Dashboard test data created successfully!');
        $this->command->info('Users created:');
        $this->command->info('- Admin: admin@example.com');
        $this->command->info('- PM: pm@example.com');
        $this->command->info('- Members: member1@example.com to member5@example.com');
        $this->command->info('Password for all: password');
    }
}