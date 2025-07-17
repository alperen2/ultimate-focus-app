import { useRef, useCallback, useEffect } from 'react';

export function useNotifications() {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const showNotification = useCallback((title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }, []);

  const playNotificationSound = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    }
    
    const oscillator = audioContextRef.current!.createOscillator();
    const gainNode = audioContextRef.current!.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current!.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContextRef.current!.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current!.currentTime + 0.5);
    
    oscillator.start(audioContextRef.current!.currentTime);
    oscillator.stop(audioContextRef.current!.currentTime + 0.5);
  }, []);

  return {
    showNotification,
    playNotificationSound
  };
}