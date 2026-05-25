export type Quadrant = 'Q1' | 'Q2' | 'Q3' | 'Q4';
export type Priority = 'P0' | 'P1' | 'P2' | 'P3';
export type Level = '高' | '中' | '低';
export type TaskStatus = '未开始' | '进行中' | '已完成' | '延期' | '放弃';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  project?: string;
  category?: string;
  quadrant?: Quadrant;
  priority?: Priority;
  importance?: Level;
  urgency?: Level;
  estimated_time?: number;
  plan_date: string;
  due_time?: string;
  status: TaskStatus;
  delay_count: number;
  auto_rollover: boolean;
  is_stuck: boolean;
  output_link?: string;
  note?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface InboxItem {
  id: string;
  user_id: string;
  title: string;
  source: string;
  is_processed: boolean;
  note?: string;
  attachment_url?: string;
  created_at: string;
  updated_at: string;
}

export interface WeeklyTask {
  id: string;
  user_id: string;
  title: string;
  project?: string;
  goal?: string;
  priority?: string;
  progress: number;
  status: string;
  start_date?: string;
  end_date?: string;
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface RecurringTask {
  id: string;
  user_id: string;
  title: string;
  frequency: '每天' | '每周' | '每月';
  default_time?: string;
  priority?: string;
  category?: string;
  enabled: boolean;
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface OutputLog {
  id: string;
  user_id: string;
  task_id?: string;
  completed_date: string;
  title: string;
  project?: string;
  category?: string;
  output_link?: string;
  reusable: boolean;
  sop_candidate: boolean;
  value_level?: Level;
  note?: string;
  created_at: string;
}

export interface DailyReview {
  id: string;
  user_id: string;
  date: string;
  completed_summary?: string;
  unfinished_summary?: string;
  reason?: string;
  rollover_tasks?: string;
  outputs?: string;
  score?: number;
  tomorrow_top3?: string;
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  reminder_time: string;
  theme: 'light' | 'dark';
  notification_enabled: boolean;
  feishu_webhook_url?: string;
  created_at: string;
  updated_at: string;
}
