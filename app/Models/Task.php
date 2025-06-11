<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'project_id', 'title', 'description', 'assigned_to', 'priority', 'status', 'due_date', 'created_by',
    ];

    // RELATIONS
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
    public function attachments()
    {
    return $this->morphMany(Attachment::class, 'attachable');
    }
}
