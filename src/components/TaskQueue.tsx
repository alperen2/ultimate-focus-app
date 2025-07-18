import React from 'react';
import { Plus, Trash2, Clock } from 'lucide-react';
import { Task, CategoryType, PriorityType } from '@/types';

interface TaskQueueProps {
  taskQueue: Task[];
  newQueueTask: string;
  taskCategory: CategoryType;
  taskPriority: PriorityType;
  darkMode: boolean;
  categories: CategoryType[];
  priorities: PriorityType[];
  isAddingTask?: boolean;
  onNewTaskChange: (task: string) => void;
  onCategoryChange: (category: CategoryType) => void;
  onPriorityChange: (priority: PriorityType) => void;
  onAddToQueue: () => void;
  onRemoveFromQueue: (id: number) => void;
  onMoveToCurrentTask: (task: Task) => void;
  getCategoryIcon: (category: string) => string;
  getPriorityColor: (priority: string) => string;
}

export default function TaskQueue({
  taskQueue,
  newQueueTask,
  taskCategory,
  taskPriority,
  darkMode,
  categories,
  priorities,
  isAddingTask = false,
  onNewTaskChange,
  onCategoryChange,
  onPriorityChange,
  onAddToQueue,
  onRemoveFromQueue,
  onMoveToCurrentTask,
  getCategoryIcon,
  getPriorityColor
}: TaskQueueProps) {
  return (
    <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
    }`}>
      <h2 className={`text-xl font-semibold mb-4 ${
        darkMode ? 'text-white' : 'text-gray-800'
      }`}>Task Queue</h2>
      
      {/* Add Task Form */}
      <div className="space-y-3 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newQueueTask}
            onChange={(e) => onNewTaskChange(e.target.value)}
            placeholder="Add task to queue..."
            className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            onKeyPress={(e) => e.key === 'Enter' && !isAddingTask && onAddToQueue()}
          />
          
          <button
            onClick={onAddToQueue}
            disabled={!newQueueTask.trim() || isAddingTask}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              !newQueueTask.trim() || isAddingTask
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-md hover:shadow-lg'
            }`}
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">{isAddingTask ? 'Adding...' : 'Add Task'}</span>
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <label className={`block text-xs font-medium mb-1 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Category
            </label>
            <select
              value={taskCategory}
              onChange={(e) => onCategoryChange(e.target.value as CategoryType)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className={darkMode ? 'bg-gray-700' : 'bg-white'}>
                  {getCategoryIcon(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className={`block text-xs font-medium mb-1 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Priority
            </label>
            <select
              value={taskPriority}
              onChange={(e) => onPriorityChange(e.target.value as PriorityType)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {priorities.map(priority => (
                <option key={priority} value={priority} className={darkMode ? 'bg-gray-700' : 'bg-white'}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {taskQueue.length === 0 ? (
          <div className="text-center py-8">
            <Clock className={`w-12 h-12 mx-auto mb-4 ${
              darkMode ? 'text-gray-600' : 'text-gray-300'
            }`} />
            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              No tasks in queue
            </p>
          </div>
        ) : (
          taskQueue.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <div 
                className="flex-1 cursor-pointer"
                onClick={() => onMoveToCurrentTask(task)}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getCategoryIcon(task.category)}</span>
                  <span className={`${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  } hover:text-indigo-600`}>
                    {task.text}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onRemoveFromQueue(task.id)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}