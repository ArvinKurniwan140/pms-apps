import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Filter, Calendar, Users, Eye, Edit2, Trash2 } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  status_label: string;
  is_active: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
  creator: User;
  members: User[];
}

interface Props {
  projects: Project[];
  statuses: Record<string, string>;
}

type StatusKey = 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';

const getStatusColor = (status: string) => {
  const colors: Record<StatusKey, string> = {
    planning: 'bg-blue-100 text-blue-800 border-blue-200',
    in_progress: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    on_hold: 'bg-gray-100 text-gray-800 border-gray-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  };
  return (colors as Record<string, string>)[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export default function Index({ projects, statuses }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Filter projects based on search and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      router.delete(`/projects/${projectToDelete.id}`, {
        onSuccess: () => {
          setShowDeleteModal(false);
          setProjectToDelete(null);
        }
      });
    }
  };

  return (
    <>
      <Head title="Projects" />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                <p className="mt-2 text-gray-600">Kelola semua project Anda di sini</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link
                  href="/projects/create"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Buat Project Baru
                </Link>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cari project..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="">Semua Status</option>
                    {Object.entries(statuses).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {projects.length === 0 ? 'Belum ada project' : 'Tidak ada project yang ditemukan'}
              </h3>
              <p className="text-gray-600 mb-6">
                {projects.length === 0 
                  ? 'Mulai dengan membuat project pertama Anda'
                  : 'Coba ubah kata kunci pencarian atau filter status'
                }
              </p>
              {projects.length === 0 && (
                <Link
                  href="/projects/create"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Buat Project Baru
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <div className="p-6">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
                        {project.status_label}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/projects/${project.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/projects/${project.id}/edit`}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                          title="Edit Project"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteProject(project)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Hapus Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {project.name}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    {/* Project Details */}
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          {formatDate(project.start_date)} - {formatDate(project.end_date)}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-2" />
                        <span>
                          {project.members.length} anggota • Created by {project.creator.name}
                        </span>
                      </div>
                    </div>

                    {/* Members Avatars */}
                    {project.members.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center">
                          <div className="flex -space-x-2">
                            {project.members.slice(0, 3).map((member) => (
                              <div
                                key={member.id}
                                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                                title={member.name}
                              >
                                {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </div>
                            ))}
                            {project.members.length > 3 && (
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white">
                                +{project.members.length - 3}
                              </div>
                            )}
                          </div>
                          <span className="ml-3 text-sm text-gray-500">
                            Team members
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && projectToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Hapus Project
            </h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus project "<strong>{projectToDelete.name}</strong>"? 
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Ya, Hapus
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}