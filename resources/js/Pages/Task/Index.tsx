import React, { useState, useCallback, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import {
  Plus,
  Calendar,
  User,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Eye,
  X,
  Save,
  MessageCircle,
  Paperclip,
  Send,
  Download,
  FileText,
  Image as ImageIcon,
  File,
  Upload
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

interface CommentAttachment {
  id: number;
  filename: string;
  original_name: string;
  file_size: number;
  file_type: string;
  path: string;
  comment_id: number;
}

interface Comment {
  id: number;
  content: string;
  user: User;
  created_at: string;
  attachments?: CommentAttachment[];
}

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done' | 'cancelled';
  due_date: string;
  created_at: string;
  updated_at: string;
  project: Project;
  assignee: User;
  creator: User;
  comments: Comment[];
}

interface PageProps {
  tasks: Task[];
  auth: {
    user: User;
  };
  flash?: {
    success?: string;
    error?: string;
  };
  [key: string]: unknown;
}

const TaskIndex: React.FC = () => {
  const pageData = usePage<PageProps>();
  const { tasks: initialTasks, auth, flash } = pageData.props;
  const [tasks, setTasks] = useState<Task[]>(initialTasks || []);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [viewTask, setViewTask] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [commentTask, setCommentTask] = useState<Task | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'todo' as 'todo' | 'in_progress' | 'done',
    due_date: ''
  });

  const [commentForm, setCommentForm] = useState({
    content: '',
    attachments: [] as File[]
  });
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isDragOverColumn, setIsDragOverColumn] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentContent, setEditCommentContent] = useState<string>('');

  // Update tasks when props change (after navigation or refresh)
  useEffect(() => {
    console.log('Tasks updated from props:', initialTasks);
    if (initialTasks && Array.isArray(initialTasks)) {
      setTasks(initialTasks);
    } else {
      console.warn('initialTasks is not an array or is undefined:', initialTasks);
      setTasks([]);
    }
  }, [initialTasks]);

  // Status configuration - Updated to match 3 columns
  const statusConfig = {
    todo: {
      title: 'To Do',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      headerBg: 'bg-yellow-100'
    },
    in_progress: {
      title: 'In Progress',
      icon: AlertCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      headerBg: 'bg-blue-100'
    },
    done: {
      title: 'Completed',
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      headerBg: 'bg-green-100'
    }
  };

  // Priority colors
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No due date';

    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return formatDate(dateString);
    } catch (error) {
      return formatDate(dateString);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    if (!fileType) return File;

    const type = fileType.toLowerCase();

    if (type.startsWith('image/')) {
      return ImageIcon;
    } else if (type.includes('pdf')) {
      return FileText;
    } else if (type.includes('word') || type.includes('document') || type.endsWith('.doc') || type.endsWith('.docx')) {
      return FileText;
    } else if (type.includes('excel') || type.includes('spreadsheet') || type.endsWith('.xls') || type.endsWith('.xlsx')) {
      return FileText;
    } else if (type.includes('text') || type.endsWith('.txt')) {
      return FileText;
    } else if (type.includes('zip') || type.includes('compressed')) {
      return File;
    }
    return File;
  };

  // Drag and Drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent, status: string) => {
    e.preventDefault();
    setIsDragOverColumn(status);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverColumn(null);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    setIsDragOverColumn(null);

    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    // Store original tasks for potential rollback
    const originalTasks = [...tasks];

    // Optimistic update
    const updatedTasks = tasks.map(task =>
      task.id === draggedTask.id
        ? { ...task, status: newStatus as Task['status'] }
        : task
    );
    setTasks(updatedTasks);

    try {
      // Send update to server
      router.patch(`/tasks/${draggedTask.id}`,
        { status: newStatus },
        {
          preserveState: true,
          preserveScroll: true,
          onError: (errors) => {
            console.error('Failed to update task status:', errors);
            // Revert on error
            setTasks(originalTasks);
          },
          onSuccess: (page) => {
            console.log('Task updated successfully:', page);
            // Update with fresh data from server if available
            if (page.props && Array.isArray(page.props.tasks)) {
              setTasks(page.props.tasks);
            }
          }
        }
      );
    } catch (error) {
      console.error('Error updating task:', error);
      // Revert on error
      setTasks(originalTasks);
    }

    setDraggedTask(null);
  }, [draggedTask, tasks]);

  // Group tasks by status
  const groupedTasks = Object.keys(statusConfig).reduce((acc, status) => {
    acc[status] = tasks.filter(task => task.status === status);
    return acc;
  }, {} as Record<string, Task[]>);

  // Debug semua status yang ditemukan
  const allStatuses = tasks.map(task => ({
    id: task.id,
    title: task.title,
    status: task.status,
    statusType: typeof task.status
  }));

  // Delete task
  const handleDelete = async (taskId: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      // Store original tasks for potential rollback
      const originalTasks = [...tasks];

      // Optimistic update - remove task immediately
      setTasks(tasks.filter(task => task.id !== taskId));

      router.delete(`/tasks/${taskId}`, {
        preserveState: true,
        preserveScroll: true,
        onError: (errors) => {
          console.error('Failed to delete task:', errors);
          // Revert on error
          setTasks(originalTasks);
        },
        onSuccess: (page) => {
          console.log('Task deleted successfully');
          // Update with fresh data from server if available
          if (page.props && Array.isArray(page.props.tasks)) {
            setTasks(page.props.tasks);
          }
        }
      });
    }
  };

  // Safe render helper for user names
  const renderUserName = (user: User | null | undefined) => {
    if (!user || !user.id) return 'Unassigned';
    return user.name || 'Unknown User';
  };

  // Safe render helper for project names
  const renderProjectName = (project: Project | null | undefined) => {
    if (!project || !project.id) return 'No Project';
    return project.name || 'Unknown Project';
  };

  // Handle view task
  const handleViewTask = (task: Task | null) => {
    if (!task) return;
    setViewTask(task);
    setCommentTask(null);
  };

  // Handle edit task
  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setEditForm({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'medium',
      status: (['todo', 'in_progress', 'done'].includes(task.status) ? task.status : 'todo') as 'todo' | 'in_progress' | 'done',
      due_date: task.due_date ? task.due_date.split('T')[0] : ''
    });
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editTask) return;

    try {
      router.patch(`/tasks/${editTask.id}`, editForm, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: (page) => {
          console.log('Task updated successfully');
          if (page.props && Array.isArray(page.props.tasks)) {
            setTasks(page.props.tasks);
          }
          setEditTask(null);
        },
        onError: (errors) => {
          console.error('Failed to update task:', errors);
        }
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Handle comment task
  const handleCommentTask = (task: Task | null) => {
    if (!task) return;
    setCommentTask(task);
    setViewTask(null);
    setCommentForm({
      content: '',
      attachments: []
    });
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert(`File "${file.name}" is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    setCommentForm(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles]
    }));

    // Reset input value untuk memungkinkan upload file dengan nama sama
    e.target.value = '';
  };

  // Remove attachment from comment form
  const removeAttachment = (index: number) => {
    setCommentForm(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  // Submit comment
  const handleSubmitComment = async () => {
    if (!commentTask || (!commentForm.content.trim() && commentForm.attachments.length === 0)) {
      return;
    }

    setIsSubmittingComment(true);

    try {
      const formData = new FormData();
      formData.append('content', commentForm.content);
      formData.append('task_id', commentTask.id.toString());

      // Add attachments
      commentForm.attachments.forEach((file) => {
        formData.append('attachments[]', file); // Pastikan backend bisa handle multiple files
      });

      await router.post(`/tasks/${commentTask.id}/comments`, formData, {
        preserveState: true,
        preserveScroll: true,
        forceFormData: true,
        onSuccess: (page) => {
          if (page.props.tasks && Array.isArray(page.props.tasks)) {
            setTasks(page.props.tasks as Task[]);
            const updatedTask = page.props.tasks.find((t: Task) => t.id === commentTask.id);
            if (updatedTask) setCommentTask(updatedTask);
          }
          setCommentForm({
            content: '',
            attachments: []
          });
        }
      });
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Download attachment
  const handleDownloadAttachment = (attachment: CommentAttachment) => {
    // Gunakan route yang mengembalikan file dari storage
    const url = `/attachments/${attachment.id}/download`;

    const link = document.createElement('a');
    link.href = url;
    link.download = attachment.original_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handler untuk mulai edit
  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditCommentContent(comment.content);
  };

  // Handler untuk simpan edit
  const handleSaveEditComment = async (comment: Comment) => {
    if (!editCommentContent.trim()) return;
    try {
      router.patch(`/tasks/${commentTask?.id}/comments/${comment.id}`, { content: editCommentContent }, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: (page) => {
          if (page.props && Array.isArray(page.props.tasks)) {
            setTasks(page.props.tasks);
            const updatedTask = page.props.tasks.find((t: Task) => t.id === commentTask?.id);
            if (updatedTask) setCommentTask(updatedTask);
          }
          setEditingCommentId(null);
        }
      });
    } catch (e) {
      alert('Gagal update komentar');
    }
  };

  // Handler untuk hapus
  const handleDeleteComment = async (comment: Comment) => {
    if (!window.confirm('Hapus komentar ini?')) return;
    try {
      router.delete(`/tasks/${commentTask?.id}/comments/${comment.id}`, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: (page) => {
          if (page.props && Array.isArray(page.props.tasks)) {
            setTasks(page.props.tasks);
            const updatedTask = page.props.tasks.find((t: Task) => t.id === commentTask?.id);
            if (updatedTask) setCommentTask(updatedTask);
          }
        }
      });
    } catch (e) {
      alert('Gagal hapus komentar');
    }
  };

  return (
    <>
      <Head title="Tasks - Kanban Board" />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
                <p className="mt-2 text-gray-600">Manage your tasks with drag and drop Kanban board</p>
              </div>
              <Link
                href="/tasks/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Task
              </Link>
            </div>
          </div>

          {/* Flash Messages */}
          {flash?.success && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                {flash.success}
              </div>
            </div>
          )}
          {flash?.error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 mr-2" />
                {flash.error}
              </div>
            </div>
          )}

          {/* Kanban Board - Updated to 3 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {Object.entries(statusConfig).map(([status, config]) => {
              const Icon = config.icon;
              const statusTasks = groupedTasks[status] || [];
              const isDragOver = isDragOverColumn === status;

              return (
                <div
                  key={status}
                  className={`${config.bgColor} rounded-xl border ${config.borderColor} shadow-sm transition-all duration-200 ${isDragOver ? 'ring-2 ring-blue-400 ring-opacity-50 transform scale-[1.02]' : ''
                    }`}
                  onDragOver={handleDragOver}
                  onDragEnter={(e) => handleDragEnter(e, status)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, status)}
                >
                  {/* Column Header */}
                  <div className={`p-4 ${config.headerBg} rounded-t-xl border-b ${config.borderColor}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Icon className={`w-5 h-5 mr-2 ${config.color}`} />
                        <h3 className={`font-semibold ${config.color}`}>{config.title}</h3>
                      </div>
                      <span className="bg-white text-gray-700 px-3 py-1 rounded-full text-sm font-medium border border-gray-200 shadow-sm">
                        {statusTasks.length}
                      </span>
                    </div>
                  </div>

                  {/* Tasks */}
                  <div className="p-4 space-y-3 min-h-[500px]">
                    {statusTasks.map((task) => (
                      <div
                        key={`task-${task.id}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-move group"
                      >
                        {/* Task Priority */}
                        <div className="flex justify-between items-start mb-3">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                            {(task.priority || 'medium').toUpperCase()
                            }</span>
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleViewTask(task)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors rounded"
                              title="View Task"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCommentTask(task)}
                              className="p-1 text-gray-400 hover:text-purple-600 transition-colors rounded relative"
                              title="Add Comment"
                            >
                              <MessageCircle className="w-4 h-4" />
                              {task.comments && task.comments.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                  {task.comments.length}
                                </span>
                              )}
                            </button>
                            <button
                              onClick={() => handleEditTask(task)}
                              className="p-1 text-gray-400 hover:text-green-600 transition-colors rounded"
                              title="Edit Task"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(task.id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors rounded"
                              title="Delete Task"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Task Title */}
                        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {task.title || 'Untitled Task'}
                        </h4>

                        {/* Task Description */}
                        {task.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        {/* Project */}
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <span className="font-medium">Project:</span>
                          <span className="ml-1 truncate">{renderProjectName(task.project)}</span>
                        </div>

                        {/* Assignee */}
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <User className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{renderUserName(task.assignee)}</span>
                        </div>

                        {/* Due Date */}
                        {task.due_date && (
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className={`${new Date(task.due_date) < new Date() ? 'text-red-600 font-medium' : ''}`}>
                              {formatDate(task.due_date)}
                            </span>
                          </div>
                        )}

                        {/* Comments Count & Attachments */}
                        {task.comments && task.comments.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                              <button
                                onClick={() => handleCommentTask(task)}
                                className="text-xs text-gray-500 flex items-center hover:text-purple-600 transition-colors"
                              >
                                <MessageCircle className="w-3 h-3 mr-1" />
                                {task.comments.length} comment{task.comments.length !== 1 ? 's' : ''}
                              </button>
                              {task.comments.some(comment => comment.attachments && comment.attachments.length > 0) && (
                                <span className="text-xs text-gray-500 flex items-center">
                                  <Paperclip className="w-3 h-3 mr-1" />
                                  {task.comments.reduce((total, comment) => total + (comment.attachments?.length || 0), 0)} file{task.comments.reduce((total, comment) => total + (comment.attachments?.length || 0), 0) !== 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Empty State */}
                    {statusTasks.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <Icon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No tasks in {config.title.toLowerCase()}</p>
                        {isDragOver && (
                          <p className="text-xs mt-2 text-blue-500 font-medium">Drop task here</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Task Summary - Updated to 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(statusConfig).map(([status, config]) => {
              const count = groupedTasks[status]?.length || 0;
              const Icon = config.icon;

              return (
                <div key={status} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
                      <Icon className={`w-6 h-6 ${config.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{config.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* No Tasks State */}
          {tasks.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first task.</p>
              <Link
                href="/tasks/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Task
              </Link>
            </div>
          )}
        </div>

        {/* Combined Task Detail & Comment Modal */}
        {(viewTask || commentTask) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start p-6 border-b sticky top-0 bg-white z-10">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {commentTask ? 'Task Discussion' : 'Task Details'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {viewTask?.title || commentTask?.title}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setViewTask(null);
                    setCommentTask(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="border-b">
                <div className="flex">
                  <button
                    className={`px-4 py-3 font-medium text-sm ${!commentTask ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => {
                      setViewTask(commentTask || viewTask);
                      setCommentTask(null);
                    }}
                  >
                    Task Details
                  </button>
                  <button
                    className={`px-4 py-3 font-medium text-sm ${commentTask ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => {
                      setCommentTask(viewTask || commentTask);
                      setViewTask(null);
                    }}
                  >
                    Discussion ({((viewTask || commentTask)?.comments?.length || 0)})
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Task Details View */}
                {viewTask && (
                  <div className="space-y-6">
                    {/* Title & Status */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{viewTask.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(viewTask.priority)}`}>
                          {viewTask.priority.toUpperCase()} PRIORITY
                        </span>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${viewTask.status === 'done' ? 'bg-green-100 text-green-800 border-green-200' :
                          viewTask.status === 'in_progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            'bg-yellow-100 text-yellow-800 border-yellow-200'
                          }`}>
                          {(statusConfig[viewTask.status as keyof typeof statusConfig]?.title?.toUpperCase()) || viewTask.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {viewTask.description && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                        <p className="text-gray-600 whitespace-pre-line">{viewTask.description}</p>
                      </div>
                    )}

                    {/* Task Metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-2">Task Information</h4>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <span className="text-gray-500 text-sm w-24">Project:</span>
                            <span className="font-medium">{renderProjectName(viewTask.project)}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-500 text-sm w-24">Assignee:</span>
                            <span className="font-medium">{renderUserName(viewTask.assignee)}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-500 text-sm w-24">Creator:</span>
                            <span className="font-medium">{renderUserName(viewTask.creator)}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-500 text-sm w-24">Created:</span>
                            <span className="font-medium">{formatDate(viewTask.created_at)}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-500 text-sm w-24">Due Date:</span>
                            <span className={`font-medium ${new Date(viewTask.due_date) < new Date() ? 'text-red-600' : ''
                              }`}>
                              {formatDate(viewTask.due_date)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Comments Preview */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-gray-700">Recent Comments</h4>
                          <button
                            onClick={() => {
                              setCommentTask(viewTask);
                              setViewTask(null);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            View All
                          </button>
                        </div>
                        {viewTask.comments && viewTask.comments.length > 0 ? (
                          <ul className="space-y-3">
                            {viewTask.comments.slice(0, 2).map((comment) => (
                              <li key={comment.id} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <span className="font-medium text-sm text-gray-800">{renderUserName(comment.user)}</span>
                                    <span className="ml-2 text-xs text-gray-400">{formatRelativeTime(comment.created_at)}</span>
                                  </div>
                                </div>
                                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{comment.content}</p>
                                {comment.attachments && comment.attachments.length > 0 && (
                                  <div className="mt-1">
                                    <span className="text-xs text-gray-500">
                                      {comment.attachments.length} attachment{comment.attachments.length !== 1 ? 's' : ''}
                                    </span>
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-400 text-sm">No comments yet</p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 pt-4">
                      <button
                        onClick={() => handleEditTask(viewTask)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit Task
                      </button>
                      <button
                        onClick={() => {
                          setCommentTask(viewTask);
                          setViewTask(null);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Add Comment
                      </button>
                    </div>
                  </div>
                )}

                {/* Comments View */}
                {commentTask && (
                  <div className="space-y-6">
                    {/* Task Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{commentTask.title}</h3>
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(commentTask.priority)}`}>
                          {commentTask.priority.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${commentTask.status === 'done' ? 'bg-green-100 text-green-800 border-green-200' :
                          commentTask.status === 'in_progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            'bg-yellow-100 text-yellow-800 border-yellow-200'
                          }`}>
                          {statusConfig[commentTask.status as keyof typeof statusConfig]?.title}
                        </span>
                        <span className="text-sm text-gray-500">
                          Due: {formatDate(commentTask.due_date)}
                        </span>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-4">Discussion ({commentTask.comments?.length || 0})</h4>

                      {commentTask?.comments?.length > 0 ? (
                        <ul className="space-y-4">
                          {commentTask.comments?.map((comment) => (
                            <li key={comment?.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                    <User className="w-4 h-4 text-gray-500" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-800">{renderUserName(comment.user)}</p>
                                    <p className="text-xs text-gray-400">{formatRelativeTime(comment.created_at)}</p>
                                  </div>
                                </div>
                                {auth?.user?.id === comment?.user?.id && (
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => handleEditComment(comment)}
                                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors rounded"
                                      title="Edit Comment"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteComment(comment)}
                                      className="p-1 text-gray-400 hover:text-red-600 transition-colors rounded"
                                      title="Delete Comment"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>

                              {editingCommentId === comment.id ? (
                                <form
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSaveEditComment(comment);
                                  }}
                                  className="mb-2"
                                >
                                  <textarea
                                    className="w-full border rounded p-2 text-sm mb-2"
                                    rows={3}
                                    value={editCommentContent}
                                    onChange={(e) => setEditCommentContent(e.target.value)}
                                    autoFocus
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      type="submit"
                                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded"
                                      onClick={() => setEditingCommentId(null)}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </form>
                              ) : (
                                <div className="text-gray-700 mb-3 whitespace-pre-line">{comment.content}</div>
                              )}

                              {comment.attachments && comment.attachments.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <h5 className="text-xs font-medium text-gray-500 mb-2">Attachments</h5>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {comment.attachments.map((attachment) => {
                                      const Icon = getFileIcon(attachment.file_type); // Gunakan mime_type
                                      return (
                                        <div
                                          key={attachment.id}
                                          className="flex items-center p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
                                          onClick={() => handleDownloadAttachment(attachment)}
                                        >
                                          <div className="p-2 bg-gray-100 rounded mr-2">
                                            <Icon className="w-4 h-4 text-gray-500" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">
                                              {attachment.original_name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              {formatFileSize(attachment.file_size)}
                                            </p>
                                          </div>
                                          <Download className="w-4 h-4 text-gray-400 ml-2" />
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p className="text-sm">No comments yet</p>
                          <p className="text-xs mt-1">Start the discussion by adding the first comment</p>
                        </div>
                      )}
                    </div>

                    {/* Add Comment Form */}
                    <div className="border-t pt-4">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSubmitComment();
                        }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-2">Add Comment</label>
                        <textarea
                          className="w-full border rounded p-3 text-sm mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={4}
                          placeholder="Write your comment here..."
                          value={commentForm.content}
                          onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                          disabled={isSubmittingComment}
                        />

                        {/* Attachment Preview */}
                        {commentForm.attachments.length > 0 && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-500">Attachments</span>
                              <span className="text-xs text-gray-400">
                                {commentForm.attachments.length} file{commentForm.attachments.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="space-y-2">
                              {commentForm.attachments.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                                >
                                  <div className="flex items-center">
                                    <div className="p-1 bg-gray-100 rounded mr-2">
                                      {(() => {
                                        const Icon = getFileIcon(file.type);
                                        return <Icon className="w-4 h-4 text-gray-500" />;
                                      })()}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-800 truncate max-w-xs">
                                        {file.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {formatFileSize(file.size)}
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    className="text-red-500 hover:text-red-700 p-1"
                                    onClick={() => removeAttachment(index)}
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <label className="inline-flex items-center cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md transition-colors">
                            <Paperclip className="w-4 h-4 mr-2" />
                            <span className="text-sm">Add Attachment</span>
                            <input
                              type="file"
                              className="hidden"
                              multiple
                              onChange={handleFileSelect}
                              disabled={isSubmittingComment}
                              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                            />
                          </label>

                          <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-70"
                            disabled={isSubmittingComment || (!commentForm.content.trim() && commentForm.attachments.length === 0)}
                          >
                            {isSubmittingComment ? (
                              <>
                                <svg
                                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Posting...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-1" />
                                Post Comment
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Task Modal, Comment Modal, dst. bisa dilanjutkan sesuai kebutuhan */}
      </div>
      {/* Edit Task Modal */}
      {editTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start p-6 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">Edit Task</h2>
              <button
                onClick={() => setEditTask(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form
              className="p-6 space-y-4"
              onSubmit={e => {
                e.preventDefault();
                handleSaveEdit();
              }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full border rounded p-2 text-sm"
                  value={editForm.title}
                  onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full border rounded p-2 text-sm"
                  rows={3}
                  value={editForm.description}
                  onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    className="w-full border rounded p-2 text-sm"
                    value={editForm.priority}
                    onChange={e => setEditForm(f => ({ ...f, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full border rounded p-2 text-sm"
                    value={editForm.status}
                    onChange={e => setEditForm(f => ({ ...f, status: e.target.value as 'todo' | 'in_progress' | 'done' }))}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Completed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  className="w-full border rounded p-2 text-sm"
                  value={editForm.due_date}
                  onChange={e => setEditForm(f => ({ ...f, due_date: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  onClick={() => setEditTask(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskIndex;