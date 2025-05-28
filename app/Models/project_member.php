<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class project_member extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'project_id', 'user_id', 'role', 'joined_at',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
