import React, { useState } from 'react';

// Define interfaces
interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  dueDate: string;
  createdDate: string;
  projectId: number;
  tags: string[];
  estimatedHours: number;
  actualHours?: number;
}

interface Project {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
  taskCount: number;
  memberCount: number;
  dueDate: string;
  color: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'project_manager' | 'team_member';
}

const TaskManagementSystem = () => {
  // Sample data
  const [projects] = useState<Project[]>([
    {
      id: 1,
      name: "Website Redesign",
      description: "Complete overhaul of company website",
      status: "active",
      progress: 65,
      taskCount: 12,
      memberCount: 5,
      dueDate: "2025-07-15",
      color: "bg-blue-500"
    },
    {
      id: 2,
      name: "Mobile App Development",
      description: "React Native mobile application",
      status: "active",
      progress: 30,
      taskCount: 8,
      memberCount: 3,
      dueDate: "2025-08-30",
      color: "bg-green-500"
    }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Design Homepage Layout",
      description: "Create wireframes and mockups for the new homepage design",
      status: "in-progress",
      priority: "high",
      assignedTo: "John Doe",
      dueDate: "2025-06-15",
      createdDate: "2025-05-20",
      projectId: 1,
      tags: ["design", "frontend"],
      estimatedHours: 16,
      actualHours: 8
    },
    {
      id: 2,
      title: "Setup Database Schema",
      description: "Design and implement the database structure for user management",
      status: "completed",
      priority: "high",
      assignedTo: "Jane Smith",
      dueDate: "2025-06-10",
      createdDate: "2025-05-18",
      projectId: 1,
      tags: ["backend", "database"],
      estimatedHours: 12,
      actualHours: 10
    },
    {
      id: 3,
      title: "Implement Authentication",
      description: "Add user login and registration functionality",
      status: "todo",
      priority: "medium",
      assignedTo: "Mike Johnson",
      dueDate: "2025-06-20",
      createdDate: "2025-05-22",
      projectId: 1,
      tags: ["backend", "security"],
      estimatedHours: 20
    },
    {
      id: 4,
      title: "Mobile UI Components",
      description: "Create reusable React Native components",
      status: "review",
      priority: "medium",
      assignedTo: "Sarah Wilson",
      dueDate: "2025-06-25",
      createdDate: "2025-05-25",
      projectId: 2,
      tags: ["mobile", "components"],
      estimatedHours: 24,
      actualHours: 20
    },
    {
      id: 5,
      title: "API Integration",
      description: "Connect mobile app with backend APIs",
      status: "todo",
      priority: "urgent",
      assignedTo: "Alex Brown",
      dueDate: "2025-06-12",
      createdDate: "2025-05-28",
      projectId: 2,
      tags: ["mobile", "api"],
      estimatedHours: 18
    }
  ]);

  const [currentUser] = useState<User>({
    id: 1,
    name: "John Doe",
    email: "john.doe@company.com",
    role: "project_manager"
  });

  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Filter tasks based on selected project and filters
  const filteredTasks = tasks.filter(task => {
    if (task.projectId !== selectedProject.id) return false;
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Group tasks by status for board view
  const tasksByStatus = {
    'todo': filteredTasks.filter(task => task.status === 'todo'),
    'in-progress': filteredTasks.filter(task => task.status === 'in-progress'),
    'review': filteredTasks.filter(task => task.status === 'review'),
    'completed': filteredTasks.filter(task => task.status === 'completed')
  };

  // Helper functions
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'text-gray-600 bg-gray-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'review': return 'text-purple-600 bg-purple-100';
      case 'completed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const updateTaskStatus = (taskId: number, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (status: Task['status']) => {
    setDragOverColumn(status);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only reset if we're leaving the column container, not just a child element
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, newStatus: Task['status']) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== newStatus) {
      updateTaskStatus(draggedTask.id, newStatus);
    }
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const daysUntilDue = getDaysUntilDue(task.dueDate);
    const isOverdue = daysUntilDue < 0;
    const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;
    const isDragging = draggedTask?.id === task.id;

    return (
      <div 
        className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all cursor-move select-none ${
          isDragging ? 'opacity-50 rotate-2 scale-105' : ''
        }`}
        draggable
        onDragStart={(e) => handleDragStart(e, task)}
        onDragEnd={handleDragEnd}
        onClick={(e) => {
          // Prevent click when dragging
          if (!isDragging) {
            setSelectedTask(task);
          }
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900 line-clamp-2 flex-1 mr-2">{task.title}</h4>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 cursor-move">⋮⋮</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
        </div>
        
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{task.assignedTo}</span>
          <span className={`${isOverdue ? 'text-red-600' : isDueSoon ? 'text-orange-600' : ''}`}>
            {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : 
             daysUntilDue === 0 ? 'Due today' : 
             `${daysUntilDue} days left`}
          </span>
        </div>
        
        {task.estimatedHours && (
          <div className="mt-2 text-xs text-gray-500">
            ⏱️ {task.actualHours || 0}h / {task.estimatedHours}h
          </div>
        )}
      </div>
    );
  };

  const StatusColumn = ({ status, title, tasks }: { status: Task['status'], title: string, tasks: Task[] }) => {
    const isDropTarget = dragOverColumn === status;
    const hasTaskBeingDragged = draggedTask !== null;
    
    return (
      <div 
        className={`bg-gray-50 rounded-lg p-4 min-h-96 transition-all duration-200 ${
          isDropTarget ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : 
          hasTaskBeingDragged ? 'bg-gray-100' : ''
        }`}
        onDragOver={handleDragOver}
        onDragEnter={() => handleDragEnter(status)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, status)}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">{title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isDropTarget ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-700'
          }`}>
            {tasks.length}
          </span>
        </div>
        
        {/* Drop zone indicator */}
        {isDropTarget && draggedTask && (
          <div className="mb-3 p-3 border-2 border-blue-300 border-dashed rounded-lg bg-blue-100">
            <p className="text-sm text-blue-700 text-center">
              📥 Drop "{draggedTask.title}" here
            </p>
          </div>
        )}
        
        <div className="space-y-3">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
          
          {/* Empty state */}
          {tasks.length === 0 && !isDropTarget && (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-2">📋</div>
              <p className="text-sm text-gray-500">No tasks</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Task Manager</h1>
        </div>

        {/* Project Selector */}
        <div className="p-4 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
          <select 
            value={selectedProject.id}
            onChange={(e) => setSelectedProject(projects.find(p => p.id === parseInt(e.target.value)) || projects[0])}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
          >
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Tasks</label>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select 
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Project Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Tasks</span>
              <span className="font-medium">{filteredTasks.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Completed</span>
              <span className="font-medium text-green-600">
                {tasksByStatus.completed.length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">In Progress</span>
              <span className="font-medium text-blue-600">
                {tasksByStatus['in-progress'].length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Overdue</span>
              <span className="font-medium text-red-600">
                {filteredTasks.filter(task => getDaysUntilDue(task.dueDate) < 0).length}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4">
          <button 
            onClick={() => setShowTaskModal(true)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            ➕ Add New Task
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{selectedProject.name}</h2>
              <p className="text-sm text-gray-600">{selectedProject.description}</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('board')}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    viewMode === 'board' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📋 Board
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📄 List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Task Views */}
        <div className="flex-1 p-6 overflow-auto">
          {viewMode === 'board' ? (
            <div className="space-y-4">
              {/* Drag and Drop Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">💡</span>
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Drag and drop tasks between columns to change their status. 
                    Look for the grab handle (⋮⋮) on each task card.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatusColumn status="todo" title="📋 To Do" tasks={tasksByStatus.todo} />
                <StatusColumn status="in-progress" title="🔄 In Progress" tasks={tasksByStatus['in-progress']} />
                <StatusColumn status="review" title="👀 Review" tasks={tasksByStatus.review} />
                <StatusColumn status="completed" title="✅ Completed" tasks={tasksByStatus.completed} />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">Task</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">Priority</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">Assignee</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">Due Date</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((task, index) => {
                      const daysUntilDue = getDaysUntilDue(task.dueDate);
                      const isOverdue = daysUntilDue < 0;
                      
                      return (
                        <tr 
                          key={task.id} 
                          className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                          onClick={() => setSelectedTask(task)}
                        >
                          <td className="p-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                              <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-900">{task.assignedTo}</td>
                          <td className="p-4">
                            <span className={`text-sm ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                              {task.dueDate}
                            </span>
                            {isOverdue && (
                              <p className="text-xs text-red-600">Overdue</p>
                            )}
                          </td>
                          <td className="p-4">
                            {task.estimatedHours && (
                              <div className="text-xs text-gray-500">
                                {task.actualHours || 0}h / {task.estimatedHours}h
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedTask.title}</h3>
                  <p className="text-gray-600 mt-1">{selectedTask.description}</p>
                </div>
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select 
                    value={selectedTask.status}
                    onChange={(e) => {
                      updateTaskStatus(selectedTask.id, e.target.value as Task['status']);
                      setSelectedTask({...selectedTask, status: e.target.value as Task['status']});
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <span className={`inline-block px-3 py-2 rounded-lg text-sm font-medium ${getPriorityColor(selectedTask.priority)}`}>
                    {selectedTask.priority}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                  <p className="text-sm text-gray-900">{selectedTask.assignedTo}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <p className="text-sm text-gray-900">{selectedTask.dueDate}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {selectedTask.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {selectedTask.estimatedHours && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Tracking</label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Estimated: {selectedTask.estimatedHours}h</span>
                      <span className="text-sm text-gray-600">Actual: {selectedTask.actualHours || 0}h</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(((selectedTask.actualHours || 0) / selectedTask.estimatedHours) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  Edit Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagementSystem;