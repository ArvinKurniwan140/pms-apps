<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\Comment;
use Illuminate\Support\Facades\Storage;

class TaskCommentController extends Controller
{
    public function store(Request $request, Task $task)
    {
        $request->validate([
            'content' => 'nullable|string', // Ubah jadi nullable agar bisa kirim file saja
            'attachments.*' => 'file|max:10240', // 10MB per file
        ]);

        $comment = $task->comments()->create([
            'user_id' => auth()->id(),
            'content' => $request->content,
        ]);

        // Handle file attachments (support single/multiple)
        $attachments = $request->file('attachments', []);
        if (!is_array($attachments)) {
            $attachments = [$attachments];
        }
        foreach ($attachments as $file) {
            if ($file) {
                $path = $file->store('attachments', 'public');
                $comment->attachments()->create([
                    'filename' => $path,
                    'original_name' => $file->getClientOriginalName(),
                    'file_size' => $file->getSize(),
                    'file_type' => $file->getMimeType(),
                    'file_path' => $path,
                ]);
            }
        }

        return redirect()->back()->with('success', 'Comment added successfully');
    }

    public function update(Request $request, Task $task, Comment $comment)
    {
        // Check if user owns the comment
        if ($comment->user_id !== auth()->id()) {
            return redirect()->back()->with('error', 'You can only edit your own comments');
        }

        $request->validate([
            'content' => 'required|string',
        ]);

        $comment->update([
            'content' => $request->content,
        ]);

        return redirect()->back()->with('success', 'Comment updated successfully');
    }

    public function destroy(Task $task, Comment $comment)
    {
        // Check if user owns the comment
        if ($comment->user_id !== auth()->id()) {
            return redirect()->back()->with('error', 'You can only delete your own comments');
        }

        // Delete attachments from storage
        if ($comment->attachments) {
            foreach ($comment->attachments as $attachment) {
                Storage::disk('public')->delete($attachment->file_path);
            }
        }

        $comment->delete();

        return redirect()->back()->with('success', 'Comment deleted successfully');
    }
}