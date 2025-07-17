import { useState, useRef, useCallback, useEffect } from 'react';
import { AppSettings, Session, CategoryType } from '@/types';
import { useTimerPersistence } from './useTimerPersistence';
import { useAuth } from '@/contexts/AuthContext';

interface UseTimerProps {
  settings: AppSettings;
  onSessionComplete: (session: Session) => void;
  showNotification: (title: string, body: string) => void;
  playNotificationSound: () => void;
}

export function useTimer({ settings, onSessionComplete, showNotification, playNotificationSound }: UseTimerProps) {
  const { saveTimerState, loadTimerState, clearTimerState, shouldRestoreTimer } = useTimerPersistence();
  const { user } = useAuth();
  
  const [currentTask, setCurrentTask] = useState('');
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [taskCategory, setTaskCategory] = useState<CategoryType>('work');
  const [initialTime, setInitialTime] = useState(settings.focusDuration * 60);
  const [isInitialized, setIsInitialized] = useState(false);
  const [wasRestored, setWasRestored] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousUserRef = useRef<string | null>(null);

  // Clear timer state when user changes (login/logout)
  useEffect(() => {
    const currentUserId = user?.id || null;
    const previousUserId = previousUserRef.current;
    
    // If user just logged in (previous was null/different, current is not null)
    if (previousUserId !== currentUserId && currentUserId !== null) {
      console.log('User logged in, clearing timer state');
      clearTimerState();
      // Reset timer to initial state
      setCurrentTask('');
      setTimeLeft(settings.focusDuration * 60);
      setIsRunning(false);
      setIsPaused(false);
      setIsBreak(false);
      setSessionCount(0);
      setTaskCategory('work');
      setInitialTime(settings.focusDuration * 60);
      setWasRestored(false);
    }
    
    previousUserRef.current = currentUserId;
  }, [user?.id, clearTimerState, settings.focusDuration]);

  // Initialize timer state from localStorage on component mount
  useEffect(() => {
    if (isInitialized) return;

    if (shouldRestoreTimer()) {
      const savedState = loadTimerState();
      if (savedState) {
        console.log('Restoring timer state:', savedState);
        setWasRestored(true);
        
        if (savedState.currentTask !== undefined) setCurrentTask(savedState.currentTask);
        if (savedState.timeLeft !== undefined) setTimeLeft(savedState.timeLeft);
        if (savedState.isRunning !== undefined) setIsRunning(savedState.isRunning);
        if (savedState.isPaused !== undefined) setIsPaused(savedState.isPaused);
        if (savedState.isBreak !== undefined) setIsBreak(savedState.isBreak);
        if (savedState.sessionCount !== undefined) setSessionCount(savedState.sessionCount);
        if (savedState.taskCategory !== undefined) setTaskCategory(savedState.taskCategory);
        if (savedState.initialTime !== undefined) setInitialTime(savedState.initialTime);

        // If the timer had completed while away, trigger completion
        if (savedState.timeLeft === 0 && (savedState.isRunning || savedState.isPaused)) {
          // Mark as completed session since time expired while away
          setTimeLeft(0);
          setIsRunning(false);
          setIsPaused(false);
        }
      }
    }
    
    setIsInitialized(true);
  }, [isInitialized, shouldRestoreTimer, loadTimerState]);

  // Save timer state to localStorage
  const saveCurrentState = useCallback(() => {
    if (!isInitialized) return;
    
    saveTimerState({
      currentTask,
      timeLeft,
      isRunning,
      isPaused,
      isBreak,
      sessionCount,
      taskCategory,
      initialTime
    });
  }, [isInitialized, saveTimerState, currentTask, timeLeft, isRunning, isPaused, isBreak, sessionCount, taskCategory, initialTime]);

  // Auto-save timer state whenever it changes
  useEffect(() => {
    if (isInitialized) {
      saveCurrentState();
    }
  }, [isInitialized, saveCurrentState]);

  const startTimer = useCallback(() => {
    if (!currentTask.trim() && !isBreak) {
      alert('Please enter a task to focus on!');
      return;
    }
    setIsRunning(true);
    setIsPaused(false);
  }, [currentTask, isBreak]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(true);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    if (isBreak) {
      setTimeLeft(settings.focusDuration * 60);
      setInitialTime(settings.focusDuration * 60);
      setIsBreak(false);
    } else {
      setTimeLeft(initialTime);
    }
  }, [isBreak, settings.focusDuration, initialTime]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setIsBreak(false);
    const newTime = settings.focusDuration * 60;
    setTimeLeft(newTime);
    setInitialTime(newTime);
    // Clear saved state when resetting
    clearTimerState();
  }, [settings.focusDuration, clearTimerState]);

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    
    if (!isBreak) {
      // Completed a focus session
      const newSession: Session = {
        id: Date.now(),
        task: currentTask,
        category: taskCategory,
        duration: settings.focusDuration,
        completedAt: new Date(),
        date: new Date().toDateString()
      };
      
      onSessionComplete(newSession);
      setSessionCount(prev => prev + 1);
      
      // Determine break type
      const isLongBreak = (sessionCount + 1) % settings.longBreakInterval === 0;
      const breakDuration = isLongBreak ? settings.longBreakDuration : settings.shortBreakDuration;
      const breakTime = breakDuration * 60;
      
      setIsBreak(true);
      setTimeLeft(breakTime);
      setInitialTime(breakTime);
      
      showNotification(
        `Focus session complete! 🎉`,
        `Great job! Time for a ${isLongBreak ? 'long' : 'short'} break.`
      );
      
      if (settings.autoStartBreaks) {
        setTimeout(() => setIsRunning(true), 1000);
      }
    } else {
      // Completed a break
      setIsBreak(false);
      const focusTime = settings.focusDuration * 60;
      setTimeLeft(focusTime);
      setInitialTime(focusTime);
      
      showNotification(
        'Break time over! 💪',
        'Ready to start your next focus session?'
      );
      
      if (settings.autoStartSessions) {
        setTimeout(() => setIsRunning(true), 1000);
      }
    }
    
    if (settings.soundEnabled) {
      playNotificationSound();
    }
  }, [isBreak, currentTask, taskCategory, settings, sessionCount, onSessionComplete, showNotification, playNotificationSound]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, handleTimerComplete]);

  // Update timer when settings change
  useEffect(() => {
    if (!isRunning && !isPaused && !isBreak) {
      const newTime = settings.focusDuration * 60;
      setTimeLeft(newTime);
      setInitialTime(newTime);
    }
  }, [settings.focusDuration, isRunning, isPaused, isBreak]);

  return {
    currentTask,
    setCurrentTask,
    timeLeft,
    isRunning,
    isPaused,
    isBreak,
    sessionCount,
    taskCategory,
    setTaskCategory,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    wasRestored,
    dismissRestoreNotification: () => setWasRestored(false)
  };
}