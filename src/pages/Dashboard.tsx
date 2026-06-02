import { useState } from "react";
import { AlertTriangle, Archive, CheckCircle2, Clock3, Flame, Inbox, Plus, Target, Trophy } from "lucide-react";
import type { AppData, ViewKey } from "@/types";
import type { TaskActions } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/field";
import { StatCard } from "@/components/dashboard/StatCard";
import { TaskCard } from "@/components/task/TaskCard";
import { dashboardStats, sortTasks } from "@/utils/task";
import { displayDate, isReviewTime, todayISO } from "@/utils/date";
import { suggestPriority, suggestQuadrant, suggestTaskCategory } from "@/services/aiService";

export function Dashboard({ data, actions, setView }: { data: AppData; actions: TaskActions; setView: (view: ViewKey) => void }) {
  const [taskTitle, setTaskTitle] = useState("");
  const [inboxTitle, setInboxTitle] = useState("");
  const stats = dashboardStats(data);
  const top3 = sortTasks(stats.unfinished).slice(0, 3);
  const weeklyFocus = data.weekly_tasks.filter((item) => item.status !== "已完成").slice(0, 4);
  const reviewDue = isReviewTime(data.user_settings.reminder_time) && !data.daily_reviews.some((review) => review.date === todayISO() && review.completed_summary);

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-slate-500">{displayDate()}</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">今天先抓住最重要的三件事</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">收集、执行、沉淀，让每天的动作进入长期复利。</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:w-[520px]">
            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (!taskTitle.trim()) return;
                actions.addTask({ title: taskTitle.trim(), category: suggestTaskCategory(taskTitle), priority: suggestPriority(taskTitle), quadrant: suggestQuadrant(taskTitle) });
                setTaskTitle("");
              }}
            >
              <Input value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} placeholder="快速新增正式任务" />
              <Button type="submit" aria-label="新增任务">
                <Plus className="h-4 w-4" />
              </Button>
            </form>
            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (!inboxTitle.trim()) return;
                actions.addInbox(inboxTitle.trim());
                setInboxTitle("");
              }}
            >
              <Input value={inboxTitle} onChange={(event) => setInboxTitle(event.target.value)} placeholder="快速丢进收集箱" />
              <Button type="submit" variant="outline" aria-label="新增收集箱">
                <Inbox className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard label="今日必须完成" value={stats.mustDo.length} icon={Flame} tone="bg-rose-100 text-rose-700" />
        <StatCard label="今日已完成" value={stats.completed.length} icon={CheckCircle2} tone="bg-emerald-100 text-emerald-700" />
        <StatCard label="今日未完成" value={stats.unfinished.length} icon={Clock3} tone="bg-blue-100 text-blue-700" />
        <StatCard label="当前卡住" value={stats.stuck.length} icon={AlertTriangle} tone="bg-orange-100 text-orange-700" />
        <StatCard label="高价值输出" value={stats.highValueOutputs.length} icon={Trophy} tone="bg-indigo-100 text-indigo-700" />
        <StatCard label="SOP 候选" value={stats.sopCandidates.length} icon={Archive} tone="bg-slate-100 text-slate-700" />
      </div>

      <Card>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">今日完成率</span>
            <span className="font-semibold text-slate-950">{stats.completionRate}%</span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-blue-700 transition-all" style={{ width: `${stats.completionRate}%` }} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader>
            <CardTitle>今日最重要三件事</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {top3.length ? top3.map((task) => <TaskCard key={task.id} task={task} onEdit={() => setView("today")} onComplete={actions.completeTask} onRollover={actions.rolloverTask} onDelete={actions.deleteTask} />) : <p className="text-sm text-slate-500">今日没有未完成任务，可以从收集箱整理一个重点。</p>}
          </CardContent>
        </Card>
        <div className="space-y-5">
          <Card className={reviewDue ? "border-amber-200 bg-amber-50" : ""}>
            <CardHeader>
              <CardTitle>17:00 复盘提醒</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm leading-6 text-slate-600">默认 {data.user_settings.reminder_time} 进入复盘。完成当天总结后，明天 Top 3 会更清晰。</p>
              <Button onClick={() => setView("review")}>进入每日复盘</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>本周重点任务</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {weeklyFocus.map((item) => (
                <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-900">{item.title}</p>
                    <span className="text-xs text-slate-500">{item.progress}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full bg-indigo-600" style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          {stats.stuck.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle>卡住任务提醒</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {stats.stuck.slice(0, 3).map((task) => (
                  <button key={task.id} onClick={() => setView("today")} className="flex w-full items-center gap-2 rounded-md bg-white px-3 py-2 text-left text-sm text-orange-800">
                    <Target className="h-4 w-4" />
                    {task.title}
                  </button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
