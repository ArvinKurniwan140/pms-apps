<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProjectPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    use HandlesAuthorization;

    public function view(User $user, Project $project)
    {
        return $user->id === $project->created_by ||
            $project->members()->where('user_id', $user->id)->exists();
    }

    /**
     * Determine whether the user can view the model.
     */

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        return $user->can('create project');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Project $project)
    {
        return $user->can('update project') &&
            ($user->id === $project->created_by ||
                $project->members()->where('user_id', $user->id)->where('role', 'admin')->exists());
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Project $project)
    {
        return $user->can('delete project') && $user->id === $project->created_by;
    }

    public function removeMember(User $user, Project $project)
    {
        return $user->id === $project->created_by || $user->isAdmin();
    }
}