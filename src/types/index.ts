export type TabType = 'focus' | 'analytics' | 'settings' | 'projects' | 'project-tasks';
export type CategoryType = 'work' | 'personal' | 'learning' | 'creative' | 'health';
export type PriorityType = 'low' | 'medium' | 'high' | 'urgent';
export type AmbientSoundType = 'none' | 'rain' | 'coffee-shop' | 'forest' | 'ocean' | 'white-noise';
export type ProjectStatus = 'active' | 'completed' | 'paused' | 'archived';

export interface Project {
  id: number;
  name: string;
  description?: string;
  color: string;
  status: ProjectStatus;
  estimatedPomodoros: number;
  completedPomodoros: number;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date | undefined;
}

export interface Task {
  id: number;
  text: string;
  description?: string;
  projectId?: number | undefined;
  category: CategoryType;
  priority: PriorityType;
  completed: boolean;
  estimatedPomodoros: number;
  completedPomodoros: number;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date | undefined;
}

export interface Session {
  id: number;
  task: string;
  taskId?: number;
  projectId?: number;
  category: CategoryType;
  duration: number;
  completedAt: Date;
  date: string;
}

export interface AppSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  dailyGoal: number;
  darkMode: boolean;
  soundEnabled: boolean;
  autoStartBreaks: boolean;
  autoStartSessions: boolean;
  ambientSound: string;
  notificationsEnabled?: boolean;
  theme?: string;
}

export interface AppStats {
  todaySessions: number;
  currentStreak: number;
  totalFocusTime: number;
  completedSessions: Session[];
}