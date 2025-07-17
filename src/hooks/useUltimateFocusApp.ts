import { useState } from 'react';
import { TabType, CategoryType } from '@/types';
import { useSettings } from './useSettings';
import { useNotifications } from './useNotifications';
import { useTimer } from './useTimer';
import { useTaskQueue } from './useTaskQueue';
import { useAnalytics } from './useAnalytics';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { useDataManager } from './useDataManager';

export function useUltimateFocusApp() {
  const [activeTab, setActiveTab] = useState<TabType>('focus');

  // Initialize hooks
  const { settings, updateSetting, resetSettings } = useSettings();
  const { showNotification, playNotificationSound } = useNotifications();
  const {
    completedSessions,
    todaySessions,
    currentStreak,
    totalFocusTime,
    addSession,
    clearAllSessions,
    importSessions,
    importStats
  } = useAnalytics();

  const timer = useTimer({
    settings,
    onSessionComplete: addSession,
    showNotification,
    playNotificationSound
  });

  const taskQueue = useTaskQueue();

  // Handle task selection from queue
  const handleTaskSelect = (text: string, category: CategoryType) => {
    timer.setCurrentTask(text);
    timer.setTaskCategory(category);
    timer.resetTimer();
  };

  // Data management
  const handleClearAll = () => {
    clearAllSessions();
    taskQueue.clearAllTasks();
    resetSettings();
  };

  const { exportData, importData, clearAllData } = useDataManager({
    settings,
    completedSessions,
    taskQueue: taskQueue.taskQueue,
    todaySessions,
    currentStreak,
    totalFocusTime,
    onImportSessions: importSessions,
    onImportTasks: taskQueue.importTasks,
    onImportStats: importStats,
    onUpdateSettings: (newSettings) => {
      Object.entries(newSettings).forEach(([key, value]) => {
        updateSetting(key as keyof typeof settings, value);
      });
    },
    onClearAll: handleClearAll
  });

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

  return {
    // UI State
    activeTab,
    setActiveTab,
    
    // Settings
    settings,
    updateSetting,
    
    // Timer
    timer,
    
    // Task Queue
    taskQueue,
    handleTaskSelect,
    
    // Analytics
    analytics: {
      completedSessions,
      todaySessions,
      currentStreak,
      totalFocusTime
    },
    
    // Data Management
    exportData,
    importData,
    clearAllData
  };
}