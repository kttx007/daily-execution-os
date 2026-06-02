import type { AppData, DailyReview, InboxItem, OutputLog, RecurringTask, SyncTableName, SyncTombstone, Task, UserSettings, WeeklyTask } from "@/types";
import { nowISO, todayISO } from "@/utils/date";
import { makeId } from "@/utils/task";

const STORAGE_KEY = "daily-execution-os:data:v1";
const TOMBSTONE_KEY = "daily-execution-os:tombstones:v1";

function sampleData(): AppData {
  const now = nowISO();
  const today = todayISO();
  const task1: Task = {
    id: makeId("task"),
    user_id: null,
    title: "梳理今日 P0 客户跟进清单",
    project: "重点客户维护",
    category: "客户跟进",
    quadrant: "Q1",
    priority: "P0",
    importance: "高",
    urgency: "高",
    estimated_time: 45,
    plan_date: today,
    due_time: "10:30",
    status: "进行中",
    delay_count: 0,
    auto_rollover: true,
    is_stuck: false,
    output_link: "",
    note: "先处理高意向客户。",
    created_at: now,
    updated_at: now,
    completed_at: null,
  };
  const task2: Task = {
    ...task1,
    id: makeId("task"),
    title: "把售后诊断流程整理成 SOP 草稿",
    project: "售后诊断系统",
    category: "SOP沉淀",
    quadrant: "Q2",
    priority: "P1",
    importance: "高",
    urgency: "中",
    due_time: "16:00",
    status: "未开始",
    note: "完成后进入长期资料库。",
  };
  const task3: Task = {
    ...task1,
    id: makeId("task"),
    title: "延期多次的详情图规格确认",
    project: "GUANGYAN产品资料库",
    category: "规格书/详情图",
    quadrant: "Q2",
    priority: "P1",
    urgency: "中",
    due_time: "",
    delay_count: 3,
    is_stuck: true,
    status: "延期",
  };
  const inbox: InboxItem = {
    id: makeId("inbox"),
    user_id: null,
    title: "客户问新品是否有英文版规格书",
    source: "客户",
    is_processed: false,
    note: "可能关联产品资料库。",
    attachment_url: "",
    created_at: now,
    updated_at: now,
  };
  const weekly: WeeklyTask = {
    id: makeId("weekly"),
    user_id: null,
    title: "完成售后诊断系统第一版流程闭环",
    project: "售后诊断系统",
    goal: "形成可复用 SOP 与诊断入口",
    priority: "P1",
    progress: 45,
    status: "进行中",
    start_date: today,
    end_date: today,
    related_task_ids: [task2.id],
    note: "",
    created_at: now,
    updated_at: now,
  };
  const recurring: RecurringTask = {
    id: makeId("recurring"),
    user_id: null,
    title: "17:00 当日执行复盘",
    frequency: "每天",
    default_time: "17:00",
    priority: "P1",
    category: "个人事务",
    enabled: true,
    note: "",
    created_at: now,
    updated_at: now,
  };
  const output: OutputLog = {
    id: makeId("output"),
    user_id: null,
    task_id: null,
    completed_date: today,
    title: "示例：沉淀一条可复用客户回复话术",
    project: "重点客户维护",
    category: "客户跟进",
    output_link: "",
    reusable: true,
    sop_candidate: true,
    value_level: "高",
    note: "这是示例完成记录。",
    created_at: now,
  };
  const review: DailyReview = {
    id: makeId("review"),
    user_id: null,
    date: today,
    completed_summary: "",
    unfinished_summary: "",
    reason: "",
    rollover_tasks: "",
    outputs: "",
    score: 7,
    tomorrow_top3: "",
    note: "",
    created_at: now,
    updated_at: now,
  };
  const settings: UserSettings = {
    id: makeId("settings"),
    user_id: null,
    reminder_time: "17:00",
    theme: "light",
    notification_enabled: false,
    created_at: now,
    updated_at: now,
  };
  return {
    tasks: [task1, task2, task3],
    inbox_items: [inbox],
    weekly_tasks: [weekly],
    recurring_tasks: [recurring],
    output_logs: [output],
    daily_reviews: [review],
    user_settings: settings,
  };
}

export const localStorageService = {
  getData(): AppData {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const data = sampleData();
      this.saveData(data);
      return data;
    }
    try {
      return JSON.parse(raw) as AppData;
    } catch {
      const data = sampleData();
      this.saveData(data);
      return data;
    }
  },
  saveData(data: AppData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },
  exportData(data: AppData) {
    return JSON.stringify(data, null, 2);
  },
  importData(json: string) {
    const data = JSON.parse(json) as AppData;
    this.saveData(data);
    return data;
  },
  getTombstones(): SyncTombstone[] {
    const raw = localStorage.getItem(TOMBSTONE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as SyncTombstone[];
    } catch {
      return [];
    }
  },
  addTombstone(table: SyncTableName, id: string) {
    const next = [...this.getTombstones().filter((item) => !(item.table === table && item.id === id)), { table, id, deleted_at: nowISO() }];
    localStorage.setItem(TOMBSTONE_KEY, JSON.stringify(next));
  },
  clearTombstones() {
    localStorage.removeItem(TOMBSTONE_KEY);
  },
  clear() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOMBSTONE_KEY);
  },
  reset() {
    const data = sampleData();
    this.saveData(data);
    return data;
  },
};
