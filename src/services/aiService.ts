import type { Category, Priority, Quadrant, Task } from "@/types";

export function suggestTaskCategory(title: string): Category {
  const text = title.toLowerCase();
  if (text.includes("客户") || text.includes("报价") || text.includes("跟进")) return "客户跟进";
  if (text.includes("阿里") || text.includes("国际站")) return "阿里国际站";
  if (text.includes("售后") || text.includes("诊断")) return "售后技术";
  if (text.includes("规格") || text.includes("详情图")) return "规格书/详情图";
  if (text.includes("sop") || text.includes("流程")) return "SOP沉淀";
  if (text.includes("ai") || text.includes("自动化")) return "AI系统";
  return "其他";
}

export function suggestPriority(title: string): Priority {
  if (/今天|必须|紧急|马上|截止/.test(title)) return "P0";
  if (/重要|客户|增长|复盘|SOP/i.test(title)) return "P1";
  if (/以后|有空|低优先/.test(title)) return "P3";
  return "P2";
}

export function suggestQuadrant(title: string): Quadrant {
  const priority = suggestPriority(title);
  if (priority === "P0") return "Q1";
  if (priority === "P1") return "Q2";
  if (/消息|回复|催/.test(title)) return "Q3";
  return "Q4";
}

export function summarizeDailyReview(tasks: Task[]) {
  const completed = tasks.filter((task) => task.status === "已完成").map((task) => task.title);
  const unfinished = tasks.filter((task) => !["已完成", "放弃"].includes(task.status)).map((task) => task.title);
  return {
    completed_summary: completed.map((title) => `- ${title}`).join("\n"),
    unfinished_summary: unfinished.map((title) => `- ${title}`).join("\n"),
  };
}

export function suggestTomorrowTop3(tasks: Task[]) {
  return tasks
    .filter((task) => !["已完成", "放弃"].includes(task.status))
    .sort((a, b) => a.priority.localeCompare(b.priority))
    .slice(0, 3)
    .map((task, index) => `${index + 1}. ${task.title}`)
    .join("\n");
}
