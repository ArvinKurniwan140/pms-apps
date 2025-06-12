import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
  ArrowLeft,
  Save,
  Calendar,
  User,
  AlertCircle,
  FileText,
  Briefcase,
  Target
} from 'lucide-react';

// Types
interface User {
  id: number;
  name: string;
  email: string;
}

interface Project {
  id: number;
  name: string;
  description?: string;
}

interface PageProps {
  projects: Project[];
  users: User[];
  auth: {
    user: User;
  };
  flash?: {
    success?: string;
    error?: string;
  };
  [key: string]: unknown;
}

interface FormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date: string;
  project_id: number | null;
  assigned_to: number | null;
}

const TaskCreate: React.FC = () => {
  const { projects, users, flash } = usePage<PageProps>().props;

  const { data, setData, post, processing, errors, reset } = useForm<FormData>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    due_date: '',
    project_id: null,      // ubah dari '' ke null
    assigned_to: null      // ubah dari '' ke null
  });

  // Priority options
  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-red-600' }
  ];

  // Status options
  const statusOptions = [
    { value: 'todo', label: 'Pending', color: 'text-yellow-600' },
    { value: 'in_progress', label: 'In Progress', color: 'text-blue-600' },
    { value: 'done', label: 'Completed', color: 'text-green-600' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/tasks', {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        reset();
      }
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'low':
        return 'bg-green-50 border-green-200 text-green-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <>
      <Head title="Create New Task" />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Link
                href="/tasks"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Tasks
              </Link>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Task</h1>
              <p className="mt-2 text-gray-600">Fill in the details to create a new task</p>
            </div>
          </div>

          {/* Flash Messages */}
          {flash?.success && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              {flash.success}
            </div>
          )}
          {flash?.error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {flash.error}
            </div>
          )}

          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Task Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="Enter task title..."
                  required
                  autoComplete="off"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="Enter task description..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Project and Assignee Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project */}
                <div>
                  <label htmlFor="project_id" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Project
                  </label>
                  <select
                    id="project_id"
                    value={data.project_id ?? ''}
                    onChange={(e) =>
                      setData('project_id', e.target.value ? parseInt(e.target.value) : null)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.project_id ? 'border-red-300' : 'border-gray-300'
                      }`}
                    required
                  >
                    <option value="">Select a project...</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  {errors.project_id && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.project_id}
                    </p>
                  )}
                </div>

                {/* Assignee */}
                <div>
                  <label htmlFor="assigned_to" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 mr-2" />
                    Assign to
                  </label>
                  <select
                    id="assigned_to"
                    value={data.assigned_to ?? ''}
                    onChange={(e) =>
                      setData('assigned_to', e.target.value ? parseInt(e.target.value) : null)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.assigned_to ? 'border-red-300' : 'border-gray-300'
                      }`}
                    required
                  >
                    <option value="">Select assignee...</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                  {errors.assigned_to && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.assigned_to}
                    </p>
                  )}
                </div>
              </div>

              {/* Priority and Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Priority */}
                <div>
                  <label htmlFor="priority" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Target className="w-4 h-4 mr-2" />
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={data.priority}
                    onChange={(e) => setData('priority', e.target.value as 'low' | 'medium' | 'high')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.priority ? 'border-red-300' : 'border-gray-300'
                      }`}
                  >
                    {priorityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.priority && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.priority}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Status
                  </label>
                  <select
                    id="status"
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value as 'pending' | 'in_progress' | 'completed' | 'cancelled')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.status ? 'border-red-300' : 'border-gray-300'
                      }`}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.status}
                    </p>
                  )}
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label htmlFor="due_date" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Due Date
                </label>
                <input
                  type="date"
                  id="due_date"
                  value={data.due_date}
                  onChange={(e) => setData('due_date', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.due_date ? 'border-red-300' : 'border-gray-300'
                    }`}
                />
                {errors.due_date && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.due_date}
                  </p>
                )}
              </div>

              {/* Task Preview */}
              <div className="bg-gray-50 rounded-lg p-4 border">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Task Preview</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(data.priority)}`}>
                      {data.priority.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {data.title || 'Task Title'}
                  </h4>
                  {data.description && (
                    <p className="text-gray-600 text-sm mb-3">
                      {data.description}
                    </p>
                  )}
                  {data.project_id && (
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span className="font-medium">Project:</span>
                      <span className="ml-1">
                        {projects.find(p => p.id === data.project_id)?.name || 'Selected Project'}
                      </span>
                    </div>
                  )}
                  {data.assigned_to && (
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <User className="w-4 h-4 mr-1" />
                      <span>
                        {users.find(u => u.id === data.assigned_to)?.name || 'Selected User'}
                      </span>
                    </div>
                  )}
                  {data.due_date && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(data.due_date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <Link
                  href="/tasks"
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Task
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskCreate;