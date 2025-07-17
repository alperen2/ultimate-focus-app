import { useCallback } from 'react';
import { CategoryType } from '@/types';

interface TimerState {
  currentTask: string;
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  isBreak: boolean;
  sessionCount: number;
  taskCategory: CategoryType;
  initialTime: number;
  lastSaveTime: number; // Timestamp when timer was saved
}

const TIMER_STORAGE_KEY = 'ultimate-focus-timer-state';

export function useTimerPersistence() {
  const saveTimerState = useCallback((state: Omit<TimerState, 'lastSaveTime'>) => {
    const timerState: TimerState = {
      ...state,
      lastSaveTime: Date.now()
    };
    
    try {
      localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(timerState));
    } catch (error) {
      console.error('Failed to save timer state:', error);
    }
  }, []);

  const loadTimerState = useCallback((): Partial<TimerState> | null => {
    try {
      const saved = localStorage.getItem(TIMER_STORAGE_KEY);
      if (!saved) return null;

      const state: TimerState = JSON.parse(saved);
      const now = Date.now();
      const timeSinceLastSave = Math.floor((now - state.lastSaveTime) / 1000);

      // If timer was running when saved, calculate elapsed time
      if (state.isRunning && !state.isPaused) {
        const adjustedTimeLeft = Math.max(0, state.timeLeft - timeSinceLastSave);
        
        return {
          ...state,
          timeLeft: adjustedTimeLeft,
          // If time would have expired, mark as not running
          isRunning: adjustedTimeLeft > 0,
          isPaused: false
        };
      }

      // If timer was paused or stopped, return as-is (minus lastSaveTime)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { lastSaveTime, ...stateWithoutTimestamp } = state;
      return stateWithoutTimestamp;
    } catch (error) {
      console.error('Failed to load timer state:', error);
      return null;
    }
  }, []);

  const clearTimerState = useCallback(() => {
    try {
      localStorage.removeItem(TIMER_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear timer state:', error);
    }
  }, []);

  const shouldRestoreTimer = useCallback((): boolean => {
    try {
      const saved = localStorage.getItem(TIMER_STORAGE_KEY);
      if (!saved) return false;

      const state: TimerState = JSON.parse(saved);
      const now = Date.now();
      const timeSinceLastSave = (now - state.lastSaveTime) / 1000;

      // Don't restore if more than 24 hours have passed
      const MAX_RESTORE_TIME = 24 * 60 * 60; // 24 hours in seconds
      
      return timeSinceLastSave < MAX_RESTORE_TIME;
    } catch (error) {
      console.error('Failed to check timer restore condition:', error);
      return false;
    }
  }, []);

  return {
    saveTimerState,
    loadTimerState,
    clearTimerState,
    shouldRestoreTimer
  };
}