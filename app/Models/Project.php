<?php
// ===== PROJECT MODEL =====
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'start_date',
        'end_date',
        'status',
        'created_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    // Status constants
    const STATUS_PLANNING = 'planning';
    const STATUS_IN_PROGRESS = 'in_progress';
    const STATUS_COMPLETED = 'completed';
    const STATUS_ON_HOLD = 'on_hold';
    const STATUS_CANCELLED = 'cancelled';

    public static function getStatuses()
    {
        return [
            self::STATUS_PLANNING => 'Planning',
            self::STATUS_IN_PROGRESS => 'In Progress',
            self::STATUS_COMPLETED => 'Completed',
            self::STATUS_ON_HOLD => 'On Hold',
            self::STATUS_CANCELLED => 'Cancelled',
        ];
    }

    // RELATIONS
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    // Fix: Use the correct relationship name
    public function members()
    {
        return $this->belongsToMany(User::class, 'project_members')
            ->withPivot('role', 'joined_at')
            ->withTimestamps();
    }

    // Alias for compatibility (if you want to keep 'users' naming)
    public function users()
    {
        return $this->members();
    }

    // ACCESSORS & MUTATORS
    public function getProgressAttribute()
    {
        // Check if counts are already loaded
        if (!isset($this->attributes['total_tasks'])) {
            $this->loadTaskCounts();
        }

        $totalTasks = $this->attributes['total_tasks'] ?? 0;
        $completedTasks = $this->attributes['completed_tasks'] ?? 0;

        if ($totalTasks === 0) {
            return 0;
        }

        return round(($completedTasks / $totalTasks) * 100);
    }

    public function scopeWithProgress($query)
    {
        return $query->withCount([
            'tasks as total_tasks',
            'tasks as completed_tasks' => function ($q) {
                $q->where('status', 'done'); // Assuming 'done' is the completed status for tasks
            }
        ]);
    }

    public function scopeForCurrentUser($query)
    {
        return $query->where('created_by', auth()->id())
            ->orWhereHas('members', function ($q) {
                $q->where('user_id', auth()->id());
            });
    }

    public function getIsOverdueAttribute()
    {
        return $this->end_date &&
            Carbon::parse($this->end_date)->isPast() &&
            $this->status !== 'completed';
    }

    public function getDaysRemainingAttribute()
    {
        if (!$this->end_date) {
            return null;
        }

        $endDate = Carbon::parse($this->end_date);
        $now = Carbon::now();

        return $endDate->diffInDays($now, false);
    }

    // SCOPES
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeOverdue($query)
    {
        return $query->where('status', 'in_progress')
            ->where('end_date', '<', now());
    }

    public function scopeForUser($query, $userId)
    {
        return $query->whereHas('members', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        });
    }

    public function getStatusLabelAttribute()
    {
        return match ($this->status) {
            'planning' => 'Planning',
            'active' => 'In Progress',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
            default => ucfirst($this->status),
        };
    }

    private function loadTaskCounts()
    {
        $counts = $this->tasks()
            ->selectRaw('
                COUNT(*) as total_tasks,
                SUM(CASE WHEN status = "done" THEN 1 ELSE 0 END) as completed_tasks
            ')
            ->first();

        $this->attributes['total_tasks'] = $counts->total_tasks ?? 0;
        $this->attributes['completed_tasks'] = $counts->completed_tasks ?? 0;
    }

    public static function getStatuses(): array
    {
        return [
            'planning',
            'active',
            'completed',
            'cancelled'
        ];
    }
}