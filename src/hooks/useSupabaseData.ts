import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Session, AppSettings, Task, Project, CategoryType, PriorityType, ProjectStatus } from '@/types'

export function useUserSettings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserSettings = useCallback(async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found" error
        console.error('Error fetching user settings:', error)
      }

      if (data) {
        setSettings({
          focusDuration: data.focus_duration,
          shortBreakDuration: data.short_break_duration,
          longBreakDuration: data.long_break_duration,
          longBreakInterval: data.long_break_interval,
          autoStartBreaks: data.auto_start_breaks,
          autoStartSessions: data.auto_start_sessions,
          soundEnabled: data.sound_enabled,
          darkMode: data.theme === 'dark',
          ambientSound: data.ambient_sound || 'none',
          dailyGoal: data.daily_goal
        })
      } else {
        // Set default settings if no user profile found
        setSettings({
          focusDuration: 25,
          shortBreakDuration: 5,
          longBreakDuration: 15,
          longBreakInterval: 4,
          autoStartBreaks: false,
          autoStartSessions: false,
          soundEnabled: true,
          darkMode: true,
          ambientSound: 'none',
          dailyGoal: 8
        })
      }
    } catch (error) {
      console.error('Error fetching user settings:', error)
      // Set default settings on error
      setSettings({
        focusDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        longBreakInterval: 4,
        autoStartBreaks: false,
        autoStartSessions: false,
        soundEnabled: true,
        darkMode: true,
        ambientSound: 'none',
        dailyGoal: 8,
        notificationsEnabled: true,
        theme: 'dark'
      })
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!user) {
      setSettings(null)
      setLoading(false)
      return
    }

    fetchUserSettings()
  }, [user, fetchUserSettings])

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    if (!user) return

    try {
      // First try to update existing profile
      const { error: updateError } = await supabase
        .from('users')
        .update({
          focus_duration: newSettings.focusDuration,
          short_break_duration: newSettings.shortBreakDuration,
          long_break_duration: newSettings.longBreakDuration,
          long_break_interval: newSettings.longBreakInterval,
          auto_start_breaks: newSettings.autoStartBreaks,
          auto_start_sessions: newSettings.autoStartSessions,
          sound_enabled: newSettings.soundEnabled,
          theme: newSettings.darkMode ? 'dark' : 'light',
          ambient_sound: newSettings.ambientSound,
          daily_goal: newSettings.dailyGoal,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (updateError) {
        // If update fails, try to create the profile first
        console.log('Update failed, trying to create user profile...')
        const { error: insertError } = await supabase
          .from('users')
          .insert([{
            id: user.id,
            email: user.email!,
            focus_duration: newSettings.focusDuration ?? 25,
            short_break_duration: newSettings.shortBreakDuration ?? 5,
            long_break_duration: newSettings.longBreakDuration ?? 15,
            long_break_interval: newSettings.longBreakInterval ?? 4,
            auto_start_breaks: newSettings.autoStartBreaks ?? false,
            auto_start_sessions: newSettings.autoStartSessions ?? false,
            sound_enabled: newSettings.soundEnabled ?? true,
            notifications_enabled: newSettings.notificationsEnabled ?? true,
            theme: newSettings.theme ?? 'dark',
            daily_goal: newSettings.dailyGoal ?? 8
          }])

        if (insertError) {
          console.error('Error creating user profile:', insertError)
          return
        }
      }

      setSettings(prev => prev ? { ...prev, ...newSettings } : newSettings as AppSettings)
    } catch (error) {
      console.error('Error updating settings:', error)
    }
  }

  return { settings, updateSettings, loading }
}

export function useUserSessions() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSessions = useCallback(async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })

      if (error) throw error

      if (data) {
        const formattedSessions: Session[] = data.map(session => ({
          id: parseInt(session.id),
          task: session.task,
          category: session.category as CategoryType,
          duration: session.duration,
          completedAt: new Date(session.completed_at),
          date: session.date
        }))
        setSessions(formattedSessions)
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!user) {
      setSessions([])
      setLoading(false)
      return
    }

    fetchSessions()
  }, [user, fetchSessions])

  const addSession = async (session: Omit<Session, 'id'>) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert([
          {
            user_id: user.id,
            task: session.task,
            category: session.category,
            duration: session.duration,
            completed_at: session.completedAt.toISOString(),
            date: session.date
          }
        ])
        .select()
        .single()

      if (error) throw error

      if (data) {
        const newSession: Session = {
          id: parseInt(data.id),
          task: data.task,
          category: data.category as CategoryType,
          duration: data.duration,
          completedAt: new Date(data.completed_at),
          date: data.date
        }
        setSessions(prev => [newSession, ...prev])
      }
    } catch (error) {
      console.error('Error adding session:', error)
    }
  }

  return { sessions, addSession, loading }
}

export function useUserTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = useCallback(async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', false)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        const formattedTasks: Task[] = data.map(task => ({
          id: parseInt(task.id),
          text: task.text,
          description: task.description,
          projectId: task.project_id,
          category: task.category as CategoryType,
          priority: task.priority as PriorityType,
          completed: task.completed,
          estimatedPomodoros: task.estimated_pomodoros,
          completedPomodoros: task.completed_pomodoros,
          createdAt: new Date(task.created_at),
          updatedAt: new Date(task.updated_at),
          dueDate: task.due_date ? new Date(task.due_date) : undefined
        }))
        setTasks(formattedTasks)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!user) {
      setTasks([])
      setLoading(false)
      return
    }

    fetchTasks()
  }, [user, fetchTasks])

  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task | undefined> => {
    if (!user) return undefined

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            user_id: user.id,
            text: task.text,
            description: task.description,
            project_id: task.projectId,
            category: task.category,
            priority: task.priority,
            completed: task.completed,
            estimated_pomodoros: task.estimatedPomodoros,
            completed_pomodoros: task.completedPomodoros,
            due_date: task.dueDate?.toISOString()
          }
        ])
        .select()
        .single()

      if (error) throw error

      if (data) {
        const newTask: Task = {
          id: parseInt(data.id),
          text: data.text,
          description: data.description,
          projectId: data.project_id,
          category: data.category as CategoryType,
          priority: data.priority as PriorityType,
          completed: data.completed,
          estimatedPomodoros: data.estimated_pomodoros,
          completedPomodoros: data.completed_pomodoros,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
          dueDate: data.due_date ? new Date(data.due_date) : undefined
        }
        setTasks(prev => [newTask, ...prev])
        return newTask
      }
    } catch (error) {
      console.error('Error adding task:', error)
    }
    return undefined
  }

  const removeTask = async (taskId: number) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId.toString())
        .eq('user_id', user.id)

      if (error) throw error

      setTasks(prev => prev.filter(task => task.id !== taskId))
    } catch (error) {
      console.error('Error removing task:', error)
    }
  }

  const updateTask = async (taskId: number, updates: Partial<Task>): Promise<Task | undefined> => {
    if (!user) return undefined

    try {
      const updateData: Record<string, unknown> = {}
      if (updates.text !== undefined) updateData.text = updates.text
      if (updates.description !== undefined) updateData.description = updates.description
      if (updates.projectId !== undefined) updateData.project_id = updates.projectId
      if (updates.category !== undefined) updateData.category = updates.category
      if (updates.priority !== undefined) updateData.priority = updates.priority
      if (updates.completed !== undefined) updateData.completed = updates.completed
      if (updates.estimatedPomodoros !== undefined) updateData.estimated_pomodoros = updates.estimatedPomodoros
      if (updates.completedPomodoros !== undefined) updateData.completed_pomodoros = updates.completedPomodoros
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate?.toISOString()
      updateData.updated_at = new Date().toISOString()

      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId.toString())
        .eq('user_id', user.id)

      if (error) throw error

      const updatedTask = { ...tasks.find(task => task.id === taskId), ...updates, updatedAt: new Date() } as Task
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ))
      return updatedTask
    } catch (error) {
      console.error('Error updating task:', error)
      return undefined
    }
  }

  return { tasks, addTask, removeTask, updateTask, loading }
}

export function useUserProjects() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProjects = useCallback(async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        const formattedProjects: Project[] = data.map(project => ({
          id: parseInt(project.id),
          name: project.name,
          description: project.description,
          color: project.color,
          status: project.status as ProjectStatus,
          estimatedPomodoros: project.estimated_pomodoros,
          completedPomodoros: project.completed_pomodoros,
          createdAt: new Date(project.created_at),
          updatedAt: new Date(project.updated_at),
          dueDate: project.due_date ? new Date(project.due_date) : undefined
        }))
        setProjects(formattedProjects)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!user) {
      setProjects([])
      setLoading(false)
      return
    }

    fetchProjects()
  }, [user, fetchProjects])

  const addProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project | undefined> => {
    if (!user) return undefined

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name: project.name,
          description: project.description,
          color: project.color,
          status: project.status,
          estimated_pomodoros: project.estimatedPomodoros,
          completed_pomodoros: project.completedPomodoros,
          due_date: project.dueDate?.toISOString()
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        const newProject: Project = {
          id: parseInt(data.id),
          name: data.name,
          description: data.description,
          color: data.color,
          status: data.status as ProjectStatus,
          estimatedPomodoros: data.estimated_pomodoros,
          completedPomodoros: data.completed_pomodoros,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
          dueDate: data.due_date ? new Date(data.due_date) : undefined
        }
        setProjects(prev => [newProject, ...prev])
        return newProject
      }
    } catch (error) {
      console.error('Error adding project:', error)
    }
    return undefined
  }

  const updateProject = async (projectId: number, updates: Partial<Project>): Promise<Project | undefined> => {
    if (!user) return undefined

    try {
      const updateData: Record<string, unknown> = {}
      if (updates.name !== undefined) updateData.name = updates.name
      if (updates.description !== undefined) updateData.description = updates.description
      if (updates.color !== undefined) updateData.color = updates.color
      if (updates.status !== undefined) updateData.status = updates.status
      if (updates.estimatedPomodoros !== undefined) updateData.estimated_pomodoros = updates.estimatedPomodoros
      if (updates.completedPomodoros !== undefined) updateData.completed_pomodoros = updates.completedPomodoros
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate?.toISOString()

      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', projectId)
        .eq('user_id', user.id)

      if (error) throw error

      const updatedProject = { ...projects.find(project => project.id === projectId), ...updates } as Project
      setProjects(prev => prev.map(project => 
        project.id === projectId ? updatedProject : project
      ))
      return updatedProject
    } catch (error) {
      console.error('Error updating project:', error)
      return undefined
    }
  }

  const removeProject = async (projectId: number) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', user.id)

      if (error) throw error

      setProjects(prev => prev.filter(project => project.id !== projectId))
    } catch (error) {
      console.error('Error removing project:', error)
    }
  }

  return { projects, addProject, updateProject, removeProject, loading }
}