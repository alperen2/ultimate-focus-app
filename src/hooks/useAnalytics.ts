import { useState, useEffect } from 'react';
import { Session } from '@/types';
import { useLocalStorage } from './useLocalStorage';

export function useAnalytics() {
  const [completedSessions, setCompletedSessions] = useLocalStorage<Session[]>('focus-app-completedSessions', []);
  const [todaySessions, setTodaySessions] = useState(0);
  const [currentStreak, setCurrentStreak] = useLocalStorage('focus-app-currentStreak', 0);
  const [totalFocusTime, setTotalFocusTime] = useLocalStorage('focus-app-totalFocusTime', 0);

  // Calculate today's sessions and streak when completedSessions changes
  useEffect(() => {
    const today = new Date().toDateString();
    const todayCount = completedSessions.filter((session: Session) => session.date === today).length;
    setTodaySessions(todayCount);

    // Calculate current streak
    const sortedSessions = [...completedSessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const uniqueDates = [...new Set(sortedSessions.map((session: Session) => session.date))];
    
    let streak = 0;
    const today_ms = new Date().setHours(0, 0, 0, 0);
    
    for (let i = 0; i < uniqueDates.length; i++) {
      const date_ms = new Date(uniqueDates[i] || '').setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today_ms - date_ms) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === i) {
        streak++;
      } else {
        break;
      }
    }
    
    setCurrentStreak(streak);
  }, [completedSessions, setCurrentStreak]);

  const addSession = (session: Session) => {
    setCompletedSessions(prev => [...prev, session]);
    setTodaySessions(prev => prev + 1);
    setTotalFocusTime(prev => prev + session.duration);
  };

  const clearAllSessions = () => {
    setCompletedSessions([]);
    setTodaySessions(0);
    setCurrentStreak(0);
    setTotalFocusTime(0);
  };

  const importSessions = (sessions: Session[]) => {
    setCompletedSessions(sessions);
  };

  const importStats = (stats: { totalFocusTime?: number; currentStreak?: number }) => {
    if (stats.totalFocusTime !== undefined) setTotalFocusTime(stats.totalFocusTime);
    if (stats.currentStreak !== undefined) setCurrentStreak(stats.currentStreak);
  };

  return {
    completedSessions,
    todaySessions,
    currentStreak,
    totalFocusTime,
    addSession,
    clearAllSessions,
    importSessions,
    importStats
  };
}