<?php

namespace App\Policies;

use App\Models\Attachment;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AttachmentPolicy
{
    use HandlesAuthorization;
    public function delete(User $user, Attachment $attachment)
    {
        // Hanya pemilik file atau admin yang bisa menghapus
        return $user->id === $attachment->user_id || $user->hasRole('admin');
    }
    /**
     * Determine whether the user can view any models.
     */
    
}
