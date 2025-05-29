import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Link } from '@inertiajs/react';
import { 
    Calendar, 
    CheckSquare, 
    Clock, 
    Users, 
    FolderOpen, 
    TrendingUp, 
    Bell,
    Plus,
    Filter,
    Search,
    BarChart3,
    Activity,
    Target,
    AlertCircle
} from 'lucide-react';

export default function Dashboard({ auth }: PageProps) {
    // Remove useAuth hook - use only Inertia's auth prop
    const [dashboardData, setDashboardData] = useState({
        projects: { total: 12, active: 8, completed: 4 },
        tasks: { total: 47, todo: 15, inProgress: 18, done: 14 },
        team: { members: 24, online: 12 },
        notifications: 5
    });

    const [recentProjects] = useState([
        { id: 1, name: 'E-Commerce Redesign', progress: 75, status: 'In Progress', deadline: '2025-06-15', team: 5 },
        { id: 2, name: 'Mobile App Development', progress: 45, status: 'In Progress', deadline: '2025-07-01', team: 8 },
        { id: 3, name: 'Website Optimization', progress: 90, status: 'Near Completion', deadline: '2025-06-05', team: 3 },
        { id: 4, name: 'Database Migration', progress: 100, status: 'Completed', deadline: '2025-05-20', team: 4 }
    ]);

    const [recentTasks] = useState([
        { id: 1, title: 'Design user interface mockups', project: 'E-Commerce Redesign', status: 'In Progress', priority: 'High', assignee: 'Sarah Johnson' },
        { id: 2, title: 'Implement authentication system', project: 'Mobile App Development', status: 'To Do', priority: 'Medium', assignee: 'Mike Chen' },
        { id: 3, title: 'Optimize database queries', project: 'Website Optimization', status: 'Done', priority: 'High', assignee: 'Alex Rodriguez' },
        { id: 4, title: 'Write API documentation', project: 'Database Migration', status: 'In Progress', priority: 'Low', assignee: 'Emma Wilson' }
    ]);

    // Remove client-side auth check - Laravel middleware should handle this
    const currentUser = auth?.user;

    // If no user (shouldn't happen with proper middleware), show error
    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg mb-6">Authentication required</p>
                    <Link 
                        href="/login"
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    const isAdmin = currentUser.roles?.includes('admin');
    const isProjectManager = currentUser.roles?.includes('project manager');

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'To Do': return 'bg-gray-100 text-gray-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            case 'Done': return 'bg-green-100 text-green-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Near Completion': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'border-l-red-500 bg-red-50';
            case 'Medium': return 'border-l-yellow-500 bg-yellow-50';
            case 'Low': return 'border-l-green-500 bg-green-50';
            default: return 'border-l-gray-500 bg-gray-50';
        }
    };

    return (
        <AuthenticatedLayout
            user={currentUser}
            
        >
            <Head title="Dashboard" />

            <div className="py-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Welcome back, {currentUser.name}! 👋
                                </h1>
                                <p className="text-gray-600 text-lg">
                                    Here's what's happening with your projects today
                                </p>
                            </div>
                            <div className="hidden md:block">
                                <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Today</p>
                                        <p className="text-xl font-semibold text-gray-900">
                                            {new Date().toLocaleDateString('en-US', { 
                                                weekday: 'long', 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })}
                                        </p>
                                    </div>
                                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                        <Calendar className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Projects</p>
                                    <p className="text-3xl font-bold text-gray-900">{dashboardData.projects.total}</p>
                                    <p className="text-sm text-green-600 mt-1">
                                        <TrendingUp className="inline w-4 h-4 mr-1" />
                                        {dashboardData.projects.active} active
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                                    <FolderOpen className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                                    <p className="text-3xl font-bold text-gray-900">{dashboardData.tasks.total}</p>
                                    <p className="text-sm text-blue-600 mt-1">
                                        <Activity className="inline w-4 h-4 mr-1" />
                                        {dashboardData.tasks.inProgress} in progress
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                                    <CheckSquare className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Team Members</p>
                                    <p className="text-3xl font-bold text-gray-900">{dashboardData.team.members}</p>
                                    <p className="text-sm text-purple-600 mt-1">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                            {dashboardData.team.online} online
                                        </div>
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                    <Users className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {Math.round((dashboardData.tasks.done / dashboardData.tasks.total) * 100)}%
                                    </p>
                                    <p className="text-sm text-orange-600 mt-1">
                                        <Target className="inline w-4 h-4 mr-1" />
                                        {dashboardData.tasks.done} completed
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                                    <BarChart3 className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Projects */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">Recent Projects</h3>
                                    <Link href="/projects" className="text-indigo-600 hover:text-indigo-700 font-medium">
                                        View All
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {recentProjects.map((project) => (
                                        <div key={project.id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-semibold text-gray-900">{project.name}</h4>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                                    {project.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                    <span className="flex items-center">
                                                        <Users className="w-4 h-4 mr-1" />
                                                        {project.team} members
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Clock className="w-4 h-4 mr-1" />
                                                        Due {new Date(project.deadline).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${project.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Task Overview */}
                        <div>
                            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Task Overview</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
                                            <span className="text-gray-700">To Do</span>
                                        </div>
                                        <span className="font-semibold text-gray-900">{dashboardData.tasks.todo}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                                            <span className="text-gray-700">In Progress</span>
                                        </div>
                                        <span className="font-semibold text-gray-900">{dashboardData.tasks.inProgress}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                                            <span className="text-gray-700">Done</span>
                                        </div>
                                        <span className="font-semibold text-gray-900">{dashboardData.tasks.done}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                                <div className="space-y-3">
                                    {(isAdmin || isProjectManager) && (
                                        <button className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                                            <Plus className="w-4 h-4" />
                                            <span>Create Project</span>
                                        </button>
                                    )}
                                    <button className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
                                        <CheckSquare className="w-4 h-4" />
                                        <span>Add Task</span>
                                    </button>
                                    <button className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors">
                                        <Users className="w-4 h-4" />
                                        <span>Invite Team</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Tasks */}
                    <div className="mt-8">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Recent Tasks</h3>
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input 
                                            type="text" 
                                            placeholder="Search tasks..."
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                        <Filter className="w-4 h-4" />
                                        <span>Filter</span>
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {recentTasks.map((task) => (
                                    <div key={task.id} className={`border-l-4 p-4 rounded-lg ${getPriorityColor(task.priority)}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold text-gray-900">{task.title}</h4>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                                {task.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-gray-600">
                                            <div className="flex items-center space-x-4">
                                                <span>{task.project}</span>
                                                <span>•</span>
                                                <span>{task.assignee}</span>
                                            </div>
                                            <span className="text-xs font-medium text-gray-500">{task.priority} Priority</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}