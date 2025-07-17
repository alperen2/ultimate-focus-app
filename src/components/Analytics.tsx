import React from 'react';
import { Clock, CheckCircle, Zap, Target, Trophy } from 'lucide-react';
import { Session } from '@/types';

interface AnalyticsProps {
  todaySessions: number;
  dailyGoal: number;
  totalFocusTime: number;
  currentStreak: number;
  completedSessions: Session[];
  darkMode: boolean;
  getCategoryIcon: (category: string) => string;
}

export default function Analytics({
  todaySessions,
  dailyGoal,
  totalFocusTime,
  currentStreak,
  completedSessions,
  darkMode,
  getCategoryIcon
}: AnalyticsProps) {
  const stats = [
    { 
      label: 'Today', 
      value: `${todaySessions}/${dailyGoal}`, 
      icon: Target, 
      color: 'indigo' 
    },
    { 
      label: 'Total Time', 
      value: `${Math.floor(totalFocusTime / 60)}h ${totalFocusTime % 60}m`, 
      icon: Clock, 
      color: 'green' 
    },
    { 
      label: 'Streak', 
      value: `${currentStreak} days`, 
      icon: Zap, 
      color: 'yellow' 
    },
    { 
      label: 'Sessions', 
      value: completedSessions.length, 
      icon: CheckCircle, 
      color: 'blue' 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`rounded-xl shadow-lg p-6 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`w-8 h-8 text-${stat.color}-500`} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Sessions */}
      <div className={`rounded-xl shadow-lg p-6 ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>Recent Sessions</h3>
        
        <div className="space-y-2">
          {completedSessions.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className={`w-12 h-12 mx-auto mb-4 ${
                darkMode ? 'text-gray-600' : 'text-gray-300'
              }`} />
              <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                No completed sessions yet
              </p>
            </div>
          ) : (
            completedSessions.slice(-10).reverse().map((session: Session, i: number) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getCategoryIcon(session.category)}</span>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {session.task}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {session.duration} min &bull; {new Date(session.completedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}