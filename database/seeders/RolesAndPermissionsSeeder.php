<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            'manage-users',
            'create-project',
            'update-project',
            'delete-project',
            'assign-tasks',
            'update-tasks',
            'comment-tasks',
            'view-dashboard',
            'view-projects',
            'view-tasks',
            'create-tasks',
            'delete-tasks',
            'manage-project-members',
            'view-reports',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        $projectManagerRole = Role::create(['name' => 'project-manager']);
        $projectManagerRole->givePermissionTo([
            'create-project',
            'update-project',
            'assign-tasks',
            'update-tasks',
            'comment-tasks',
            'view-dashboard',
            'view-projects',
            'view-tasks',
            'create-tasks',
            'delete-tasks',
            'manage-project-members',
            'view-reports',
        ]);

        $teamMemberRole = Role::create(['name' => 'team-member']);
        $teamMemberRole->givePermissionTo([
            'update-tasks',
            'comment-tasks',
            'view-dashboard',
            'view-projects',
            'view-tasks',
        ]);

        // Create default users
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@pms.com',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('admin');

        $manager = User::create([
            'name' => 'Project Manager',
            'email' => 'manager@pms.com',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);
        $manager->assignRole('project-manager');

        $member1 = User::create([
            'name' => 'Team Member 1',
            'email' => 'member1@pms.com',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);
        $member1->assignRole('team-member');

        $member2 = User::create([
            'name' => 'Team Member 2',
            'email' => 'member2@pms.com',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);
        $member2->assignRole('team-member');
    
    }
}
