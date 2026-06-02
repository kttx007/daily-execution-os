import type { Category, Priority, Project, Quadrant, Status } from "@/types";

export const CATEGORIES: Category[] = [
  "阿里国际站",
  "客户跟进",
  "售后技术",
  "产品资料",
  "规格书/详情图",
  "AI系统",
  "SOP沉淀",
  "学习研究",
  "家庭生活",
  "个人事务",
  "其他",
];

export const PROJECTS: Project[] = [
  "开腾业务增长",
  "阿里国际站运营",
  "GUANGYAN产品资料库",
  "重点客户维护",
  "售后诊断系统",
  "人生乘法系统",
  "AI工作流搭建",
];

export const PRIORITIES: Priority[] = ["P0", "P1", "P2", "P3"];
export const QUADRANTS: Quadrant[] = ["Q1", "Q2", "Q3", "Q4"];
export const STATUSES: Status[] = ["未开始", "进行中", "已完成", "延期", "放弃"];

export const QUADRANT_META: Record<Quadrant, { title: string; description: string; tone: string }> = {
  Q1: { title: "Q1 重要且紧急", description: "立刻处理，避免拖延扩散", tone: "border-rose-200 bg-rose-50 text-rose-700" },
  Q2: { title: "Q2 重要不紧急", description: "复利区，主动推进", tone: "border-blue-200 bg-blue-50 text-blue-700" },
  Q3: { title: "Q3 紧急不重要", description: "压缩处理，避免占满注意力", tone: "border-amber-200 bg-amber-50 text-amber-700" },
  Q4: { title: "Q4 不重要不紧急", description: "减少投入，暂不打扰", tone: "border-slate-200 bg-slate-50 text-slate-600" },
};

export const PRIORITY_META: Record<Priority, { label: string; tone: string }> = {
  P0: { label: "P0 必须完成", tone: "bg-rose-100 text-rose-700 border-rose-200" },
  P1: { label: "P1 重点推进", tone: "bg-blue-100 text-blue-700 border-blue-200" },
  P2: { label: "P2 安排处理", tone: "bg-slate-100 text-slate-700 border-slate-200" },
  P3: { label: "P3 暂不打扰", tone: "bg-zinc-100 text-zinc-600 border-zinc-200" },
};

export const STATUS_META: Record<Status, { tone: string }> = {
  未开始: { tone: "bg-slate-100 text-slate-700" },
  进行中: { tone: "bg-indigo-100 text-indigo-700" },
  已完成: { tone: "bg-emerald-100 text-emerald-700" },
  延期: { tone: "bg-orange-100 text-orange-700" },
  放弃: { tone: "bg-zinc-200 text-zinc-600" },
};
