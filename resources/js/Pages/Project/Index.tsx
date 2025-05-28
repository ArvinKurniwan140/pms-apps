import React, { useState } from 'react';

// Define interfaces
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

const ProjectManagementSidebar = () => {
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
    },
    {
      id: 3,
      name: "Marketing Campaign",
      description: "Q2 digital marketing campaign",
      status: "on-hold",
      progress: 80,
      taskCount: 6,
      memberCount: 4,
      dueDate: "2025-06-20",
      color: "bg-purple-500"
    },
    {
      id: 4,
      name: "Data Migration",
      description: "Legacy system data migration",
      status: "completed",
      progress: 100,
      taskCount: 15,
      memberCount: 2,
      dueDate: "2025-05-15",
      color: "bg-gray-500"
    }
  ]);

  const [currentUser] = useState<User>({
    id: 1,
    name: "John Doe",
    email: "john.doe@company.com",
    role: "project_manager"
  });

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Filter projects based on search
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper functions
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      case 'on-hold': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleDisplay = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'project_manager': return 'Project Manager';
      case 'team_member': return 'Team Member';
      default: return 'User';
    }
  };

  const canCreateProject = currentUser.role === 'admin' || currentUser.role === 'project_manager';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-white shadow-lg border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <h1 className="text-xl font-bold text-gray-800">ProjectHub</h1>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* User Profile */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">👤</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
                <p className="text-xs text-gray-500 truncate">{getRoleDisplay(currentUser.role)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {!sidebarCollapsed && (
            <>
              {/* Dashboard */}
              <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                <span>📊</span>
                <span className="text-sm font-medium text-gray-700">Dashboard</span>
              </button>

              {/* Calendar */}
              <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                <span>📅</span>
                <span className="text-sm font-medium text-gray-700">Calendar</span>
              </button>

              {/* Team */}
              <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                <span>👥</span>
                <span className="text-sm font-medium text-gray-700">Team</span>
              </button>
            </>
          )}

          {/* Projects Section */}
          <div className="pt-4">
            <button
              onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span>📁</span>
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium text-gray-700">Projects</span>
                )}
              </div>
              {!sidebarCollapsed && (
                <span className="text-gray-500">
                  {isProjectsExpanded ? '▼' : '▶️'}
                </span>
              )}
            </button>


            {/* Add Project Button */}
            {!sidebarCollapsed && isProjectsExpanded && canCreateProject && (
              <button className="w-full mt-2 mx-3 flex items-center space-x-2 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <span>➕</span>
                <span className="text-sm text-gray-600">Add Project</span>
              </button>
            )}

            {/* Projects List */}
            {!sidebarCollapsed && isProjectsExpanded && (
              <div className="mt-2 space-y-1 max-h-64 overflow-y-auto">
                {filteredProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className={`w-full px-3 py-3 rounded-lg transition-colors text-left ${
                      selectedProject?.id === project.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-3 h-3 rounded-full mt-1 ${project.color}`}></div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {project.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {project.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {project.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                          <span>{project.taskCount} tasks</span>
                          <span>{project.memberCount} members</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Footer */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                <span>🔔</span>
                <span className="text-sm text-gray-700">Notifications</span>
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <span>🚪</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {selectedProject ? (
          <div className="max-w-4xl">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-lg ${selectedProject.color} flex items-center justify-center`}>
                    <span className="text-white text-xl">📂</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h1>
                    <p className="text-gray-600 mt-1">{selectedProject.description}</p>
                    <div className="flex items-center space-x-4 mt-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProject.status)}`}>
                        {selectedProject.status}
                      </span>
                      <span className="text-sm text-gray-500">Due: {selectedProject.dueDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                    Edit Project
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                    Add Task
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-700">Progress</h3>
                    <span className="text-lg font-semibold text-gray-900">{selectedProject.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${selectedProject.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-700">Tasks</h3>
                    <span className="text-lg font-semibold text-gray-900">{selectedProject.taskCount}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Total tasks in project</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-700">Team Members</h3>
                    <span className="text-lg font-semibold text-gray-900">{selectedProject.memberCount}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Active members</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600">👤</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">John Doe</span> updated task "Homepage Design"
                      </p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600">✅</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Jane Smith</span> completed task "Database Schema"
                      </p>
                      <p className="text-xs text-gray-500">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600">💬</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Mike Johnson</span> added a comment to "API Development"
                      </p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">📁</div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Select a Project</h2>
              <p className="text-gray-500">Choose a project from the sidebar to view its details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectManagementSidebar;