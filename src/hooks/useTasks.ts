import { useEffect, useMemo, useState } from "react";
import type { AppData, DailyReview, InboxItem, OutputLog, RecurringTask, Task, WeeklyTask } from "@/types";
import { storageService } from "@/services/storageService";
import { completeTask, createTaskDraft, makeId, rolloverTask } from "@/utils/task";
import { nowISO, todayISO } from "@/utils/date";
import { suggestPriority, suggestQuadrant, suggestTaskCategory } from "@/services/aiService";

type TableName = "tasks" | "inbox_items" | "weekly_tasks" | "recurring_tasks" | "output_logs" | "daily_reviews";

function replaceById<T extends { id: string }>(items: T[], item: T) {
  return items.some((current) => current.id === item.id) ? items.map((current) => (current.id === item.id ? item : current)) : [item, ...items];
}

export function useTaskStore() {
  const [data, setData] = useState<AppData>(() => storageService.load());
  const [message, setMessage] = useState("");

  useEffect(() => {
    storageService.save(data);
  }, [data]);

  const actions = useMemo(
    () => ({
      setAll(next: AppData) {
        setData(next);
      },
      addTask(partial: Partial<Task>) {
        const base = createTaskDraft(partial.title);
        const task = { ...base, ...partial, updated_at: nowISO(), is_stuck: (partial.delay_count ?? 0) >= 3 };
        setData((current) => ({ ...current, tasks: [task, ...current.tasks] }));
      },
      upsertTask(task: Task) {
        const normalized = { ...task, updated_at: nowISO(), is_stuck: task.delay_count >= 3 };
        setData((current) => {
          const existing = current.tasks.find((item) => item.id === task.id);
          if (normalized.status === "已完成" && existing?.status !== "已完成") {
            const completed = completeTask(normalized);
            return {
              ...current,
              tasks: replaceById(current.tasks, completed.task),
              output_logs: current.output_logs.some((log) => log.task_id === task.id) ? current.output_logs : [completed.output, ...current.output_logs],
            };
          }
          return { ...current, tasks: replaceById(current.tasks, normalized) };
        });
      },
      completeTask(id: string) {
        setData((current) => {
          const task = current.tasks.find((item) => item.id === id);
          if (!task) return current;
          const completed = completeTask(task);
          return {
            ...current,
            tasks: replaceById(current.tasks, completed.task),
            output_logs: current.output_logs.some((log) => log.task_id === id) ? current.output_logs : [completed.output, ...current.output_logs],
          };
        });
      },
      rolloverTask(id: string) {
        setData((current) => {
          const task = current.tasks.find((item) => item.id === id);
          return task ? { ...current, tasks: replaceById(current.tasks, rolloverTask(task)) } : current;
        });
      },
      deleteTask(id: string) {
        storageService.markDeleted("tasks", id);
        setData((current) => ({ ...current, tasks: current.tasks.filter((task) => task.id !== id) }));
      },
      addInbox(title: string, source: InboxItem["source"] = "手动输入") {
        const now = nowISO();
        const item: InboxItem = { id: makeId("inbox"), user_id: null, title, source, is_processed: false, note: "", attachment_url: "", created_at: now, updated_at: now };
        setData((current) => ({ ...current, inbox_items: [item, ...current.inbox_items] }));
      },
      upsertInbox(item: InboxItem) {
        setData((current) => ({ ...current, inbox_items: replaceById(current.inbox_items, { ...item, updated_at: nowISO() }) }));
      },
      deleteInbox(id: string) {
        storageService.markDeleted("inbox_items", id);
        setData((current) => ({ ...current, inbox_items: current.inbox_items.filter((item) => item.id !== id) }));
      },
      convertInbox(item: InboxItem, patch: Partial<Task>) {
        const base = createTaskDraft(item.title);
        const task: Task = {
          ...base,
          category: suggestTaskCategory(item.title),
          priority: suggestPriority(item.title),
          quadrant: suggestQuadrant(item.title),
          note: item.note,
          ...patch,
        };
        setData((current) => ({
          ...current,
          tasks: [task, ...current.tasks],
          inbox_items: current.inbox_items.map((entry) => (entry.id === item.id ? { ...entry, is_processed: true, updated_at: nowISO() } : entry)),
        }));
      },
      upsertWeekly(item: WeeklyTask) {
        setData((current) => ({ ...current, weekly_tasks: replaceById(current.weekly_tasks, { ...item, updated_at: nowISO() }) }));
      },
      deleteWeekly(id: string) {
        storageService.markDeleted("weekly_tasks", id);
        setData((current) => ({ ...current, weekly_tasks: current.weekly_tasks.filter((item) => item.id !== id) }));
      },
      upsertRecurring(item: RecurringTask) {
        setData((current) => ({ ...current, recurring_tasks: replaceById(current.recurring_tasks, { ...item, updated_at: nowISO() }) }));
      },
      deleteRecurring(id: string) {
        storageService.markDeleted("recurring_tasks", id);
        setData((current) => ({ ...current, recurring_tasks: current.recurring_tasks.filter((item) => item.id !== id) }));
      },
      generateRecurringToday() {
        setData((current) => {
          const created: Task[] = [];
          current.recurring_tasks.filter((item) => item.enabled).forEach((item) => {
            const exists = current.tasks.some((task) => task.title === item.title && task.plan_date === todayISO());
            if (!exists) {
              created.push(
                createTaskDraft(item.title),
              );
              created[created.length - 1] = {
                ...created[created.length - 1],
                due_time: item.default_time,
                priority: item.priority,
                category: item.category,
                quadrant: suggestQuadrant(item.title),
                note: item.note,
              };
            }
          });
          setMessage(created.length ? `已生成 ${created.length} 个今日重复任务` : "今日重复任务已存在");
          return { ...current, tasks: [...created, ...current.tasks] };
        });
      },
      upsertOutput(item: OutputLog) {
        setData((current) => ({ ...current, output_logs: replaceById(current.output_logs, item) }));
      },
      deleteOutput(id: string) {
        storageService.markDeleted("output_logs", id);
        setData((current) => ({ ...current, output_logs: current.output_logs.filter((item) => item.id !== id) }));
      },
      upsertReview(item: DailyReview) {
        setData((current) => ({ ...current, daily_reviews: replaceById(current.daily_reviews, { ...item, updated_at: nowISO() }) }));
      },
      updateSettings(patch: Partial<AppData["user_settings"]>) {
        setData((current) => ({ ...current, user_settings: { ...current.user_settings, ...patch, updated_at: nowISO() } }));
      },
      remove(table: TableName, id: string) {
        setData((current) => ({ ...current, [table]: current[table].filter((item) => item.id !== id) }));
      },
      importJson(json: string) {
        const imported = storageService.import(json);
        setData(imported);
        setMessage("数据已导入");
      },
      clearLocal() {
        storageService.clear();
        const reset = storageService.reset();
        setData(reset);
        setMessage("本地数据已重置为示例数据");
      },
      async pushToCloud(userId: string) {
        const pushed = await storageService.pushToCloud(data, userId);
        setData(pushed);
        setMessage("本地数据已同步到 Supabase");
      },
      async pullFromCloud(userId: string) {
        const pulled = await storageService.pullFromCloud(data, userId);
        setData(pulled);
        setMessage("已从 Supabase 拉取数据");
      },
      async syncNow(userId: string) {
        const synced = await storageService.syncNow(data, userId);
        setData(synced);
        setMessage("已完成云端合并同步");
      },
      exportJson() {
        return storageService.export(data);
      },
      setMessage,
    }),
    [data],
  );

  return { data, actions, message };
}

export type TaskActions = ReturnType<typeof useTaskStore>["actions"];
