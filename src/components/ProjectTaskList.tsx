import React, { useState } from 'react';
import { Plus, Clock, CheckCircle2, Circle, Calendar, Target, MoreVertical, Trash2 } from 'lucide-react';
import { Task, Project, CategoryType, PriorityType } from '@/types';
import { getPriorityColor, getCategoryIcon } from '@/utils/helpers';

interface ProjectTaskListProps {
  project: Project;
  tasks: Task[];
  darkMode: boolean;
  categories: CategoryType[];
  priorities: PriorityType[];
  onCreateTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task | undefined>;
  onUpdateTask: (id: number, updates: Partial<Task>) => Promise<Task | undefined>;
  onDeleteTask: (id: number) => Promise<void>;
  onStartTask: (task: Task) => void;
}

export default function ProjectTaskList({
  project,
  tasks,
  darkMode,
  categories,
  priorities,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onStartTask
}: ProjectTaskListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTask, setNewTask] = useState({
    text: '',
    description: '',
    category: 'work' as CategoryType,
    priority: 'medium' as PriorityType,
    estimatedPomodoros: 1,
    dueDate: undefined as Date | undefined
  });
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const handleCreateTask = async () => {
    if (newTask.text.trim()) {
      await onCreateTask({
        text: newTask.text.trim(),
        description: newTask.description,
        projectId: project.id,
        category: newTask.category,
        priority: newTask.priority,
        completed: false,
        estimatedPomodoros: newTask.estimatedPomodoros,
        completedPomodoros: 0,
        dueDate: newTask.dueDate
      });
      setNewTask({
        text: '',
        description: '',
        category: 'work',
        priority: 'medium',
        estimatedPomodoros: 1,
        dueDate: undefined
      });
      setShowCreateForm(false);
    }
  };

  const toggleTaskComplete = (task: Task) => {
    onUpdateTask(task.id, { 
      completed: !task.completed,
      completedPomodoros: !task.completed ? task.estimatedPomodoros : 0
    });
  };


  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const totalEstimatedPomodoros = tasks.reduce((sum, task) => sum + task.estimatedPomodoros, 0);
  const totalCompletedPomodoros = tasks.reduce((sum, task) => sum + task.completedPomodoros, 0);

  return (
    <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
    }`}>
      {/* Project Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {project.name}
            </h2>
            {project.description && (
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {project.description}
              </p>
            )}
          </div>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Görev Ekle</span>
        </button>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {tasks.length}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Toplam Görev
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className={`text-2xl font-bold text-green-500`}>
            {completedTasks.length}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Tamamlanan
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {totalEstimatedPomodoros}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Tahmini Pomodoro
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className={`text-2xl font-bold text-indigo-500`}>
            {totalCompletedPomodoros}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Tamamlanan Pomodoro
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {totalEstimatedPomodoros > 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Proje İlerlemesi
            </span>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              {Math.round((totalCompletedPomodoros / totalEstimatedPomodoros) * 100)}%
            </span>
          </div>
          <div className={`w-full bg-gray-200 rounded-full h-3 ${
            darkMode ? 'bg-gray-600' : 'bg-gray-200'
          }`}>
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((totalCompletedPomodoros / totalEstimatedPomodoros) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Create Task Form */}
      {showCreateForm && (
        <div className={`mb-6 p-4 rounded-lg border ${
          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Yeni Görev Ekle
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Görev Adı *
              </label>
              <input
                type="text"
                value={newTask.text}
                onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Görev adını girin"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Açıklama
              </label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Görev açıklaması (opsiyonel)"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Kategori
                </label>
                <select
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value as CategoryType })}
                  className={`w-full px-2 py-1.5 border rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-transparent text-sm ${
                    darkMode 
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Öncelik
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as PriorityType })}
                  className={`w-full px-2 py-1.5 border rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-transparent text-sm ${
                    darkMode 
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Tahmini Pomodoro
                </label>
                <input
                  type="number"
                  min="1"
                  value={newTask.estimatedPomodoros}
                  onChange={(e) => setNewTask({ 
                    ...newTask, 
                    estimatedPomodoros: parseInt(e.target.value) || 1 
                  })}
                  className={`w-full px-2 py-1.5 border rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-transparent text-sm ${
                    darkMode 
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCreateTask}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Ekle
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

      {/* Tasks List */}
      <div className="space-y-4">
        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <div>
            <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Bekleyen Görevler ({pendingTasks.length})
            </h3>
            <div className="space-y-2">
              {pendingTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  darkMode={darkMode}
                  onToggleComplete={() => toggleTaskComplete(task)}
                  onStart={() => onStartTask(task)}
                  onDelete={onDeleteTask}
                  activeDropdown={activeDropdown}
                  setActiveDropdown={setActiveDropdown}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div>
            <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Tamamlanan Görevler ({completedTasks.length})
            </h3>
            <div className="space-y-2">
              {completedTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  darkMode={darkMode}
                  onToggleComplete={() => toggleTaskComplete(task)}
                  onStart={() => onStartTask(task)}
                  onDelete={onDeleteTask}
                  activeDropdown={activeDropdown}
                  setActiveDropdown={setActiveDropdown}
                />
              ))}
            </div>
          </div>
        )}

        {tasks.length === 0 && (
          <div className="text-center py-12">
            <Target className={`w-16 h-16 mx-auto mb-4 ${
              darkMode ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className={`text-lg font-medium mb-2 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Henüz görev yok
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              İlk görevinizi eklemek için &quot;Görev Ekle&quot; butonuna tıklayın
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface TaskItemProps {
  task: Task;
  darkMode: boolean;
  onToggleComplete: () => void;
  onStart: () => void;
  onDelete: (id: number) => void;
  activeDropdown: number | null;
  setActiveDropdown: (id: number | null) => void;
}

function TaskItem({
  task,
  darkMode,
  onToggleComplete,
  onStart,
  onDelete,
  activeDropdown,
  setActiveDropdown
}: TaskItemProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'short'
    }).format(date);
  };

  const isOverdue = (date: Date) => {
    return new Date(date) < new Date() && !task.completed;
  };

  return (
    <div className={`p-4 rounded-lg border transition-all duration-200 ${
      task.completed
        ? darkMode ? 'bg-gray-700 border-gray-600 opacity-75' : 'bg-gray-50 border-gray-200 opacity-75'
        : darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-start space-x-3">
        {/* Complete Checkbox */}
        <button
          onClick={onToggleComplete}
          className={`mt-0.5 ${task.completed ? 'text-green-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}
        >
          {task.completed ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={`font-medium ${
                task.completed 
                  ? 'line-through text-gray-500' 
                  : darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {task.text}
              </h4>
              
              {task.description && (
                <p className={`text-sm mt-1 ${
                  task.completed
                    ? 'text-gray-500'
                    : darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {task.description}
                </p>
              )}

              {/* Task Meta */}
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  {getCategoryIcon(task.category)}
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {task.category}
                  </span>
                </div>
                
                <div className={`px-2 py-1 rounded text-xs ${getPriorityColor(task.priority, darkMode)}`}>
                  {task.priority}
                </div>
                
                <div className="flex items-center space-x-1">
                  <Clock className={`w-3 h-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {task.completedPomodoros}/{task.estimatedPomodoros} 🍅
                  </span>
                </div>

                {task.dueDate && (
                  <div className={`flex items-center space-x-1 ${
                    isOverdue(task.dueDate) ? 'text-red-500' : darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs">
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {!task.completed && (
                <button
                  onClick={onStart}
                  className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
                >
                  Başla
                </button>
              )}
              
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === task.id ? null : task.id)}
                  className={`p-1 rounded hover:bg-opacity-10 hover:bg-gray-500 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {activeDropdown === task.id && (
                  <div className={`absolute right-0 top-8 w-32 py-2 rounded-lg shadow-lg border z-10 ${
                    darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
                  }`}>
                    <button
                      onClick={() => {
                        onDelete(task.id);
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
          </div>
        </div>
      </div>
    </div>
  );
}