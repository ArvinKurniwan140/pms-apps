<?php
// ===== PROJECT MODEL =====
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


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

    public function members()
    {
        return $this->belongsToMany(User::class, 'project_members')
            ->withPivot('role', 'joined_at')
            ->withTimestamps();
    }

    // SCOPES
    public function scopeActive($query)
    {
        return $query->whereIn('status', [self::STATUS_PLANNING, self::STATUS_IN_PROGRESS]);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    // ACCESSORS
    public function getStatusLabelAttribute()
    {
        return self::getStatuses()[$this->status] ?? $this->status;
    }

    public function getIsActiveAttribute()
    {
        return in_array($this->status, [self::STATUS_PLANNING, self::STATUS_IN_PROGRESS]);
    }
}