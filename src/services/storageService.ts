import type { Task, InboxItem, WeeklyTask, RecurringTask, OutputLog, DailyReview, UserSettings } from '../types';

export interface StorageProvider {
  getTasks(): Promise<Task[]>;
  saveTask(task: Task): Promise<void>;
  updateTask(id: string, task: Partial<Task>): Promise<void>;
  deleteTask(id: string): Promise<void>;

  getInboxItems(): Promise<InboxItem[]>;
  saveInboxItem(item: InboxItem): Promise<void>;
  deleteInboxItem(id: string): Promise<void>;

  getWeeklyTasks(): Promise<WeeklyTask[]>;
  saveWeeklyTask(task: WeeklyTask): Promise<void>;
  deleteWeeklyTask(id: string): Promise<void>;

  getRecurringTasks(): Promise<RecurringTask[]>;
  saveRecurringTask(task: RecurringTask): Promise<void>;
  deleteRecurringTask(id: string): Promise<void>;

  getOutputLogs(): Promise<OutputLog[]>;
  saveOutputLog(log: OutputLog): Promise<void>;

  getDailyReviews(): Promise<DailyReview[]>;
  saveDailyReview(review: DailyReview): Promise<void>;

  getSettings(): Promise<UserSettings | null>;
  saveSettings(settings: UserSettings): Promise<void>;
}

import { localProvider } from './localStorage';
import { supabaseProvider } from './supabaseProvider';

// 动态选择 Provider: 如果配置了 Supabase 环境变量则使用 Supabase，否则回退到 LocalStorage
const useSupabase = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

export const storage = useSupabase ? supabaseProvider : localProvider;
