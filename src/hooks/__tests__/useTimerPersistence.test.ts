import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { useTimerPersistence } from '../useTimerPersistence';
import { CategoryType } from '@/types';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock console.error to avoid noise in tests
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('useTimerPersistence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    consoleErrorSpy.mockClear();
  });

  it('should save timer state to localStorage', () => {
    const { result } = renderHook(() => useTimerPersistence());

    const timerState = {
      currentTask: 'Test Task',
      timeLeft: 1500,
      isRunning: true,
      isPaused: false,
      isBreak: false,
      sessionCount: 1,
      taskCategory: 'work' as CategoryType,
      initialTime: 1500
    };

    act(() => {
      result.current.saveTimerState(timerState);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'ultimate-focus-timer-state',
      JSON.stringify({
        ...timerState,
        lastSaveTime: expect.any(Number)
      })
    );
  });

  it('should handle localStorage save errors gracefully', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });

    const { result } = renderHook(() => useTimerPersistence());

    const timerState = {
      currentTask: 'Test Task',
      timeLeft: 1500,
      isRunning: true,
      isPaused: false,
      isBreak: false,
      sessionCount: 1,
      taskCategory: 'work' as CategoryType,
      initialTime: 1500
    };

    act(() => {
      result.current.saveTimerState(timerState);
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to save timer state:',
      expect.any(Error)
    );
  });

  it('should load timer state from localStorage', () => {
    const savedState = {
      currentTask: 'Saved Task',
      timeLeft: 1200,
      isRunning: false,
      isPaused: true,
      isBreak: false,
      sessionCount: 2,
      taskCategory: 'personal',
      initialTime: 1500,
      lastSaveTime: Date.now()
    };

    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedState));

    const { result } = renderHook(() => useTimerPersistence());

    act(() => {
      const loadedState = result.current.loadTimerState();
      expect(loadedState).toEqual({
        currentTask: 'Saved Task',
        timeLeft: 1200,
        isRunning: false,
        isPaused: true,
        isBreak: false,
        sessionCount: 2,
        taskCategory: 'personal',
        initialTime: 1500
      });
    });
  });

  it('should return null when no saved state exists', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useTimerPersistence());

    act(() => {
      const loadedState = result.current.loadTimerState();
      expect(loadedState).toBeNull();
    });
  });

  it('should adjust time for running timer based on elapsed time', () => {
    const baseTime = Date.now();
    const savedState = {
      currentTask: 'Running Task',
      timeLeft: 1500, // 25 minutes
      isRunning: true,
      isPaused: false,
      isBreak: false,
      sessionCount: 1,
      taskCategory: 'work',
      initialTime: 1500,
      lastSaveTime: baseTime - 30000 // 30 seconds ago
    };

    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedState));
    vi.setSystemTime(baseTime);

    const { result } = renderHook(() => useTimerPersistence());

    act(() => {
      const loadedState = result.current.loadTimerState();
      expect(loadedState).toEqual({
        currentTask: 'Running Task',
        timeLeft: 1470, // 1500 - 30 seconds
        isRunning: true,
        isPaused: false,
        isBreak: false,
        sessionCount: 1,
        taskCategory: 'work',
        initialTime: 1500
      });
    });
  });

  it('should mark timer as not running if time would have expired', () => {
    const baseTime = Date.now();
    const savedState = {
      currentTask: 'Expired Task',
      timeLeft: 30, // 30 seconds
      isRunning: true,
      isPaused: false,
      isBreak: false,
      sessionCount: 1,
      taskCategory: 'work',
      initialTime: 1500,
      lastSaveTime: baseTime - 60000 // 60 seconds ago
    };

    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedState));
    vi.setSystemTime(baseTime);

    const { result } = renderHook(() => useTimerPersistence());

    act(() => {
      const loadedState = result.current.loadTimerState();
      expect(loadedState).toEqual({
        currentTask: 'Expired Task',
        timeLeft: 0,
        isRunning: false,
        isPaused: false,
        isBreak: false,
        sessionCount: 1,
        taskCategory: 'work',
        initialTime: 1500
      });
    });
  });

  it('should not adjust time for paused timer', () => {
    const baseTime = Date.now();
    const savedState = {
      currentTask: 'Paused Task',
      timeLeft: 1200,
      isRunning: false,
      isPaused: true,
      isBreak: false,
      sessionCount: 1,
      taskCategory: 'work',
      initialTime: 1500,
      lastSaveTime: baseTime - 300000 // 5 minutes ago
    };

    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedState));
    vi.setSystemTime(baseTime);

    const { result } = renderHook(() => useTimerPersistence());

    act(() => {
      const loadedState = result.current.loadTimerState();
      expect(loadedState).toEqual({
        currentTask: 'Paused Task',
        timeLeft: 1200, // Should not change
        isRunning: false,
        isPaused: true,
        isBreak: false,
        sessionCount: 1,
        taskCategory: 'work',
        initialTime: 1500
      });
    });
  });

  it('should clear timer state from localStorage', () => {
    const { result } = renderHook(() => useTimerPersistence());

    act(() => {
      result.current.clearTimerState();
    });

    expect(localStorageMock.removeItem).toHaveBeenCalledWith(
      'ultimate-focus-timer-state'
    );
  });

  it('should handle localStorage clear errors gracefully', () => {
    localStorageMock.removeItem.mockImplementation(() => {
      throw new Error('Remove failed');
    });

    const { result } = renderHook(() => useTimerPersistence());

    act(() => {
      result.current.clearTimerState();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to clear timer state:',
      expect.any(Error)
    );
  });

  it('should determine if timer should be restored based on time elapsed', () => {
    const baseTime = Date.now();
    
    // Recent save - should restore
    const recentState = {
      lastSaveTime: baseTime - 3600000 // 1 hour ago
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(recentState));
    vi.setSystemTime(baseTime);

    const { result } = renderHook(() => useTimerPersistence());

    act(() => {
      const shouldRestore = result.current.shouldRestoreTimer();
      expect(shouldRestore).toBe(true);
    });

    // Old save - should not restore
    const oldState = {
      lastSaveTime: baseTime - 86400000 * 2 // 2 days ago
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(oldState));

    act(() => {
      const shouldRestore = result.current.shouldRestoreTimer();
      expect(shouldRestore).toBe(false);
    });
  });

  it('should handle corrupted localStorage data gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid json');

    const { result } = renderHook(() => useTimerPersistence());

    act(() => {
      const loadedState = result.current.loadTimerState();
      expect(loadedState).toBeNull();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to load timer state:',
      expect.any(Error)
    );
  });
});