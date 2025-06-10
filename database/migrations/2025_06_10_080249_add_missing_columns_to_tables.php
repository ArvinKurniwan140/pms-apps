<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Add missing columns to projects table
        Schema::table('projects', function (Blueprint $table) {
            if (!Schema::hasColumn('projects', 'deadline')) {
                // If you want to keep 'deadline', add it
                $table->date('deadline')->nullable()->after('end_date');
            }

            if (!Schema::hasColumn('projects', 'progress')) {
                // Add progress column if you want to store it directly
                $table->integer('progress')->default(0)->after('status');
            }
        });

        // Add missing columns to users table
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'last_active_at')) {
                $table->timestamp('last_active_at')->nullable();
            }

            if (!Schema::hasColumn('users', 'avatar_url')) {
                $table->string('avatar_url')->nullable();
            }
        });

        // Create project_members table if it doesn't exist
        if (!Schema::hasTable('project_members')) {
            Schema::create('project_members', function (Blueprint $table) {
                $table->id();
                $table->foreignId('project_id')->constrained()->onDelete('cascade');
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->string('role')->default('member'); // member, manager, etc.
                $table->timestamp('joined_at')->useCurrent();
                $table->timestamps();

                $table->unique(['project_id', 'user_id']);
            });
        }

        // Ensure tasks table has all required columns
        Schema::table('tasks', function (Blueprint $table) {
            if (!Schema::hasColumn('tasks', 'priority')) {
                $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            }
        });
    }

    public function down()
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['deadline', 'progress']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['last_active_at', 'avatar_url']);
        });

        Schema::dropIfExists('project_members');

        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn(['priority']);
        });
    }
};