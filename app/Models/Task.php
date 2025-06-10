<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'title',
        'description',
        'assigned_to',
        'priority',
        'status',
        'due_date',
        'created_by',
    ];

    protected $casts = [
        'due_date' => 'datetime',
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

    // ACCESSORS
    public function getIsOverdueAttribute()
    {
        return $this->due_date &&
            Carbon::parse($this->due_date)->isPast() &&
            !in_array($this->status, ['done', 'completed']);
    }

    public function getDaysRemainingAttribute()
    {
        if (!$this->due_date) {
            return null;
        }

        return Carbon::parse($this->due_date)->diffInDays(now(), false);
    }

    public function getFormattedDueDateAttribute()
    {
        return $this->due_date ? Carbon::parse($this->due_date)->format('M d, Y') : null;
    }

    public function getFormattedPriorityAttribute()
    {
        return ucfirst($this->priority);
    }

    public function getFormattedStatusAttribute()
    {
        return str_replace('_', ' ', ucwords($this->status, '_'));
    }

    // SCOPES
    public function scopeTodo($query)
    {
        return $query->where('status', 'todo');
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    public function scopeDone($query)
    {
        return $query->where('status', 'done');
    }

    public function scopeOverdue($query)
    {
        return $query->whereNotNull('due_date')
            ->where('due_date', '<', now())
            ->whereNotIn('status', ['done', 'completed']);
    }

    public function scopeUpcoming($query, $days = 7)
    {
        return $query->whereNotNull('due_date')
            ->where('due_date', '>=', now())
            ->where('due_date', '<=', now()->addDays($days))
            ->whereNotIn('status', ['done', 'completed']);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('assigned_to', $userId);
    }

    public function scopeHighPriority($query)
    {
        return $query->where('priority', 'high');
    }

    public function scopeMediumPriority($query)
    {
        return $query->where('priority', 'medium');
    }

    public function scopeLowPriority($query)
    {
        return $query->where('priority', 'low');
    }
}