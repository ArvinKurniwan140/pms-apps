<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    use HasFactory;
    protected $fillable = [
        'filename',
        'original_name',
        'file_size',
        'file_type',
        'path',
        'attachable_id',
        'attachable_type',
        'user_id'
    ];

    public function attachable()
    {
        return $this->morphTo();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getPathAttribute()
    {
        return $this->attributes['path'] ?? null;
    }

    public function getMimeTypeAttribute()
    {
        return $this->attributes['file_type'] ?? null;
    }
}