import { AppSettings, Session, Task } from '@/types';
import { useLocalStorage } from './useLocalStorage';

const defaultSettings: AppSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  dailyGoal: 8,
  darkMode: false,
  soundEnabled: true,
  autoStartBreaks: false,
  autoStartSessions: false,
  ambientSound: 'none'
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>('focus-app-settings', defaultSettings);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const exportData = (completedSessions: Session[], taskQueue: Task[], stats: { totalFocusTime: number; currentStreak: number; todaySessions: number }) => {
    const data = {
      completedSessions,
      taskQueue,
      settings,
      stats,
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
  };

  return {
    settings,
    updateSetting,
    resetSettings,
    exportData
  };
}