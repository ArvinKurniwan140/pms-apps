<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\Comment;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TaskCommentController extends Controller
{
    public function store(Request $request, Task $task)
    {
        $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'content' => 'required_without:attachments|string|nullable',
            'attachments.*' => 'file|max:10240' // 10MB max per file
        ]);

        $comment = Comment::create([
            'task_id' => $request->task_id,
            'user_id' => auth()->id(),
            'content' => $request->content
        ]);

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $filename = Str::random(20) . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('attachments', $filename, 'public');

                $comment->attachments()->create([
                    'filename' => $filename,
                    'original_name' => $file->getClientOriginalName(),
                    'file_size' => $file->getSize(),
                    'file_type' => $file->getMimeType(),
                    'path' => $path,
                    'user_id' => auth()->id(),
                    'attachable_type' => get_class($comment), // Ini akan otomatis mengisi 'App\Models\Comment'
                    'attachable_id' => $comment->id
                ]);
            }
        }

        $comment->load(['user', 'attachments']);

        return response()->json([
            'success' => true,
            'comment' => $comment
        ]);
    }

    public function update(Request $request, Task $task, Comment $comment)
    {
        if ($comment->user_id !== auth()->id()) {
            return response()->json(['error' => 'You can only edit your own comments'], 403);
        }

        $request->validate([
            'content' => 'required|string',
        ]);

        $comment->update([
            'content' => $request->content,
        ]);

        return response()->json(['success' => true, 'comment' => $comment]);
    }

    public function destroy(Task $task, Comment $comment)
    {
        if ($comment->user_id !== auth()->id()) {
            return response()->json(['error' => 'You can only delete your own comments'], 403);
        }

        // Delete attachments from storage
        $comment->attachments->each(function ($attachment) {
            Storage::disk('public')->delete($attachment->path);
            $attachment->delete();
        });

        $comment->delete();

        return response()->json(['success' => true]);
    }
}