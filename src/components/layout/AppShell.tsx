import { Archive, CalendarDays, CheckSquare, ClipboardList, Grid2X2, Home, Inbox, Repeat, Settings, StickyNote } from "lucide-react";
import type { ViewKey } from "@/types";
import { cn } from "@/lib/utils";

const nav: { key: ViewKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "dashboard", label: "首页驾驶舱", icon: Home },
  { key: "inbox", label: "任务收集箱", icon: Inbox },
  { key: "today", label: "今日任务", icon: CheckSquare },
  { key: "matrix", label: "四象限", icon: Grid2X2 },
  { key: "weekly", label: "周任务", icon: CalendarDays },
  { key: "recurring", label: "重复任务", icon: Repeat },
  { key: "outputs", label: "完成记录", icon: Archive },
  { key: "review", label: "每日复盘", icon: StickyNote },
  { key: "settings", label: "设置", icon: Settings },
];

const mobileNav = nav.filter((item) => ["dashboard", "today", "inbox", "review", "settings"].includes(item.key));

export function AppShell({ view, setView, children }: { view: ViewKey; setView: (view: ViewKey) => void; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-4 lg:block">
        <div className="mb-7">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">OS</div>
          <h1 className="mt-3 text-lg font-semibold leading-6 text-slate-950">人生乘法任务中枢</h1>
          <p className="text-xs text-slate-500">Daily Execution OS</p>
        </div>
        <nav className="space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => setView(item.key)}
                className={cn("flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition", view === item.key ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100")}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
      <main className="pb-20 lg:ml-64 lg:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">{children}</div>
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-slate-200 bg-white lg:hidden">
        {mobileNav.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.key} onClick={() => setView(item.key)} className={cn("flex flex-col items-center gap-1 py-2 text-xs", view === item.key ? "text-blue-700" : "text-slate-500")}>
              <Icon className="h-5 w-5" />
              {item.key === "settings" ? "更多" : item.label.replace("任务", "").replace("驾驶舱", "")}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
