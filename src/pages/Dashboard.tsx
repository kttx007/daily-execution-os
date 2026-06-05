import { useState } from "react";
import { AlertTriangle, Archive, CheckCircle2, Clock3, ExternalLink, Flame, Inbox, Plus, Target, Trophy } from "lucide-react";
import type { AppData, OutputLog, Task, ViewKey } from "@/types";
import type { TaskActions } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { StatCard } from "@/components/dashboard/StatCard";
import { TaskCard } from "@/components/task/TaskCard";
import { PriorityBadge, QuadrantBadge, StatusBadge } from "@/components/task/TaskBadges";
import { dashboardStats, sortTasks } from "@/utils/task";
import { displayDate, isReviewTime, todayISO } from "@/utils/date";
import { suggestPriority, suggestQuadrant, suggestTaskCategory } from "@/services/aiService";

type DetailKey = "mustDo" | "completed" | "unfinished" | "stuck" | "highValueOutputs" | "sopCandidates" | "todayTasks";

function ReadonlyTaskList({ tasks }: { tasks: Task[] }) {
  if (!tasks.length) {
    return <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">当前没有对应任务。</p>;
  }

  return (
    <div className="space-y-3">
      {sortTasks(tasks).map((task) => {
        const isStuck = task.is_stuck || task.delay_count >= 3;
        return (
          <div key={task.id} className={`rounded-lg border p-3 ${isStuck ? "border-orange-300 bg-orange-50/40" : "border-slate-200 bg-white"}`}>
            <div className="flex flex-wrap items-center gap-2">
              <PriorityBadge priority={task.priority} />
              <QuadrantBadge quadrant={task.quadrant} />
              <StatusBadge status={task.status} />
              {isStuck && (
                <span className="inline-flex items-center gap-1 rounded-md bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                  <AlertTriangle className="h-3 w-3" /> 卡住
                </span>
              )}
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-950">{task.title}</p>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
              <span>{task.project}</span>
              <span>{task.category}</span>
              <span>计划：{task.plan_date}{task.due_time ? ` ${task.due_time}` : ""}</span>
              {task.delay_count > 0 && <span>延期 {task.delay_count} 次</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ReadonlyOutputList({ outputs }: { outputs: OutputLog[] }) {
  if (!outputs.length) {
    return <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">当前没有对应完成记录。</p>;
  }

  return (
    <div className="space-y-3">
      {outputs.map((output) => (
        <div key={output.id} className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-sm font-semibold text-slate-950">{output.title}</p>
          <p className="mt-1 text-xs text-slate-500">{output.completed_date} · {output.project} · {output.category}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-md bg-indigo-100 px-2 py-1 text-indigo-700">价值 {output.value_level}</span>
            {output.reusable && <span className="rounded-md bg-emerald-100 px-2 py-1 text-emerald-700">可复用</span>}
            {output.sop_candidate && <span className="rounded-md bg-blue-100 px-2 py-1 text-blue-700">SOP 候选</span>}
            {output.output_link && (
              <a className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-slate-700 hover:bg-slate-200" href={output.output_link} target="_blank" rel="noreferrer">
                <ExternalLink className="h-3 w-3" /> 输出物
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Dashboard({ data, actions, setView }: { data: AppData; actions: TaskActions; setView: (view: ViewKey) => void }) {
  const [taskTitle, setTaskTitle] = useState("");
  const [inboxTitle, setInboxTitle] = useState("");
  const [detailKey, setDetailKey] = useState<DetailKey | null>(null);
  const stats = dashboardStats(data);
  const top3 = sortTasks(stats.unfinished).slice(0, 3);
  const weeklyFocus = data.weekly_tasks.filter((item) => item.status !== "已完成").slice(0, 4);
  const reviewDue = isReviewTime(data.user_settings.reminder_time) && !data.daily_reviews.some((review) => review.date === todayISO() && review.completed_summary);
  const detailTitles: Record<DetailKey, string> = {
    mustDo: "今日必须完成任务",
    completed: "今日已完成任务",
    unfinished: "今日未完成任务",
    stuck: "当前卡住任务",
    highValueOutputs: "高价值输出",
    sopCandidates: "SOP 候选",
    todayTasks: "今日全部任务",
  };

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
        <StatCard label="今日必须完成" value={stats.mustDo.length} icon={Flame} tone="bg-rose-100 text-rose-700" onClick={() => setDetailKey("mustDo")} />
        <StatCard label="今日已完成" value={stats.completed.length} icon={CheckCircle2} tone="bg-emerald-100 text-emerald-700" onClick={() => setDetailKey("completed")} />
        <StatCard label="今日未完成" value={stats.unfinished.length} icon={Clock3} tone="bg-blue-100 text-blue-700" onClick={() => setDetailKey("unfinished")} />
        <StatCard label="当前卡住" value={stats.stuck.length} icon={AlertTriangle} tone="bg-orange-100 text-orange-700" onClick={() => setDetailKey("stuck")} />
        <StatCard label="高价值输出" value={stats.highValueOutputs.length} icon={Trophy} tone="bg-indigo-100 text-indigo-700" onClick={() => setDetailKey("highValueOutputs")} />
        <StatCard label="SOP 候选" value={stats.sopCandidates.length} icon={Archive} tone="bg-slate-100 text-slate-700" onClick={() => setDetailKey("sopCandidates")} />
      </div>

      <button
        type="button"
        onClick={() => setDetailKey("todayTasks")}
        aria-label="查看今日完成率对应的全部任务"
        className="w-full rounded-lg border border-slate-200 bg-white text-left shadow-soft transition hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
      >
        <div className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">今日完成率</span>
            <span className="font-semibold text-slate-950">{stats.completionRate}%</span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-blue-700 transition-all" style={{ width: `${stats.completionRate}%` }} />
          </div>
        </div>
      </button>

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

      {detailKey && (
        <Modal title={`${detailTitles[detailKey]}（${stats[detailKey].length}）`} onClose={() => setDetailKey(null)}>
          {detailKey === "highValueOutputs" || detailKey === "sopCandidates"
            ? <ReadonlyOutputList outputs={stats[detailKey]} />
            : <ReadonlyTaskList tasks={stats[detailKey]} />}
        </Modal>
      )}
    </div>
  );
}
