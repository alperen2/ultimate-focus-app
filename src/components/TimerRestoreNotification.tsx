import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, X } from 'lucide-react';

interface TimerRestoreNotificationProps {
  show: boolean;
  onClose: () => void;
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  currentTask: string;
  darkMode: boolean;
  formatTime: (seconds: number) => string;
}

export default function TimerRestoreNotification({
  show,
  onClose,
  timeLeft,
  isRunning,
  isPaused,
  currentTask,
  darkMode,
  formatTime
}: TimerRestoreNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted before showing to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  }, [onClose]);

  useEffect(() => {
    if (show && isMounted) {
      setIsVisible(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [show, isMounted, handleClose]);

  if (!show || !isMounted) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`rounded-xl shadow-lg p-4 max-w-sm border-l-4 border-indigo-500 ${
        darkMode 
          ? 'bg-gray-800 border-gray-700 text-white' 
          : 'bg-white border-gray-200 text-gray-900'
      }`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <RefreshCw className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold mb-1">
              Timer Restored
            </h4>
            <p className={`text-xs mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Your previous session was restored
            </p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  Time:
                </span>
                <span className="font-mono font-medium">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  Status:
                </span>
                <span className={`font-medium ${
                  isRunning 
                    ? 'text-green-500' 
                    : isPaused 
                      ? 'text-yellow-500' 
                      : 'text-gray-500'
                }`}>
                  {isRunning ? 'Running' : isPaused ? 'Paused' : 'Stopped'}
                </span>
              </div>
              {currentTask && (
                <div className="flex justify-between text-xs">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    Task:
                  </span>
                  <span className="font-medium max-w-32 truncate">
                    {currentTask}
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            className={`flex-shrink-0 p-1 rounded-md transition-colors ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' 
                : 'hover:bg-gray-100 text-gray-400 hover:text-gray-500'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}