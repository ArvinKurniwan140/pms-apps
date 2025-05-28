import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Dashboard({ auth }: PageProps) {
    // Mock data - dalam implementasi nyata, data ini akan datang dari backend
    const stats = {
        totalProjects: 24,
        activeProjects: 18,
        completedProjects: 6,
        totalTasks: 156,
        pendingTasks: 89,
        completedTasks: 67,
        overallProgress: 72,
        todayDeadlines: 5
    };

    const recentProjects = [
        { id: 1, name: "Website Redesign", progress: 85, status: "In Progress", deadline: "2025-06-15" },
        { id: 2, name: "Mobile App Development", progress: 45, status: "In Progress", deadline: "2025-07-20" },
        { id: 3, name: "Marketing Campaign", progress: 100, status: "Completed", deadline: "2025-05-25" },
        { id: 4, name: "Database Migration", progress: 30, status: "In Progress", deadline: "2025-06-30" }
    ];

    const upcomingTasks = [
        { id: 1, title: "Review UI mockups", project: "Website Redesign", deadline: "Today", priority: "High" },
        { id: 2, title: "API Testing", project: "Mobile App", deadline: "Tomorrow", priority: "Medium" },
        { id: 3, title: "Content Review", project: "Marketing Campaign", deadline: "Jun 2", priority: "Low" },
        { id: 4, title: "Database backup", project: "Migration", deadline: "Jun 3", priority: "High" }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'text-green-600 bg-green-100';
            case 'In Progress': return 'text-blue-600 bg-blue-100';
            case 'On Hold': return 'text-yellow-600 bg-yellow-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'text-red-600 bg-red-100';
            case 'Medium': return 'text-yellow-600 bg-yellow-100';
            case 'Low': return 'text-green-600 bg-green-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
            currentRoute="dashboard"
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-sm mb-8 p-6">
                        <div className="text-white">
                            <h1 className="text-2xl font-bold mb-2">
                                Selamat datang kembali, {auth.user.name}!
                            </h1>
                            <p className="text-blue-100">
                                Berikut adalah ringkasan proyek dan tugas Anda hari ini.
                            </p>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Projects */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Total Proyek</p>
                                        <p className="text-2xl font-semibold text-gray-900">{stats.totalProjects}</p>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="flex text-sm">
                                        <span className="text-green-600">{stats.activeProjects} aktif</span>
                                        <span className="text-gray-500 mx-2">•</span>
                                        <span className="text-blue-600">{stats.completedProjects} selesai</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Total Tasks */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Total Tugas</p>
                                        <p className="text-2xl font-semibold text-gray-900">{stats.totalTasks}</p>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="flex text-sm">
                                        <span className="text-orange-600">{stats.pendingTasks} pending</span>
                                        <span className="text-gray-500 mx-2">•</span>
                                        <span className="text-green-600">{stats.completedTasks} selesai</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Overall Progress */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Progress Keseluruhan</p>
                                        <p className="text-2xl font-semibold text-gray-900">{stats.overallProgress}%</p>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${stats.overallProgress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Today's Deadlines */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Deadline Hari Ini</p>
                                        <p className="text-2xl font-semibold text-gray-900">{stats.todayDeadlines}</p>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <span className="text-sm text-red-600">Perlu perhatian segera</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Projects and Upcoming Tasks */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Projects */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Proyek Terbaru</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {recentProjects.map((project) => (
                                        <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-sm font-medium text-gray-900">{project.name}</h4>
                                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                                                    {project.status}
                                                </span>
                                            </div>
                                            <div className="mb-2">
                                                <div className="flex justify-between text-sm text-gray-500 mb-1">
                                                    <span>Progress</span>
                                                    <span>{project.progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${project.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500">Deadline: {project.deadline}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4">
                                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                        Lihat semua proyek →
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Tasks */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Tugas Mendatang</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {upcomingTasks.map((task) => (
                                        <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-medium text-gray-900 mb-1">{task.title}</h4>
                                                    <p className="text-xs text-gray-500 mb-2">{task.project}</p>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-xs text-gray-500">{task.deadline}</span>
                                                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                                                            {task.priority}
                                                        </span>
                                                    </div>
                                                </div>
                                                <input type="checkbox" className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4">
                                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                        Lihat semua tugas →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                   
                </div>
            </div>
        </AuthenticatedLayout>
    );
}