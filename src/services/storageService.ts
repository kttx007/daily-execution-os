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
