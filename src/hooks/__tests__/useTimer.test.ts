import { renderHook, act } from '@testing-library/react';
import { useTimer } from '../useTimer';
import { AppSettings } from '@/types';

const mockSettings: AppSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartSessions: false,
  soundEnabled: true,
  theme: 'dark',
  notificationsEnabled: true
};

const mockOnSessionComplete = jest.fn();
const mockShowNotification = jest.fn();
const mockPlayNotificationSound = jest.fn();

describe('useTimer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const renderUseTimer = (settings = mockSettings) => {
    return renderHook(() => useTimer({
      settings,
      onSessionComplete: mockOnSessionComplete,
      showNotification: mockShowNotification,
      playNotificationSound: mockPlayNotificationSound
    }));
  };

  it('should initialize with correct default values', () => {
    const { result } = renderUseTimer();

    expect(result.current.currentTask).toBe('');
    expect(result.current.timeLeft).toBe(25 * 60); // 25 minutes in seconds
    expect(result.current.isRunning).toBe(false);
    expect(result.current.isPaused).toBe(false);
    expect(result.current.isBreak).toBe(false);
    expect(result.current.sessionCount).toBe(0);
    expect(result.current.taskCategory).toBe('work');
  });

  it('should not start timer without a task', () => {
    const { result } = renderUseTimer();

    act(() => {
      result.current.startTimer();
    });

    expect(result.current.isRunning).toBe(false);
    expect(global.alert).toHaveBeenCalledWith('Please enter a task to focus on!');
  });

  it('should start timer with a task', () => {
    const { result } = renderUseTimer();

    act(() => {
      result.current.setCurrentTask('Test task');
    });

    act(() => {
      result.current.startTimer();
    });

    expect(result.current.isRunning).toBe(true);
    expect(result.current.isPaused).toBe(false);
  });

  it('should pause timer correctly', () => {
    const { result } = renderUseTimer();

    act(() => {
      result.current.setCurrentTask('Test task');
      result.current.startTimer();
    });

    act(() => {
      result.current.pauseTimer();
    });

    expect(result.current.isRunning).toBe(false);
    expect(result.current.isPaused).toBe(true);
  });

  it('should resume timer correctly', () => {
    const { result } = renderUseTimer();

    act(() => {
      result.current.setCurrentTask('Test task');
      result.current.startTimer();
      result.current.pauseTimer();
    });

    act(() => {
      result.current.resumeTimer();
    });

    expect(result.current.isRunning).toBe(true);
    expect(result.current.isPaused).toBe(false);
  });

  it('should stop timer and reset to initial time', () => {
    const { result } = renderUseTimer();

    act(() => {
      result.current.setCurrentTask('Test task');
      result.current.startTimer();
    });

    // Advance timer by 30 seconds
    act(() => {
      jest.advanceTimersByTime(30000);
    });

    act(() => {
      result.current.stopTimer();
    });

    expect(result.current.isRunning).toBe(false);
    expect(result.current.isPaused).toBe(false);
    expect(result.current.timeLeft).toBe(25 * 60); // Reset to initial time
  });

  it('should reset timer to settings duration', () => {
    const { result } = renderUseTimer();

    act(() => {
      result.current.setCurrentTask('Test task');
      result.current.startTimer();
    });

    // Advance timer
    act(() => {
      jest.advanceTimersByTime(30000);
    });

    act(() => {
      result.current.resetTimer();
    });

    expect(result.current.isRunning).toBe(false);
    expect(result.current.isPaused).toBe(false);
    expect(result.current.isBreak).toBe(false);
    expect(result.current.timeLeft).toBe(25 * 60);
  });

  it('should decrement time when running', async () => {
    const { result } = renderUseTimer();

    act(() => {
      result.current.setCurrentTask('Test task');
      result.current.startTimer();
    });

    const initialTime = result.current.timeLeft;

    act(() => {
      jest.advanceTimersByTime(5000); // 5 seconds
    });

    expect(result.current.timeLeft).toBe(initialTime - 5);
  });

  it('should not decrement time when paused', () => {
    const { result } = renderUseTimer();

    act(() => {
      result.current.setCurrentTask('Test task');
      result.current.startTimer();
      result.current.pauseTimer();
    });

    const timeWhenPaused = result.current.timeLeft;

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.timeLeft).toBe(timeWhenPaused);
  });

  it('should complete focus session and start break', () => {
    const { result } = renderUseTimer();

    act(() => {
      result.current.setCurrentTask('Test task');
      result.current.setTaskCategory('learning');
      result.current.startTimer();
    });

    // Fast forward to completion
    act(() => {
      jest.advanceTimersByTime(25 * 60 * 1000);
    });

    expect(result.current.isRunning).toBe(false);
    expect(result.current.isBreak).toBe(true);
    expect(result.current.timeLeft).toBe(5 * 60); // Short break duration
    expect(result.current.sessionCount).toBe(1);

    expect(mockOnSessionComplete).toHaveBeenCalledWith({
      id: expect.any(Number),
      task: 'Test task',
      category: 'learning',
      duration: 25,
      completedAt: expect.any(Date),
      date: expect.any(String)
    });

    expect(mockShowNotification).toHaveBeenCalledWith(
      'Focus session complete! 🎉',
      'Great job! Time for a short break.'
    );

    expect(mockPlayNotificationSound).toHaveBeenCalled();
  });

  it('should not play sound when disabled', () => {
    const noSoundSettings = { ...mockSettings, soundEnabled: false };
    const { result } = renderUseTimer(noSoundSettings);

    act(() => {
      result.current.setCurrentTask('Test task');
      result.current.startTimer();
    });

    act(() => {
      jest.advanceTimersByTime(25 * 60 * 1000);
    });

    expect(mockPlayNotificationSound).not.toHaveBeenCalled();
  });

  it('should update timer when settings change', () => {
    const { result, rerender } = renderUseTimer();

    const newSettings = { ...mockSettings, focusDuration: 30 };

    act(() => {
      rerender({
        settings: newSettings,
        onSessionComplete: mockOnSessionComplete,
        showNotification: mockShowNotification,
        playNotificationSound: mockPlayNotificationSound
      });
    });

    expect(result.current.timeLeft).toBe(30 * 60);
  });

  it('should not update timer when running', () => {
    const { result, rerender } = renderUseTimer();

    act(() => {
      result.current.setCurrentTask('Test task');
      result.current.startTimer();
    });

    const timeBeforeUpdate = result.current.timeLeft;
    const newSettings = { ...mockSettings, focusDuration: 30 };

    act(() => {
      rerender({
        settings: newSettings,
        onSessionComplete: mockOnSessionComplete,
        showNotification: mockShowNotification,
        playNotificationSound: mockPlayNotificationSound
      });
    });

    expect(result.current.timeLeft).toBe(timeBeforeUpdate);
  });

  it('should allow starting break timer without task', () => {
    const { result } = renderUseTimer();

    // Complete a focus session to enter break mode
    act(() => {
      result.current.setCurrentTask('Test task');
      result.current.startTimer();
    });

    act(() => {
      jest.advanceTimersByTime(25 * 60 * 1000);
    });

    // Clear task and try to start break timer
    act(() => {
      result.current.setCurrentTask('');
      result.current.startTimer();
    });

    expect(result.current.isRunning).toBe(true); // Should work for breaks
  });

  it('should update task category', () => {
    const { result } = renderUseTimer();

    act(() => {
      result.current.setTaskCategory('creative');
    });

    expect(result.current.taskCategory).toBe('creative');
  });

  it('should auto-start breaks when enabled', () => {
    const autoStartSettings = { ...mockSettings, autoStartBreaks: true };
    const { result } = renderUseTimer(autoStartSettings);

    act(() => {
      result.current.setCurrentTask('Test task');
      result.current.startTimer();
    });

    // Complete focus session
    act(() => {
      jest.advanceTimersByTime(25 * 60 * 1000);
    });

    // Advance by 1 second to trigger auto-start
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.isRunning).toBe(true);
    expect(result.current.isBreak).toBe(true);
  });

  it('should complete break and return to focus mode', () => {
    const { result } = renderUseTimer();

    // Complete a focus session first
    act(() => {
      result.current.setCurrentTask('Test task');
      result.current.startTimer();
    });

    act(() => {
      jest.advanceTimersByTime(25 * 60 * 1000);
    });

    // Now complete the break
    act(() => {
      jest.advanceTimersByTime(5 * 60 * 1000);
    });

    expect(result.current.isBreak).toBe(false);
    expect(result.current.timeLeft).toBe(25 * 60); // Back to focus duration
    expect(mockShowNotification).toHaveBeenLastCalledWith(
      'Break time over! 💪',
      'Ready to start your next focus session?'
    );
  });
});