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
            'manage users',
            'create project',
            'update project', 
            'delete project',
            'assign tasks',
            'update tasks',
            'comment tasks',
            'view dashboard',
            'view projects',
            'view tasks',
            'delete tasks', 
            'manage roles', 
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles dan assign permissions
        
        // Admin Role
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        $adminRole->syncPermissions([
            'manage users',
            'create project',
            'update project',
            'delete project',
            'comment tasks',
            'view dashboard',
            'view projects',
            'view tasks',
            'manage roles',
        ]);

        // Project Manager Role
        $projectManagerRole = Role::firstOrCreate(['name' => 'Project Manager']);
        $projectManagerRole->syncPermissions([
            'create project',
            'update project',
            'assign tasks',
            'update tasks',
            'comment tasks',
            'view dashboard',
            'view projects',
            'view tasks',
            'delete tasks',
        ]);

        // Team Member Role
        $teamMemberRole = Role::firstOrCreate(['name' => 'Team Member']);
        $teamMemberRole->syncPermissions([
            'update tasks',
            'comment tasks',
            'view dashboard',
            'view projects',
            'view tasks',
        ]);

        // Buat default users jika belum ada
        if (!User::where('email', 'admin@pms.com')->exists()) {
            $admin = User::create([
                'name' => 'Admin User',
                'email' => 'admin@pms.com',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]);
            $admin->assignRole('Admin');
        }

        if (!User::where('email', 'manager@pms.com')->exists()) {
            $manager = User::create([
                'name' => 'Project Manager',
                'email' => 'manager@pms.com', 
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]);
            $manager->assignRole('Project Manager');
        }

        if (!User::where('email', 'member1@pms.com')->exists()) {
            $member1 = User::create([
                'name' => 'Team Member 1',
                'email' => 'member1@pms.com',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]);
            $member1->assignRole('Team Member');
        }

        if (!User::where('email', 'member2@pms.com')->exists()) {
            $member2 = User::create([
                'name' => 'Team Member 2', 
                'email' => 'member2@pms.com',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]);
            $member2->assignRole('Team Member');
        }
    
    }
}
