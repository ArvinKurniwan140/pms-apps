<?php

namespace App\Http\Controllers;

use App\Models\project_member;
use App\Http\Requests\Storeproject_memberRequest;
use App\Http\Requests\Updateproject_memberRequest;
use App\Models\Project;
use App\Models\User;

class ProjectMemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Storeproject_memberRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(project_member $project_member)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(project_member $project_member)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Updateproject_memberRequest $request, project_member $project_member)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project, User $member)
    {
        // Authorization check
        $this->authorize('removeMember', $project);

        // Hapus member dari project
        $project->members()->detach($member->id);

        return back()->with('success', 'Member removed successfully');
    }
}