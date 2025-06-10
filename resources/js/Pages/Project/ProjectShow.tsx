import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Project } from '@/types';

interface Props {
    project: Project;
    can: {
        edit: boolean;
        delete: boolean;
        add_task: boolean;
    };
}

const ProjectShow = ({ project, can }: Props) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'on_hold': return 'bg-yellow-100 text-yellow-800';
            case 'planning': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {project.name}
                </h2>
            }
        >
            <Head title={project.name} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{project.name}</h2>
                                    <p className="text-gray-600 mt-2">{project.description}</p>
                                </div>
                                <div className="flex space-x-2">
                                    {can.edit && (
                                        <Link
                                            href={`/projects/${project.id}/edit`}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            Edit Project
                                        </Link>
                                    )}
                                    {can.add_task && (
                                        <Link
                                            href={`/tasks/create?project_id=${project.id}`}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            Add Task
                                        </Link>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-sm font-medium text-gray-700">Status</h3>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                                            {project.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-sm font-medium text-gray-700">Start Date</h3>
                                        <span className="text-sm text-gray-600">{formatDate(project.start_date)}</span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-sm font-medium text-gray-700">End Date</h3>
                                        <span className="text-sm text-gray-600">
                                            {project.end_date ? formatDate(project.end_date) : 'Not set'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Progress</h3>
                                    <div className="flex items-center">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className="bg-blue-600 h-2.5 rounded-full"
                                                style={{ width: `${project.progress || 0}%` }}
                                            ></div>
                                        </div>
                                        <span className="ml-2 text-sm text-gray-600">{project.progress || 0}%</span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Tasks</h3>
                                    <p className="text-2xl font-semibold text-gray-900">{project.tasks?.length || 0}</p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Team Members</h3>
                                    <p className="text-2xl font-semibold text-gray-900">{project.members?.length || 0}</p>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h3>
                                {project.members && project.members.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {project.members.map((member) => (
                                            <div key={member.id} className="bg-gray-50 p-4 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="text-blue-600 text-xl">👤</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                                                        <p className="text-xs text-gray-500">{member.email}</p>
                                                        <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 p-8 text-center rounded-lg">
                                        <p className="text-gray-500">No team members assigned to this project.</p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks</h3>
                                {project.tasks && project.tasks.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {project.tasks.map((task) => (
                                                    <tr key={task.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">{task.title}</div>
                                                            <div className="text-sm text-gray-500">{task.description}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                                                                {task.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {task.assignee || 'Unassigned'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {task.due_date ? formatDate(task.due_date) : 'Not set'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <Link
                                                                href={`/tasks/${task.id}`}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                View
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 p-8 text-center rounded-lg">
                                        <p className="text-gray-500 mb-4">No tasks found for this project.</p>
                                        {can.add_task && (
                                            <Link
                                                href={`/tasks/create?project_id=${project.id}`}
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                            >
                                                Create First Task
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ProjectShow;