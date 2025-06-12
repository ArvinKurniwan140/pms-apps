<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AttachmentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:20480', // Max 20MB
            'attachable_type' => 'required|in:task,comment',
            'attachable_id' => 'required|integer',
        ]);

        $file = $request->file('file');
        $filename = Str::random(20) . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('attachments', $filename, 'public');

        $attachment = Attachment::create([
            'filename' => $file->getClientOriginalName(),
            'path' => $path,
            'file_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'attachable_type' => 'App\\Models\\' . ucfirst($request->attachable_type),
            'attachable_id' => $request->attachable_id,
            'user_id' => auth()->id(),
        ]);

        return response()->json([
            'success' => true,
            'attachment' => $attachment,
        ]);
    }

    public function download(Attachment $attachment)
    {
        if (!Storage::disk('public')->exists($attachment->path)) {
            abort(404, 'File not found');
        }

        return Storage::disk('public')->download(
            $attachment->path,
            $attachment->original_name ?? $attachment->filename
        );
    }

    public function destroy(Attachment $attachment)
    {
        $this->authorize('delete', $attachment);

        Storage::disk('public')->delete($attachment->path);
        $attachment->delete();

        return response()->json(['success' => true]);
    }
}