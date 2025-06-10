import React from 'react';
import { useForm, Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Props {
    project?: {
        id?: number;
        name: string;
        description: string;
        start_date: string;
        end_date?: string;
        status: string;
    };
    statusOptions: string[];
}

const ProjectForm = ({ project, statusOptions }: Props) => {
    const { data, setData, post, put, processing, errors } = useForm({
        name: project?.name || '',
        description: project?.description || '',
        start_date: project?.start_date || '',
        end_date: project?.end_date || '',
        status: project?.status || 'planning',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (project?.id) {
            put(`/projects/${project.id}`);
        } else {
            post('/projects');
        }
    };

    const handleCancel = () => {
        router.visit('/projects');
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {project?.id ? 'Edit Project' : 'Create Project'}
                </h2>
            }
        >
            <Head title={project?.id ? 'Edit Project' : 'Create Project'} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                {project?.id ? 'Edit Project' : 'Create New Project'}
                            </h2>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Project Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    {errors.description && (
                                        <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                                            Start Date
                                        </label>
                                        <input
                                            id="start_date"
                                            type="date"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            required
                                        />
                                        {errors.start_date && (
                                            <p className="mt-2 text-sm text-red-600">{errors.start_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                                            End Date (Optional)
                                        </label>
                                        <input
                                            id="end_date"
                                            type="date"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            min={data.start_date}
                                        />
                                        {errors.end_date && (
                                            <p className="mt-2 text-sm text-red-600">{errors.end_date}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                    >
                                        {statusOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.status && (
                                        <p className="mt-2 text-sm text-red-600">{errors.status}</p>
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        {processing ? 'Saving...' : 'Save Project'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ProjectForm;