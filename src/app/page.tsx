"use client";

import React, { useState, useEffect } from 'react';
import { BarChart3, Target, Settings, Moon, Sun, Volume2, VolumeX, LogOut, FolderOpen } from 'lucide-react';
import Timer from '@/components/Timer';
import TaskQueue from '@/components/TaskQueue';
import Analytics from '@/components/Analytics';
import SettingsComponent from '@/components/Settings';
import Projects from '@/components/Projects';
import ProjectTaskList from '@/components/ProjectTaskList';
import LoginForm from '@/components/auth/LoginForm';
import TimerRestoreNotification from '@/components/TimerRestoreNotification';
import { CategoryType, PriorityType, AmbientSoundType, TabType } from '@/types';
import { formatTime, getPriorityColor, getCategoryIcon, getRandomBreakSuggestion } from '@/utils/helpers';
import { useUltimateFocusAppWithAuth } from '@/hooks/useUltimateFocusAppWithAuth';
import { useAuth } from '@/contexts/AuthContext';

export default function UltimateFocusApp() {
  const [mounted, setMounted] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by showing loading until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user) {
    return <LoginForm darkMode={true} />;
  }

  return <AuthenticatedApp />;
}

function AuthenticatedApp() {
  const { signOut } = useAuth();
  const {
    activeTab,
    setActiveTab,
    settings,
    updateSetting,
    timer,
    taskQueue,
    analytics,
    exportData,
    importData,
    // Projects
    projects,
    selectedProject,
    setSelectedProject,
    projectTasks,
    createProject,
    updateProject,
    deleteProject,
    createTask,
    updateTask,
    deleteTask,
    loading
  } = useUltimateFocusAppWithAuth();

  // Constants
  const categories: CategoryType[] = ['work', 'personal', 'learning', 'creative', 'health'];
  const priorities: PriorityType[] = ['low', 'medium', 'high', 'urgent'];
  const ambientSounds: AmbientSoundType[] = ['none', 'rain', 'coffee-shop', 'forest', 'ocean', 'white-noise'];

  const tabs = [
    { id: 'focus' as TabType, label: 'Focus', icon: Target },
    { id: 'projects' as TabType, label: 'Projects', icon: FolderOpen },
    { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings }
  ];

  // Show loading while data is being fetched
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        settings.darkMode 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-blue-50 to-indigo-100'
      }`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={settings.darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Loading your data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      settings.darkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    } p-4`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <h1 className={`text-4xl font-bold ${
              settings.darkMode ? 'text-white' : 'text-gray-800'
            } mr-4`}>Ultimate Focus</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => updateSetting('darkMode', !settings.darkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  settings.darkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {settings.darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                className={`p-2 rounded-lg transition-colors ${
                  settings.darkMode 
                    ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <button
                onClick={() => signOut()}
                className={`p-2 rounded-lg transition-colors ${
                  settings.darkMode 
                    ? 'bg-gray-700 text-red-400 hover:bg-gray-600' 
                    : 'bg-white text-red-600 hover:bg-gray-50'
                }`}
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className={`${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Your ultimate productivity companion with advanced focus tracking
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className={`flex space-x-1 p-1 rounded-lg ${
            settings.darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : settings.darkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        {activeTab === 'focus' && (
          <div className="space-y-6">
            <Timer
              timeLeft={timer.timeLeft}
              isRunning={timer.isRunning}
              isPaused={timer.isPaused}
              isBreak={timer.isBreak}
              currentTask={timer.currentTask}
              taskCategory={timer.taskCategory}
              todaySessions={analytics.todaySessions}
              dailyGoal={settings.dailyGoal}
              currentStreak={analytics.currentStreak}
              sessionCount={timer.sessionCount}
              longBreakInterval={settings.longBreakInterval}
              darkMode={settings.darkMode}
              categories={categories}
              projects={projects?.map(p => ({ id: p.id, name: p.name, color: p.color }))}
              selectedProjectId={selectedProject?.id}
              onTaskChange={timer.setCurrentTask}
              onCategoryChange={timer.setTaskCategory}
              onProjectChange={setSelectedProject ? (projectId) => {
                const project = projects?.find(p => p.id === projectId);
                setSelectedProject(project || null);
              } : undefined as ((projectId: number | undefined) => void) | undefined}
              onStart={timer.startTimer}
              onPause={timer.pauseTimer}
              onResume={timer.resumeTimer}
              onStop={timer.stopTimer}
              onReset={timer.resetTimer}
              getRandomBreakSuggestion={getRandomBreakSuggestion}
              getCategoryIcon={getCategoryIcon}
              formatTime={formatTime}
            />
            <TaskQueue
              taskQueue={taskQueue.tasks}
              newQueueTask={taskQueue.newQueueTask}
              taskCategory={taskQueue.queueTaskCategory}
              taskPriority={taskQueue.queueTaskPriority}
              darkMode={settings.darkMode}
              categories={categories}
              priorities={priorities}
              onNewTaskChange={taskQueue.setNewQueueTask}
              onCategoryChange={taskQueue.setQueueTaskCategory}
              onPriorityChange={taskQueue.setQueueTaskPriority}
              onAddToQueue={taskQueue.handleAddToQueue}
              onRemoveFromQueue={taskQueue.removeTask}
              onMoveToCurrentTask={taskQueue.handleMoveToCurrentTask}
              getCategoryIcon={getCategoryIcon}
              getPriorityColor={(priority) => getPriorityColor(priority, settings.darkMode)}
            />
          </div>
        )}
        
        {activeTab === 'projects' && (
          <Projects
            projects={projects || []}
            darkMode={settings.darkMode}
            onCreateProject={createProject}
            onUpdateProject={updateProject}
            onDeleteProject={deleteProject}
            onSelectProject={(project) => {
              setSelectedProject(project);
              setActiveTab('project-tasks');
            }}
            selectedProjectId={selectedProject?.id}
          />
        )}

        {activeTab === 'project-tasks' && selectedProject && (
          <ProjectTaskList
            project={selectedProject}
            tasks={projectTasks}
            darkMode={settings.darkMode}
            categories={categories}
            priorities={priorities}
            onCreateTask={createTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onStartTask={(task) => {
              timer.setCurrentTask(task.text);
              timer.setTaskCategory(task.category);
              setActiveTab('focus');
            }}
          />
        )}
        
        {activeTab === 'analytics' && (
          <Analytics
            todaySessions={analytics.todaySessions}
            dailyGoal={settings.dailyGoal}
            totalFocusTime={analytics.totalFocusTime}
            currentStreak={analytics.currentStreak}
            completedSessions={analytics.completedSessions}
            darkMode={settings.darkMode}
            getCategoryIcon={getCategoryIcon}
          />
        )}
        
        {activeTab === 'settings' && (
          <SettingsComponent
            settings={settings}
            darkMode={settings.darkMode}
            ambientSounds={ambientSounds}
            onSettingChange={updateSetting}
            onExportData={exportData}
            onImportData={importData}
            onClearAllData={() => {}}
          />
        )}

        {/* Tips Footer */}
        <div className="mt-8 text-center">
          <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
            settings.darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-semibold mb-2 ${
              settings.darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              {timer.isBreak ? '🌱 Break Tips' : '🎯 Focus Tips'}
            </h3>
            <div className={`text-sm space-y-1 ${
              settings.darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {timer.isBreak ? (
                <>
                  <p>• Step away from your workspace</p>
                  <p>• Do some light physical activity</p>
                  <p>• Practice mindfulness or deep breathing</p>
                  <p>• Hydrate and nourish your body</p>
                </>
              ) : (
                <>
                  <p>• Start with your most important task</p>
                  <p>• Use the queue to capture distracting thoughts</p>
                  <p>• Minimize external interruptions</p>
                  <p>• Celebrate each completed session</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Timer Restore Notification */}
      <TimerRestoreNotification
        show={timer.wasRestored}
        onClose={timer.dismissRestoreNotification}
        timeLeft={timer.timeLeft}
        isRunning={timer.isRunning}
        isPaused={timer.isPaused}
        currentTask={timer.currentTask}
        darkMode={settings.darkMode}
        formatTime={formatTime}
      />
    </div>
  );
}