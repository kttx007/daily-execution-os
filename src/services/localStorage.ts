import type { Task, InboxItem, WeeklyTask, RecurringTask, OutputLog, DailyReview, UserSettings } from '../types';
import type { StorageProvider } from './storageService';

const KEYS = {
  TASKS: 'daily_os_tasks',
  INBOX: 'daily_os_inbox',
  WEEKLY: 'daily_os_weekly',
  RECURRING: 'daily_os_recurring',
  OUTPUTS: 'daily_os_outputs',
  REVIEWS: 'daily_os_reviews',
  SETTINGS: 'daily_os_settings',
};

export class LocalStorageProvider implements StorageProvider {
  private getItem<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private setItem<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  async getTasks(): Promise<Task[]> {
    return this.getItem<Task>(KEYS.TASKS);
  }

  async saveTask(task: Task): Promise<void> {
    const tasks = await this.getTasks();
    const index = tasks.findIndex((t) => t.id === task.id);
    if (index > -1) {
      tasks[index] = { ...task, updated_at: new Date().toISOString() };
    } else {
      tasks.push({ ...task, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    }
    this.setItem(KEYS.TASKS, tasks);
  }

  async deleteTask(id: string): Promise<void> {
    const tasks = await this.getTasks();
    this.setItem(KEYS.TASKS, tasks.filter((t) => t.id !== id));
  }

  async getInboxItems(): Promise<InboxItem[]> {
    return this.getItem<InboxItem>(KEYS.INBOX);
  }

  async saveInboxItem(item: InboxItem): Promise<void> {
    const items = await this.getInboxItems();
    const index = items.findIndex((i) => i.id === item.id);
    if (index > -1) {
      items[index] = { ...item, updated_at: new Date().toISOString() };
    } else {
      items.push({ ...item, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    }
    this.setItem(KEYS.INBOX, items);
  }

  async deleteInboxItem(id: string): Promise<void> {
    const items = await this.getInboxItems();
    this.setItem(KEYS.INBOX, items.filter((i) => i.id !== id));
  }

  async getWeeklyTasks(): Promise<WeeklyTask[]> {
    return this.getItem<WeeklyTask>(KEYS.WEEKLY);
  }

  async saveWeeklyTask(task: WeeklyTask): Promise<void> {
    const tasks = await this.getWeeklyTasks();
    const index = tasks.findIndex((t) => t.id === task.id);
    if (index > -1) {
      tasks[index] = task;
    } else {
      tasks.push(task);
    }
    this.setItem(KEYS.WEEKLY, tasks);
  }

  async deleteWeeklyTask(id: string): Promise<void> {
    const tasks = await this.getWeeklyTasks();
    this.setItem(KEYS.WEEKLY, tasks.filter((t) => t.id !== id));
  }

  async getRecurringTasks(): Promise<RecurringTask[]> {
    return this.getItem<RecurringTask>(KEYS.RECURRING);
  }

  async saveRecurringTask(task: RecurringTask): Promise<void> {
    const tasks = await this.getRecurringTasks();
    const index = tasks.findIndex((t) => t.id === task.id);
    if (index > -1) {
      tasks[index] = task;
    } else {
      tasks.push(task);
    }
    this.setItem(KEYS.RECURRING, tasks);
  }

  async deleteRecurringTask(id: string): Promise<void> {
    const tasks = await this.getRecurringTasks();
    this.setItem(KEYS.RECURRING, tasks.filter((t) => t.id !== id));
  }

  async getOutputLogs(): Promise<OutputLog[]> {
    return this.getItem<OutputLog>(KEYS.OUTPUTS);
  }

  async saveOutputLog(log: OutputLog): Promise<void> {
    const logs = await this.getOutputLogs();
    logs.push(log);
    this.setItem(KEYS.OUTPUTS, logs);
  }

  async getDailyReviews(): Promise<DailyReview[]> {
    return this.getItem<DailyReview>(KEYS.REVIEWS);
  }

  async saveDailyReview(review: DailyReview): Promise<void> {
    const reviews = await this.getDailyReviews();
    const index = reviews.findIndex((r) => r.id === review.id || r.date === review.date);
    if (index > -1) {
      reviews[index] = review;
    } else {
      reviews.push(review);
    }
    this.setItem(KEYS.REVIEWS, reviews);
  }

  async getSettings(): Promise<UserSettings | null> {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : null;
  }

  async saveSettings(settings: UserSettings): Promise<void> {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  }
}

export const localProvider = new LocalStorageProvider();
