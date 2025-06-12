import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Calendar, CheckSquare, Users, FolderOpen, AlertCircle,
    ChevronRight, Circle, AlertTriangle, Flag, Clock
} from 'lucide-react';
import ProjectStatusChart from '@/Components/ProjectStatusChart';

interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    pivot: {
        model_id: number;
        role_id: number;
        model_type: string;
    };
}

interface DashboardProps {
    auth: {
        user: {
            name: string;
            email: string;
            roles: Role[] | string[]; // Handle both object and string roles
        };
    };
    stats: {
        projects: {
            total: number;
            active: number;
            overdue: number;
        };
        tasks: {
            total: number;
            todo: number;
            overdue: number;
        };
        team: {
            members: number;
        };
    };
    recentProjects: Array<{
        id: number;
        name: string;
        status: string;
        team_count: number;
        tasks_count: number;
        days_remaining: number;
    }>;
    recentTasks: Array<{
        id: number;
        title: string;
        project_name: string;
        status: string;
        priority: string;
        due_date: string;
        is_overdue: boolean;
    }>;
    upcomingDeadlines: Array<{
        id: number;
        title: string;
        due_date: string;
        days_remaining: number;
        project_name: string;
        priority: string;
    }>;
}

export default function Dashboard({
    auth,
    stats,
    recentProjects,
    recentTasks,
    upcomingDeadlines
}: DashboardProps) {
    const currentUser = auth.user;

    // Safely handle roles whether they're objects or strings
    const userRoles = Array.isArray(currentUser.roles)
        ? currentUser.roles.map(role => typeof role === 'string' ? role : role.name)
        : [];

    const isAdmin = userRoles.includes('Admin');
    const isProjectManager = userRoles.includes('Project Manager');

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'todo': return 'bg-gray-100 text-gray-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'done': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high': return 'border-l-red-500 bg-red-50';
            case 'medium': return 'border-l-yellow-500 bg-yellow-50';
            case 'low': return 'border-l-green-500 bg-green-50';
            default: return 'border-l-gray-500 bg-gray-50';
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high': return <Flag className="w-4 h-4 text-red-500" />;
            case 'medium': return <Flag className="w-4 h-4 text-yellow-500" />;
            case 'low': return <Flag className="w-4 h-4 text-green-500" />;
            default: return <Flag className="w-4 h-4 text-gray-500" />;
        }
    };

    const formatStatus = (status: string) => {
        if (!status) return '';
        return status
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <AuthenticatedLayout user={{
            name: currentUser.name,
            email: currentUser.email || '',
            roles: userRoles // Pass the processed roles array
        }}>
            <Head title="Dashboard" />

            <div className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
                {/* Welcome Section */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                        <div className="mb-4 md:mb-0">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Welcome back, {currentUser.name}!
                            </h1>
                            <p className="text-gray-600">
                                Here's what's happening with your projects today
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm text-gray-500">Today is</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {new Date().toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="relative">
                                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-indigo-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {/* Projects Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Total Projects</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.projects.total}</p>
                                <div className="flex items-center space-x-4 mt-2">
                                    <span className="flex items-center text-sm text-blue-600">
                                        {stats.projects.active} active
                                    </span>
                                    {stats.projects.overdue > 0 && (
                                        <span className="flex items-center text-sm text-red-600">
                                            <AlertTriangle className="w-4 h-4 mr-1" />
                                            {stats.projects.overdue} overdue
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FolderOpen className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    {/* Tasks Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Total Tasks</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.tasks.total}</p>
                                <div className="flex items-center space-x-4 mt-2">
                                    <span className="flex items-center text-sm text-yellow-600">
                                        <Circle className="w-3 h-3 mr-1" />
                                        {stats.tasks.todo} to do
                                    </span>
                                    {stats.tasks.overdue > 0 && (
                                        <span className="flex items-center text-sm text-red-600">
                                            <AlertTriangle className="w-4 h-4 mr-1" />
                                            {stats.tasks.overdue} overdue
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <CheckSquare className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    {/* Team Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Team Members</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.team.members}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <ProjectStatusChart projects={recentProjects} />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Recent Projects */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Recent Projects</h3>
                                <Link
                                    href="/projects"
                                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center"
                                >
                                    View all <ChevronRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {recentProjects.length > 0 ? (
                                    recentProjects.map((project) => (
                                        <Link
                                            key={project.id}
                                            href={`/projects/${project.id}`}
                                            className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-semibold text-gray-900">{project.name}</h4>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                                    {formatStatus(project.status)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
                                                <div className="flex items-center space-x-4">
                                                    <span className="flex items-center">
                                                        <Users className="w-4 h-4 mr-1" />
                                                        {project.team_count} members
                                                    </span>
                                                    <span className="flex items-center">
                                                        <CheckSquare className="w-4 h-4 mr-1" />
                                                        {project.tasks_count} tasks
                                                    </span>
                                                    {project.days_remaining >= 0 ? (
                                                        <span className="flex items-center">
                                                            <Clock className="w-4 h-4 mr-1" />
                                                            {project.days_remaining} days left
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center text-red-600">
                                                            <AlertTriangle className="w-4 h-4 mr-1" />
                                                            Overdue
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-gray-500">
                                        No projects found
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        {/* Upcoming Deadlines */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Deadlines</h3>
                            <div className="space-y-4">
                                {upcomingDeadlines.length > 0 ? (
                                    upcomingDeadlines.map((task) => (
                                        <div
                                            key={task.id}
                                            className={`border-l-4 p-3 rounded-lg ${getPriorityColor(task.priority)}`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                                                    <p className="text-sm text-gray-600 mt-1">{task.project_name}</p>
                                                </div>
                                                {getPriorityIcon(task.priority)}
                                            </div>
                                            <div className="flex items-center justify-between mt-2 text-sm">
                                                <span className="text-gray-500">
                                                    Due {formatDate(task.due_date)}
                                                </span>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${task.days_remaining <= 3 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {task.days_remaining} days
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-gray-500">
                                        No upcoming deadlines
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Tasks */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Tasks</h3>
                            <div className="space-y-4">
                                {recentTasks.length > 0 ? (
                                    recentTasks.map((task) => (
                                        <Link
                                            key={task.id}
                                            href={`/tasks/${task.id}`}
                                            className={`block border-l-4 p-3 rounded-lg ${getPriorityColor(task.priority)} hover:bg-gray-50 transition-colors`}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-medium text-gray-900">{task.title}</h4>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                                    {formatStatus(task.status)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                                <span>{task.project_name}</span>
                                                {task.due_date && (
                                                    <span className={`flex items-center ${task.is_overdue ? 'text-red-600' : 'text-gray-500'
                                                        }`}>
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {formatDate(task.due_date)}
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-gray-500">
                                        No recent tasks
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}