import React from 'react';
import { Play, Pause, Square, CheckCircle, Zap, Keyboard, StopCircle } from 'lucide-react';
import { CategoryType } from '@/types';

interface TimerProps {
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  isBreak: boolean;
  currentTask: string;
  taskCategory: CategoryType;
  todaySessions: number;
  dailyGoal: number;
  currentStreak: number;
  sessionCount: number;
  longBreakInterval: number;
  darkMode: boolean;
  categories: CategoryType[];
  projects?: Array<{ id: number; name: string; color: string }>;
  selectedProjectId?: number | undefined;
  onTaskChange: (task: string) => void;
  onCategoryChange: (category: CategoryType) => void;
  onProjectChange?: ((projectId: number | undefined) => void) | undefined;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReset: () => void;
  getRandomBreakSuggestion: () => string;
  getCategoryIcon: (category: string) => string;
  formatTime: (seconds: number) => string;
}

export default function Timer({
  timeLeft,
  isRunning,
  isPaused,
  isBreak,
  currentTask,
  taskCategory,
  todaySessions,
  dailyGoal,
  currentStreak,
  sessionCount,
  longBreakInterval,
  darkMode,
  categories,
  projects,
  selectedProjectId,
  onTaskChange,
  onCategoryChange,
  onProjectChange,
  onStart,
  onPause,
  onResume,
  onStop,
  onReset,
  getRandomBreakSuggestion,
  getCategoryIcon,
  formatTime
}: TimerProps) {
  return (
    <div className={`rounded-xl shadow-lg p-8 transition-colors duration-300 ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
    }`}>
      <div className="text-center mb-6">
        <div className={`text-6xl font-mono mb-4 ${
          darkMode ? 'text-indigo-400' : 'text-indigo-600'
        }`}>
          {formatTime(timeLeft)}
        </div>
        
        <div className={`text-sm mb-2 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {isBreak ? 'Break Time' : 'Focus Time'}
        </div>
        
        <div className={`flex items-center justify-center space-x-4 text-sm ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-4 h-4" />
            <span>{todaySessions}/{dailyGoal} today</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4" />
            <span>{currentStreak} day streak</span>
          </div>
        </div>
      </div>

      {!isBreak ? (
        <div className="mb-8">
          {/* Task Input Section */}
          <div className={`rounded-xl p-6 mb-4 transition-all duration-300 ${
            darkMode 
              ? 'bg-gray-700/50 border border-gray-600/50' 
              : 'bg-indigo-50/50 border border-indigo-100'
          }`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-3 h-3 rounded-full ${
                currentTask.trim() 
                  ? 'bg-indigo-500' 
                  : darkMode ? 'bg-gray-500' : 'bg-gray-300'
              }`}></div>
              <label className={`text-sm font-semibold tracking-wide uppercase ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Focus Task
              </label>
            </div>
            
            <input
              type="text"
              value={currentTask}
              onChange={(e) => onTaskChange(e.target.value)}
              placeholder="What will you accomplish in this session?"
              className={`w-full px-5 py-4 border-0 rounded-xl text-lg font-medium placeholder:text-base placeholder:font-normal focus:ring-3 focus:ring-indigo-500/30 transition-all duration-300 shadow-sm ${
                isRunning 
                  ? darkMode 
                    ? 'bg-gray-800 text-gray-400 cursor-not-allowed shadow-inner' 
                    : 'bg-gray-100 text-gray-500 cursor-not-allowed shadow-inner'
                  : darkMode 
                    ? 'bg-gray-800 text-white placeholder-gray-400 hover:bg-gray-750 shadow-lg focus:shadow-xl' 
                    : 'bg-white text-gray-900 placeholder-gray-400 hover:shadow-md focus:shadow-lg'
              }`}
              disabled={isRunning}
            />
          </div>

          {/* Project Selection */}
          {projects && projects.length > 0 && (
            <div className={`rounded-xl p-6 transition-all duration-300 ${
              darkMode 
                ? 'bg-gray-700/50 border border-gray-600/50' 
                : 'bg-slate-50/50 border border-slate-100'
            }`}>
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-xl">📁</span>
                <label className={`text-sm font-semibold tracking-wide uppercase ${
                  darkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  Project
                </label>
              </div>
              
              <div className="relative">
                <select
                  value={selectedProjectId || ''}
                  onChange={(e) => onProjectChange?.(e.target.value ? parseInt(e.target.value) : undefined)}
                  className={`w-full px-5 py-4 border-0 rounded-xl text-base font-medium focus:ring-3 focus:ring-indigo-500/30 transition-all duration-300 shadow-sm appearance-none cursor-pointer ${
                    isRunning 
                      ? darkMode 
                        ? 'bg-gray-800 text-gray-400 cursor-not-allowed shadow-inner' 
                        : 'bg-gray-100 text-gray-500 cursor-not-allowed shadow-inner'
                      : darkMode 
                        ? 'bg-gray-800 text-white hover:bg-gray-750 shadow-lg focus:shadow-xl' 
                        : 'bg-white text-gray-900 hover:shadow-md focus:shadow-lg'
                  }`}
                  disabled={isRunning}
                >
                  <option value="">No project selected</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                
                {/* Custom dropdown arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center px-5 pointer-events-none">
                  <svg className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* Project indicator */}
              {selectedProjectId && (
                <div className="mt-3 flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: projects.find(p => p.id === selectedProjectId)?.color }}
                  />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Working on: {projects.find(p => p.id === selectedProjectId)?.name}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Category Selection */}
          <div className={`rounded-lg p-3 transition-all duration-300 ${
            darkMode 
              ? 'bg-gray-700/30 border border-gray-600/30' 
              : 'bg-slate-50/30 border border-slate-100'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm">{getCategoryIcon(taskCategory)}</span>
              <label className={`text-xs font-medium uppercase tracking-wide ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Category
              </label>
            </div>
            
            <div className="relative">
              <select
                value={taskCategory}
                onChange={(e) => onCategoryChange(e.target.value as CategoryType)}
                className={`w-full px-3 py-2 border-0 rounded-lg text-sm font-medium appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500/30 transition-all duration-300 shadow-sm pr-8 ${
                  isRunning 
                    ? darkMode 
                      ? 'bg-gray-800 text-gray-400 cursor-not-allowed shadow-inner' 
                      : 'bg-gray-100 text-gray-500 cursor-not-allowed shadow-inner'
                    : darkMode 
                      ? 'bg-gray-800 text-white hover:bg-gray-750 shadow-md focus:shadow-lg' 
                      : 'bg-white text-gray-900 hover:shadow-md focus:shadow-lg'
                }`}
                disabled={isRunning}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className={darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}>
                    {getCategoryIcon(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              
              {/* Custom Dropdown Arrow */}
              <div className={`absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none transition-colors duration-300 ${
                isRunning 
                  ? darkMode ? 'text-gray-500' : 'text-gray-400'
                  : darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 text-center">
          <div className={`text-lg font-medium mb-2 ${
            darkMode ? 'text-green-400' : 'text-green-600'
          }`}>
            {sessionCount % longBreakInterval === 0 && sessionCount > 0 ? 'Long Break Time! 🎉' : 'Break Time! 🌱'}
          </div>
          <p className={`text-sm mb-4 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {getRandomBreakSuggestion()}
          </p>
        </div>
      )}

      {/* Timer Controls */}
      <div className="flex justify-center space-x-3 mb-6">
        {!isRunning && !isPaused ? (
          <button
            onClick={onStart}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Play className="w-5 h-5" />
            <span>Start {isBreak ? 'Break' : 'Focus'}</span>
          </button>
        ) : isPaused ? (
          <button
            onClick={onResume}
            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Play className="w-5 h-5" />
            <span>Resume</span>
          </button>
        ) : (
          <button
            onClick={onPause}
            className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Pause className="w-5 h-5" />
            <span>Pause</span>
          </button>
        )}
        
        {(isRunning || isPaused) && (
          <button
            onClick={onStop}
            className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            <StopCircle className="w-5 h-5" />
            <span>Stop</span>
          </button>
        )}
        
        <button
          onClick={onReset}
          className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Square className="w-5 h-5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Keyboard Shortcuts */}
      <div className={`text-center text-xs ${
        darkMode ? 'text-gray-500' : 'text-gray-400'
      }`}>
        <Keyboard className="w-4 h-4 inline mr-1" />
        Shortcuts: Space (start/pause/resume), T (stop), R (reset), S (settings)
      </div>
    </div>
  );
}