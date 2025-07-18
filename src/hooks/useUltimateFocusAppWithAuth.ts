import { useState } from 'react';
import { TabType, CategoryType, Project, Task } from '@/types';
import { useNotifications } from './useNotifications';
import { useTimer } from './useTimer';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { useUserSettings, useUserSessions, useUserTasks, useUserProjects } from './useSupabaseData';
import { useAuth } from '@/contexts/AuthContext';

export function useUltimateFocusAppWithAuth() {
  const { } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('focus');

  // Supabase hooks
  const { settings, updateSettings, loading: settingsLoading } = useUserSettings();
  const { sessions, addSession, loading: sessionsLoading } = useUserSessions();
  const { tasks, addTask, removeTask, updateTask, loading: tasksLoading } = useUserTasks();
  const { projects, addProject, updateProject, removeProject, loading: projectsLoading } = useUserProjects();

  // Project state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Notification hooks
  const { showNotification, playNotificationSound } = useNotifications();

  // Timer hook with Supabase integration
  const timer = useTimer({
    settings: settings || {
      focusDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      longBreakInterval: 4,
      autoStartBreaks: false,
      autoStartSessions: false,
      soundEnabled: true,
      darkMode: true,
      ambientSound: 'none',
      dailyGoal: 8,
      notificationsEnabled: true,
      theme: 'dark'
    },
    onSessionComplete: addSession,
    showNotification,
    playNotificationSound
  });

  // Task queue management
  const [newQueueTask, setNewQueueTask] = useState('');
  const [queueTaskCategory, setQueueTaskCategory] = useState<CategoryType>('work');
  const [queueTaskPriority, setQueueTaskPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');

  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleAddToQueue = async () => {
    if (!newQueueTask.trim() || isAddingTask) return;

    setIsAddingTask(true);
    try {
      const newTask = await addTask({
        text: newQueueTask.trim(),
        description: '',
        projectId: undefined,
        category: queueTaskCategory,
        priority: queueTaskPriority,
        completed: false,
        estimatedPomodoros: 1,
        completedPomodoros: 0,
        dueDate: undefined
      });

      if (newTask) {
        setNewQueueTask('');
      }
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setIsAddingTask(false);
    }
  };

  const handleMoveToCurrentTask = (task: { text: string; category: CategoryType; id: number }) => {
    timer.setCurrentTask(task.text);
    timer.setTaskCategory(task.category);
    removeTask(task.id);
  };

  // Analytics calculations
  const todaySessions = sessions.filter(session => 
    session.date === new Date().toDateString()
  ).length;

  const totalFocusTime = sessions.reduce((total, session) => total + session.duration, 0);

  // Calculate streak (simplified - could be enhanced)
  const currentStreak = calculateStreak(sessions);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    isRunning: timer.isRunning,
    isPaused: timer.isPaused,
    activeTab,
    startTimer: timer.startTimer,
    pauseTimer: timer.pauseTimer,
    resumeTimer: timer.resumeTimer,
    stopTimer: timer.stopTimer,
    resetTimer: timer.resetTimer,
    setActiveTab
  });

  // Project tasks - filter tasks by selected project
  const projectTasks = selectedProject 
    ? tasks.filter(task => task.projectId === selectedProject.id)
    : [];

  // Project management functions
  const createProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await addProject(project);
  };

  const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await addTask(task);
  };

  const deleteProject = async (projectId: number) => {
    await removeProject(projectId);
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
      setActiveTab('projects');
    }
  };

  const deleteTask = async (taskId: number) => {
    await removeTask(taskId);
  };

  // Data export/import functions
  const exportData = () => {
    const data = {
      settings,
      sessions,
      tasks,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ultimate-focus-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Import settings
        if (data.settings) {
          await updateSettings(data.settings);
        }

        // Note: Sessions and tasks import would need additional implementation
        // for bulk operations in Supabase
        console.log('Data imported successfully (settings only for now)');
      } catch (error) {
        console.error('Error importing data:', error);
      }
    };
    reader.readAsText(file);
  };

  const taskQueue = {
    newQueueTask,
    setNewQueueTask,
    queueTaskCategory,
    setQueueTaskCategory,
    queueTaskPriority,
    setQueueTaskPriority,
    handleAddToQueue,
    isAddingTask,
    tasks,
    removeTask,
    handleMoveToCurrentTask
  };

  const analytics = {
    completedSessions: sessions,
    todaySessions,
    currentStreak,
    totalFocusTime
  };

  const defaultSettings = {
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartSessions: false,
    soundEnabled: true,
    darkMode: true,
    ambientSound: 'none' as const,
    dailyGoal: 8,
    notificationsEnabled: true,
    theme: 'dark' as const
  };

  return {
    activeTab,
    setActiveTab,
    settings: settings || defaultSettings,
    updateSetting: async (key: string, value: unknown) => {
      await updateSettings({ [key]: value });
    },
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
    loading: settingsLoading || sessionsLoading || tasksLoading || projectsLoading
  };
}

function calculateStreak(sessions: { date: string }[]): number {
  if (sessions.length === 0) return 0;

  const dates = [...new Set(sessions.map(s => s.date))].sort().reverse();
  let streak = 0;
  
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);
    
    if (date === expectedDate.toDateString()) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}