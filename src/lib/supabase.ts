import { createClient } from '@supabase/supabase-js'
import { env } from './env'

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database Types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          daily_goal: number
          focus_duration: number
          short_break_duration: number
          long_break_duration: number
          long_break_interval: number
          auto_start_breaks: boolean
          auto_start_sessions: boolean
          sound_enabled: boolean
          notifications_enabled: boolean
          theme: 'light' | 'dark'
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
          daily_goal?: number
          focus_duration?: number
          short_break_duration?: number
          long_break_duration?: number
          long_break_interval?: number
          auto_start_breaks?: boolean
          auto_start_sessions?: boolean
          sound_enabled?: boolean
          notifications_enabled?: boolean
          theme?: 'light' | 'dark'
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          daily_goal?: number
          focus_duration?: number
          short_break_duration?: number
          long_break_duration?: number
          long_break_interval?: number
          auto_start_breaks?: boolean
          auto_start_sessions?: boolean
          sound_enabled?: boolean
          notifications_enabled?: boolean
          theme?: 'light' | 'dark'
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          task: string
          category: string
          duration: number
          completed_at: string
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task: string
          category: string
          duration: number
          completed_at?: string
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task?: string
          category?: string
          duration?: number
          completed_at?: string
          date?: string
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          text: string
          category: string
          priority: string
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          text: string
          category: string
          priority: string
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          text?: string
          category?: string
          priority?: string
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}