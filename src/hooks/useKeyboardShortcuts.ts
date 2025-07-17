import { useEffect } from 'react';
import { TabType } from '@/types';

interface UseKeyboardShortcutsProps {
  isRunning: boolean;
  isPaused: boolean;
  activeTab: TabType;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  setActiveTab: (tab: TabType) => void;
}

export function useKeyboardShortcuts({
  isRunning,
  isPaused,
  activeTab,
  startTimer,
  pauseTimer,
  resumeTimer,
  stopTimer,
  resetTimer,
  setActiveTab
}: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      
      switch(e.key) {
        case ' ':
          e.preventDefault();
          if (isRunning) {
            pauseTimer();
          } else if (isPaused) {
            resumeTimer();
          } else {
            startTimer();
          }
          break;
        case 't':
        case 'T':
          e.preventDefault();
          if (isRunning || isPaused) {
            stopTimer();
          }
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          resetTimer();
          break;
        case 's':
        case 'S':
          e.preventDefault();
          setActiveTab(activeTab === 'settings' ? 'focus' : 'settings');
          break;
        case 'a':
        case 'A':
          e.preventDefault();
          setActiveTab('analytics');
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          setActiveTab('focus');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isRunning, isPaused, activeTab, startTimer, pauseTimer, resumeTimer, stopTimer, resetTimer, setActiveTab]);
}