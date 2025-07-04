<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TaskCommentController;
use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\ProjectMemberController;
use Illuminate\Support\Facades\Storage;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->name('logout');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});
Route::get('/unauthorized', function () {
    return inertia('Unauthorized');
})->name('unauthorized');
Route::resource('projects', ProjectController::class);

Route::prefix('admin')->middleware(['auth', 'verified'])->group(function () {
    Route::resource('users', \App\Http\Controllers\Admin\UserController::class)->except(['show']);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('users', UserController::class)->middleware('can:manage users');

    // Project Routes
    Route::prefix('projects')->name('projects.')->group(function () {
        Route::get('/', [ProjectController::class, 'index'])->name('index');
        Route::get('/create', [ProjectController::class, 'create'])
            ->name('create')
            ->middleware('permission:create project');
        Route::post('/', [ProjectController::class, 'store'])
            ->name('store')
            ->middleware('permission:create project');
        Route::get('/{project}', [ProjectController::class, 'show'])->name('show');
        Route::get('/{project}/edit', [ProjectController::class, 'edit'])
            ->name('edit')
            ->middleware('permission:update project');
        Route::put('/{project}', [ProjectController::class, 'update'])
            ->name('update')
            ->middleware('permission:update project');
        Route::delete('/{project}', [ProjectController::class, 'destroy'])
            ->name('destroy')
            ->middleware('permission:delete project');

        Route::post('/{project}/members', [ProjectController::class, 'addMember'])
            ->middleware(['auth', 'role:Admin|Project Manager']);

        Route::delete('/{project}/members/{member}', [ProjectMemberController::class, 'destroy'])->name('projects.members.destroy');

        // Project Tasks
        Route::get('/{project}/tasks', [ProjectController::class, 'tasks'])->name('tasks');
        Route::get('/{project}/kanban', [ProjectController::class, 'kanban'])->name('kanban');

        // Project Settings
        Route::get('/{project}/settings', [ProjectController::class, 'settings'])
            ->name('settings')
            ->middleware('permission:update project');
        Route::put('/{project}/settings', [ProjectController::class, 'updateSettings'])
            ->name('settings.update')
            ->middleware('permission:update project');
    });

    Route::prefix('tasks')->name('tasks.')->middleware('auth')->group(function () {
        // Task List (optional: all tasks visible to user)
        Route::get('/', [TaskController::class, 'index'])->name('index');

        // Create Task
        Route::get('/create', [TaskController::class, 'create'])
            ->name('create')
            ->middleware('permission:assign tasks');
        Route::post('/', [TaskController::class, 'store'])
            ->name('store')
            ->middleware('permission:assign tasks');

        // Task Detail
        Route::get('/{task}', [TaskController::class, 'show'])->name('show');

        // Edit Task
        Route::get('/{task}/edit', [TaskController::class, 'edit'])
            ->name('edit')
            ->middleware('permission:update tasks');
        Route::put('/{task}', [TaskController::class, 'update'])
            ->name('update')
            ->middleware('permission:update tasks');
        Route::patch('/{task}', [TaskController::class, 'update'])
            ->name('patch')
            ->middleware('permission:update tasks');

        // Delete Task
        Route::delete('/{task}', [TaskController::class, 'destroy'])->name('destroy');

        // Assign & Unassign Members
        Route::post('/{task}/assign', [TaskController::class, 'assignUser'])
            ->name('assign')
            ->middleware('permission:assign tasks');
        Route::delete('/{task}/unassign/{user}', [TaskController::class, 'unassignUser'])
            ->name('unassign')
            ->middleware('permission:assign tasks');

        // Kanban View
        Route::get('/kanban', [TaskController::class, 'kanban'])->name('kanban');

        // Task Comments - CRUD Routes
        Route::post('/{task}/comments', [TaskCommentController::class, 'store'])
            ->name('comments.store');
        Route::patch('/{task}/comments/{comment}', [TaskCommentController::class, 'update'])
            ->name('comments.update');
        Route::delete('/{task}/comments/{comment}', [TaskCommentController::class, 'destroy'])
            ->name('comments.destroy');

        Route::get('/attachments/{attachment}/download', [AttachmentController::class, 'download'])
            ->name('attachments.download');
        Route::delete('/attachments/{attachment}', [AttachmentController::class, 'destroy']);
    });
});

require __DIR__ . '/auth.php';