import React, { useState } from 'react';
import { Plus, Folder, Calendar, Target, MoreVertical, Play, Pause, Archive, Trash2 } from 'lucide-react';
import { Project, ProjectStatus } from '@/types';

interface ProjectsProps {
  projects: Project[];
  darkMode: boolean;
  onCreateProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Project | undefined>;
  onUpdateProject: (id: number, updates: Partial<Project>) => Promise<Project | undefined>;
  onDeleteProject: (id: number) => Promise<void>;
  onSelectProject: (project: Project) => void;
  selectedProjectId?: number | undefined;
}

const PROJECT_COLORS = [
  '#4F46E5', // Indigo
  '#059669', // Emerald
  '#DC2626', // Red
  '#D97706', // Amber
  '#7C3AED', // Violet
  '#0891B2', // Cyan
  '#BE185D', // Pink
  '#65A30D', // Lime
];

export default function Projects({
  projects,
  darkMode,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
  onSelectProject,
  selectedProjectId
}: ProjectsProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    color: PROJECT_COLORS[0]!,
    status: 'active' as ProjectStatus,
    dueDate: undefined as Date | undefined
  });
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const handleCreateProject = async () => {
    if (newProject.name.trim()) {
      await onCreateProject({
        ...newProject,
        name: newProject.name.trim(),
        estimatedPomodoros: 0,
        completedPomodoros: 0,
        color: newProject.color || PROJECT_COLORS[0]!
      });
      setNewProject({
        name: '',
        description: '',
        color: PROJECT_COLORS[0]!,
        status: 'active',
        dueDate: undefined
      });
      setShowCreateForm(false);
    }
  };

  const handleStatusChange = (project: Project, newStatus: ProjectStatus) => {
    onUpdateProject(project.id, { status: newStatus });
    setActiveDropdown(null);
  };

  const getStatusIcon = (status: ProjectStatus) => {
    switch (status) {
      case 'active': return <Play className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'completed': return <Target className="w-4 h-4" />;
      case 'archived': return <Archive className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'paused': return 'text-yellow-500';
      case 'completed': return 'text-blue-500';
      case 'archived': return 'text-gray-500';
    }
  };

  const getProgress = (project: Project) => {
    if (project.estimatedPomodoros === 0) return 0;
    return Math.min((project.completedPomodoros / project.estimatedPomodoros) * 100, 100);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Projeler
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Proje</span>
        </button>
      </div>

      {/* Create Project Form */}
      {showCreateForm && (
        <div className={`mb-6 p-4 rounded-lg border ${
          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Yeni Proje Oluştur
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Proje Adı *
              </label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Proje adını girin"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Açıklama
              </label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Proje açıklaması (opsiyonel)"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Renk
                </label>
                <div className="flex space-x-2">
                  {PROJECT_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewProject({ ...newProject, color })}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newProject.color === color ? 'border-gray-800' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>


            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCreateProject}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Oluştur
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                  darkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedProjectId === project.id
                ? 'ring-2 ring-indigo-500 border-indigo-500'
                : darkMode
                  ? 'border-gray-600 hover:border-gray-500'
                  : 'border-gray-200 hover:border-gray-300'
            } ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
            onClick={() => onSelectProject(project)}
          >
            {/* Project Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                <Folder className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              </div>
              
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(activeDropdown === project.id ? null : project.id);
                  }}
                  className={`p-1 rounded hover:bg-opacity-10 hover:bg-gray-500 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {activeDropdown === project.id && (
                  <div className={`absolute right-0 top-8 w-48 py-2 rounded-lg shadow-lg border z-10 ${
                    darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
                  }`}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(project, 'active');
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-opacity-10 hover:bg-gray-500 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      <Play className="w-4 h-4 inline mr-2" />
                      Aktif
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(project, 'paused');
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-opacity-10 hover:bg-gray-500 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      <Pause className="w-4 h-4 inline mr-2" />
                      Duraklat
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(project, 'completed');
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-opacity-10 hover:bg-gray-500 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      <Target className="w-4 h-4 inline mr-2" />
                      Tamamla
                    </button>
                    <hr className={`my-1 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProject(project.id);
                        setActiveDropdown(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 hover:bg-opacity-10"
                    >
                      <Trash2 className="w-4 h-4 inline mr-2" />
                      Sil
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Project Info */}
            <h3 className={`font-semibold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {project.name}
            </h3>
            
            {project.description && (
              <p className={`text-sm mb-3 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {project.description}
              </p>
            )}

            {/* Status and Progress */}
            <div className="flex items-center space-x-2 mb-3">
              <div className={`flex items-center space-x-1 ${getStatusColor(project.status)}`}>
                {getStatusIcon(project.status)}
                <span className="text-sm font-medium capitalize">{project.status}</span>
              </div>
            </div>

            {/* Progress Bar */}
            {project.estimatedPomodoros > 0 && (
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    İlerleme
                  </span>
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {project.completedPomodoros}/{project.estimatedPomodoros}
                  </span>
                </div>
                <div className={`w-full bg-gray-200 rounded-full h-2 ${
                  darkMode ? 'bg-gray-600' : 'bg-gray-200'
                }`}>
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgress(project)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Due Date */}
            {project.dueDate && (
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {formatDate(project.dueDate)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <Folder className={`w-16 h-16 mx-auto mb-4 ${
            darkMode ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <h3 className={`text-lg font-medium mb-2 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Henüz proje yok
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            İlk projenizi oluşturmak için &quot;Yeni Proje&quot; butonuna tıklayın
          </p>
        </div>
      )}
    </div>
  );
}