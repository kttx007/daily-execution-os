import type { AppData, Category, DailyReview, OutputLog, Priority, Quadrant, Task } from "@/types";
import { nowISO, todayISO, tomorrowISO } from "@/utils/date";

export const makeId = (prefix = "id") => `${prefix}_${crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)}`;

export function inferQuadrant(importance: "高" | "中" | "低", urgency: "高" | "中" | "低"): Quadrant {
  if (importance === "高" && urgency === "高") return "Q1";
  if (importance === "高") return "Q2";
  if (urgency === "高") return "Q3";
  return "Q4";
}

export function createTaskDraft(title = ""): Task {
  const now = nowISO();
  return {
    id: makeId("task"),
    user_id: null,
    title,
    project: "人生乘法系统",
    category: "其他",
    quadrant: "Q2",
    priority: "P2",
    importance: "中",
    urgency: "中",
    estimated_time: 30,
    plan_date: todayISO(),
    due_time: "",
    status: "未开始",
    delay_count: 0,
    auto_rollover: true,
    is_stuck: false,
    output_link: "",
    note: "",
    created_at: now,
    updated_at: now,
    completed_at: null,
  };
}

export function completeTask(task: Task): { task: Task; output: OutputLog } {
  const now = nowISO();
  const completedTask = {
    ...task,
    status: "已完成" as const,
    completed_at: task.completed_at ?? now,
    updated_at: now,
    is_stuck: task.delay_count >= 3,
  };
  return {
    task: completedTask,
    output: {
      id: makeId("output"),
      user_id: task.user_id,
      task_id: task.id,
      completed_date: todayISO(),
      title: task.title,
      project: task.project,
      category: task.category,
      output_link: task.output_link,
      reusable: task.category === "SOP沉淀" || task.category === "产品资料",
      sop_candidate: task.category === "SOP沉淀" || task.priority === "P0",
      value_level: task.priority === "P0" || task.priority === "P1" ? "高" : "中",
      note: task.note,
      created_at: now,
    },
  };
}

export function rolloverTask(task: Task): Task {
  const delayCount = task.delay_count + 1;
  return {
    ...task,
    plan_date: tomorrowISO(),
    delay_count: delayCount,
    status: "延期",
    is_stuck: delayCount >= 3,
    updated_at: nowISO(),
  };
}

export function sortTasks(tasks: Task[]) {
  const priorityWeight: Record<Priority, number> = { P0: 0, P1: 1, P2: 2, P3: 3 };
  return [...tasks].sort((a, b) => priorityWeight[a.priority] - priorityWeight[b.priority] || (a.due_time || "99:99").localeCompare(b.due_time || "99:99"));
}

export function dashboardStats(data: AppData) {
  const todayTasks = data.tasks.filter((task) => task.plan_date === todayISO());
  const completed = todayTasks.filter((task) => task.status === "已完成");
  const unfinished = todayTasks.filter((task) => !["已完成", "放弃"].includes(task.status));
  const mustDo = todayTasks.filter((task) => task.priority === "P0");
  const stuck = data.tasks.filter((task) => task.is_stuck || task.delay_count >= 3);
  const highValueOutputs = data.output_logs.filter((log) => log.value_level === "高");
  const sopCandidates = data.output_logs.filter((log) => log.sop_candidate);
  return {
    todayTasks,
    completed,
    unfinished,
    mustDo,
    stuck,
    highValueOutputs,
    sopCandidates,
    completionRate: todayTasks.length ? Math.round((completed.length / todayTasks.length) * 100) : 0,
  };
}

export function taskPatchFromForm(form: FormData): Partial<Task> {
  const importance = String(form.get("importance") || "中") as Task["importance"];
  const urgency = String(form.get("urgency") || "中") as Task["urgency"];
  return {
    title: String(form.get("title") || "").trim(),
    project: String(form.get("project") || "人生乘法系统"),
    category: String(form.get("category") || "其他") as Category,
    priority: String(form.get("priority") || "P2") as Priority,
    quadrant: String(form.get("quadrant") || inferQuadrant(importance, urgency)) as Quadrant,
    importance,
    urgency,
    estimated_time: Number(form.get("estimated_time") || 30),
    plan_date: String(form.get("plan_date") || todayISO()),
    due_time: String(form.get("due_time") || ""),
    status: String(form.get("status") || "未开始") as Task["status"],
    output_link: String(form.get("output_link") || ""),
    note: String(form.get("note") || ""),
  };
}

export function autoReview(data: AppData): Pick<DailyReview, "completed_summary" | "unfinished_summary" | "rollover_tasks" | "outputs" | "tomorrow_top3"> {
  const todayTasks = data.tasks.filter((task) => task.plan_date === todayISO() || task.completed_at?.startsWith(todayISO()));
  const completed = todayTasks.filter((task) => task.status === "已完成");
  const unfinished = todayTasks.filter((task) => !["已完成", "放弃"].includes(task.status));
  const top3 = sortTasks(data.tasks.filter((task) => !["已完成", "放弃"].includes(task.status))).slice(0, 3);
  return {
    completed_summary: completed.map((task) => `- ${task.title}`).join("\n"),
    unfinished_summary: unfinished.map((task) => `- ${task.title}`).join("\n"),
    rollover_tasks: unfinished.filter((task) => task.auto_rollover).map((task) => `- ${task.title}`).join("\n"),
    outputs: data.output_logs.filter((log) => log.completed_date === todayISO()).map((log) => `- ${log.title}`).join("\n"),
    tomorrow_top3: top3.map((task, index) => `${index + 1}. ${task.title}`).join("\n"),
  };
}
