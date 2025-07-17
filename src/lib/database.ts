/**
 * Database utilities and optimized queries
 */

import { supabase } from './supabase';
import { DatabaseError } from './errors';
import type { Database } from './supabase';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { Session, Task } from '../types';

type Tables = Database['public']['Tables'];

/**
 * Optimized query builder with error handling
 */
export class QueryBuilder {
  static async getUser(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw new DatabaseError(`Failed to fetch user: ${error.message}`);
      }

      return data;
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError('Unexpected error fetching user');
    }
  }

  static async getUserSessions(userId: string, limit: number = 50) {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new DatabaseError(`Failed to fetch sessions: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError('Unexpected error fetching sessions');
    }
  }

  static async getUserTasks(userId: string, includeCompleted: boolean = true) {
    try {
      const query = supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!includeCompleted) {
        query.eq('completed', false);
      }

      const { data, error } = await query;

      if (error) {
        throw new DatabaseError(`Failed to fetch tasks: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError('Unexpected error fetching tasks');
    }
  }

  static async getUserProjects(userId: string) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          tasks:tasks(count),
          sessions:sessions(count)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new DatabaseError(`Failed to fetch projects: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError('Unexpected error fetching projects');
    }
  }

  static async createSession(sessionData: Tables['sessions']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert(sessionData)
        .select()
        .single();

      if (error) {
        throw new DatabaseError(`Failed to create session: ${error.message}`);
      }

      return data;
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError('Unexpected error creating session');
    }
  }

  static async createTask(taskData: Tables['tasks']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select()
        .single();

      if (error) {
        throw new DatabaseError(`Failed to create task: ${error.message}`);
      }

      return data;
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError('Unexpected error creating task');
    }
  }

  static async updateTask(taskId: string, updates: Tables['tasks']['Update']) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();

      if (error) {
        throw new DatabaseError(`Failed to update task: ${error.message}`);
      }

      return data;
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError('Unexpected error updating task');
    }
  }

  static async deleteTask(taskId: string) {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        throw new DatabaseError(`Failed to delete task: ${error.message}`);
      }
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError('Unexpected error deleting task');
    }
  }

  static async updateUserSettings(userId: string, settings: Partial<Tables['users']['Update']>) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(settings)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw new DatabaseError(`Failed to update user settings: ${error.message}`);
      }

      return data;
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError('Unexpected error updating user settings');
    }
  }

  static async getTodaysSessions(userId: string) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .order('completed_at', { ascending: false });

      if (error) {
        throw new DatabaseError(`Failed to fetch today's sessions: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError('Unexpected error fetching today\'s sessions');
    }
  }

  static async getSessionsInRange(userId: string, startDate: string, endDate: string) {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('completed_at', { ascending: false });

      if (error) {
        throw new DatabaseError(`Failed to fetch sessions in range: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError('Unexpected error fetching sessions in range');
    }
  }
}

/**
 * Batch operations for better performance
 */
export class BatchOperations {
  static async bulkCreateSessions(sessions: Tables['sessions']['Insert'][]) {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert(sessions)
        .select();

      if (error) {
        throw new DatabaseError(`Failed to create sessions: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError('Unexpected error creating sessions');
    }
  }

  static async bulkUpdateTasks(updates: Array<{ id: string; updates: Tables['tasks']['Update'] }>) {
    try {
      const results = await Promise.all(
        updates.map(({ id, updates }) => 
          QueryBuilder.updateTask(id, updates)
        )
      );

      return results;
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError('Unexpected error updating tasks');
    }
  }
}

/**
 * Real-time subscriptions
 */
export class RealtimeSubscriptions {
  static subscribeToUserSessions(userId: string, callback: (payload: RealtimePostgresChangesPayload<Session>) => void) {
    return supabase
      .channel('user-sessions')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'sessions',
        filter: `user_id=eq.${userId}`,
      }, callback)
      .subscribe();
  }

  static subscribeToUserTasks(userId: string, callback: (payload: RealtimePostgresChangesPayload<Task>) => void) {
    return supabase
      .channel('user-tasks')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${userId}`,
      }, callback)
      .subscribe();
  }

  static unsubscribe(subscription: RealtimeChannel) {
    return supabase.removeChannel(subscription);
  }
}