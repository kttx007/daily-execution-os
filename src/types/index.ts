export type Quadrant = "Q1" | "Q2" | "Q3" | "Q4";
export type Priority = "P0" | "P1" | "P2" | "P3";
export type Importance = "高" | "中" | "低";
export type Urgency = "高" | "中" | "低";
export type Status = "未开始" | "进行中" | "已完成" | "延期" | "放弃";
export type Category =
  | "阿里国际站"
  | "客户跟进"
  | "售后技术"
  | "产品资料"
  | "规格书/详情图"
  | "AI系统"
  | "SOP沉淀"
  | "学习研究"
  | "家庭生活"
  | "个人事务"
  | "其他";
export type Project =
  | "开腾业务增长"
  | "阿里国际站运营"
  | "GUANGYAN产品资料库"
  | "重点客户维护"
  | "售后诊断系统"
  | "人生乘法系统"
  | "AI工作流搭建"
  | string;
export type InboxSource = "手动输入" | "客户" | "阿里国际站" | "微信" | "文件" | "想法" | "其他";
export type Frequency = "每天" | "每周" | "每月";
export type ValueLevel = "高" | "中" | "低";

export interface Task {
  id: string;
  user_id: string | null;
  title: string;
  project: Project;
  category: Category;
  quadrant: Quadrant;
  priority: Priority;
  importance: Importance;
  urgency: Urgency;
  estimated_time: number;
  plan_date: string;
  due_time: string;
  status: Status;
  delay_count: number;
  auto_rollover: boolean;
  is_stuck: boolean;
  output_link: string;
  note: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface InboxItem {
  id: string;
  user_id: string | null;
  title: string;
  source: InboxSource;
  is_processed: boolean;
  note: string;
  attachment_url: string;
  created_at: string;
  updated_at: string;
}

export interface WeeklyTask {
  id: string;
  user_id: string | null;
  title: string;
  project: Project;
  goal: string;
  priority: Priority;
  progress: number;
  status: Status;
  start_date: string;
  end_date: string;
  related_task_ids: string[];
  note: string;
  created_at: string;
  updated_at: string;
}

export interface RecurringTask {
  id: string;
  user_id: string | null;
  title: string;
  frequency: Frequency;
  default_time: string;
  priority: Priority;
  category: Category;
  enabled: boolean;
  note: string;
  created_at: string;
  updated_at: string;
}

export interface OutputLog {
  id: string;
  user_id: string | null;
  task_id: string | null;
  completed_date: string;
  title: string;
  project: Project;
  category: Category;
  output_link: string;
  reusable: boolean;
  sop_candidate: boolean;
  value_level: ValueLevel;
  note: string;
  created_at: string;
}

export interface DailyReview {
  id: string;
  user_id: string | null;
  date: string;
  completed_summary: string;
  unfinished_summary: string;
  reason: string;
  rollover_tasks: string;
  outputs: string;
  score: number;
  tomorrow_top3: string;
  note: string;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string | null;
  reminder_time: string;
  theme: "light" | "dark" | "system";
  notification_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface AppData {
  tasks: Task[];
  inbox_items: InboxItem[];
  weekly_tasks: WeeklyTask[];
  recurring_tasks: RecurringTask[];
  output_logs: OutputLog[];
  daily_reviews: DailyReview[];
  user_settings: UserSettings;
}

export type EntityName = keyof Omit<AppData, "user_settings"> | "user_settings";
export type SyncTableName = keyof Omit<AppData, "user_settings">;
export interface SyncTombstone {
  table: SyncTableName;
  id: string;
  deleted_at: string;
}
export type ViewKey = "dashboard" | "inbox" | "today" | "matrix" | "weekly" | "recurring" | "outputs" | "review" | "settings";
