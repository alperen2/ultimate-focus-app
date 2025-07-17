import { useCallback } from 'react';
import { Task, Session, AppSettings } from '@/types';

interface UseDataManagerProps {
  settings: AppSettings;
  completedSessions: Session[];
  taskQueue: Task[];
  todaySessions: number;
  currentStreak: number;
  totalFocusTime: number;
  onImportSessions: (sessions: Session[]) => void;
  onImportTasks: (tasks: Task[]) => void;
  onImportStats: (stats: { totalFocusTime?: number; currentStreak?: number }) => void;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onClearAll: () => void;
}

export function useDataManager({
  settings,
  completedSessions,
  taskQueue,
  todaySessions,
  currentStreak,
  totalFocusTime,
  onImportSessions,
  onImportTasks,
  onImportStats,
  onUpdateSettings,
  onClearAll
}: UseDataManagerProps) {

  const exportData = useCallback(() => {
    const data = {
      completedSessions,
      taskQueue,
      settings,
      stats: {
        totalFocusTime,
        currentStreak,
        todaySessions
      },
      exportDate: new Date().toISOString(),
      version: '2.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ultimate-focus-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert('📊 Data exported successfully! File downloaded to your Downloads folder.');
  }, [completedSessions, taskQueue, settings, totalFocusTime, currentStreak, todaySessions]);

  const importData = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target!.result as string);
          
          if (!data.version) {
            alert('⚠️ This appears to be an older export format. Some data might not import correctly.');
          }
          
          if (data.completedSessions && Array.isArray(data.completedSessions)) {
            onImportSessions(data.completedSessions);
          }
          
          if (data.taskQueue && Array.isArray(data.taskQueue)) {
            onImportTasks(data.taskQueue);
          }
          
          if (data.settings) {
            onUpdateSettings(data.settings);
          }
          
          if (data.stats) {
            onImportStats(data.stats);
          }
          
          alert('✅ Data imported successfully! All your settings and progress have been restored.');
        } catch (error) {
          console.error('Import error:', error);
          alert('❌ Invalid file format. Please select a valid Ultimate Focus export file.');
        }
      };
      reader.readAsText(file);
    }
    
    event.target.value = '';
  }, [onImportSessions, onImportTasks, onImportStats, onUpdateSettings]);

  const clearAllData = useCallback(() => {
    if (confirm('⚠️ Are you sure you want to clear all data? This action cannot be undone.\n\nThis will delete:\n• All completed sessions\n• Task queue\n• Settings\n• Progress stats')) {
      onClearAll();
      alert('🗑️ All data cleared successfully! You can start fresh.');
    }
  }, [onClearAll]);

  return {
    exportData,
    importData,
    clearAllData
  };
}