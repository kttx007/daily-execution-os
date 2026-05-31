import { supabase } from './supabase';
import type { StorageProvider } from './storageService';
import type { Task, InboxItem, WeeklyTask, RecurringTask, OutputLog, DailyReview, UserSettings } from '../types';

export class SupabaseProvider implements StorageProvider {
  async getTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('plan_date', { ascending: true });
    if (error) throw error;
    return data as Task[];
  }

  async saveTask(task: Task): Promise<void> {
    const { error } = await supabase.from('tasks').insert(task);
    if (error) throw error;
  }

  async updateTask(id: string, task: Partial<Task>): Promise<void> {
    const { error } = await supabase.from('tasks').update(task).eq('id', id);
    if (error) throw error;
  }

  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
  }

  async getInboxItems(): Promise<InboxItem[]> {
    const { data, error } = await supabase
      .from('inbox_items')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as InboxItem[];
  }

  async saveInboxItem(item: InboxItem): Promise<void> {
    const { error } = await supabase.from('inbox_items').insert(item);
    if (error) throw error;
  }

  async deleteInboxItem(id: string): Promise<void> {
    const { error } = await supabase.from('inbox_items').delete().eq('id', id);
    if (error) throw error;
  }

  async getWeeklyTasks(): Promise<WeeklyTask[]> {
    const { data, error } = await supabase.from('weekly_tasks').select('*');
    if (error) throw error;
    return data as WeeklyTask[];
  }

  async saveWeeklyTask(task: WeeklyTask): Promise<void> {
    const { error } = await supabase.from('weekly_tasks').insert(task);
    if (error) throw error;
  }

  async deleteWeeklyTask(id: string): Promise<void> {
    const { error } = await supabase.from('weekly_tasks').delete().eq('id', id);
    if (error) throw error;
  }

  async getRecurringTasks(): Promise<RecurringTask[]> {
    const { data, error } = await supabase.from('recurring_tasks').select('*');
    if (error) throw error;
    return data as RecurringTask[];
  }

  async saveRecurringTask(task: RecurringTask): Promise<void> {
    const { error } = await supabase.from('recurring_tasks').insert(task);
    if (error) throw error;
  }

  async deleteRecurringTask(id: string): Promise<void> {
    const { error } = await supabase.from('recurring_tasks').delete().eq('id', id);
    if (error) throw error;
  }

  async getOutputLogs(): Promise<OutputLog[]> {
    const { data, error } = await supabase
      .from('output_logs')
      .select('*')
      .order('completed_date', { ascending: false });
    if (error) throw error;
    return data as OutputLog[];
  }

  async saveOutputLog(log: OutputLog): Promise<void> {
    const { error } = await supabase.from('output_logs').insert(log);
    if (error) throw error;
  }

  async getDailyReviews(): Promise<DailyReview[]> {
    const { data, error } = await supabase
      .from('daily_reviews')
      .select('*')
      .order('date', { ascending: false });
    if (error) throw error;
    return data as DailyReview[];
  }

  async saveDailyReview(review: DailyReview): Promise<void> {
    const { error } = await supabase.from('daily_reviews').insert(review);
    if (error) throw error;
  }

  async getSettings(): Promise<UserSettings | null> {
    const { data, error } = await supabase.from('user_settings').select('*').maybeSingle();
    if (error) throw error;
    return data as UserSettings;
  }

  async saveSettings(settings: UserSettings): Promise<void> {
    const { error } = await supabase.from('user_settings').upsert(settings);
    if (error) throw error;
  }
}

export const supabaseProvider = new SupabaseProvider();
