<?php

namespace App\Providers;

use App\Models\Project;
use App\Policies\ProjectPolicy;

// use Illuminate\Support\Facades\Gate;

use App\Models\Attachment;
use App\Policies\AttachmentPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Project::class => ProjectPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        //
    }
}