import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import type { AppData, Category, Quadrant, Status, Task } from "@/types";
import type { TaskActions } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { TaskCard } from "@/components/task/TaskCard";
import { TaskForm } from "@/components/forms/TaskForm";
import { CATEGORIES, QUADRANTS, STATUSES } from "@/utils/constants";
import { createTaskDraft, sortTasks } from "@/utils/task";
import { todayISO } from "@/utils/date";

type Preset = "default" | "all" | "done" | "delayed" | "p01" | "stuck";

export function Today({ data, actions }: { data: AppData; actions: TaskActions }) {
  const [editing, setEditing] = useState<Task | null>(null);
  const [preset, setPreset] = useState<Preset>("default");
  const [status, setStatus] = useState<Status | "全部">("全部");
  const [quadrant, setQuadrant] = useState<Quadrant | "全部">("全部");
  const [category, setCategory] = useState<Category | "全部">("全部");
  const tasks = useMemo(() => {
    let list = data.tasks.filter((task) => task.plan_date === todayISO());
    if (preset === "default") list = list.filter((task) => !["已完成", "放弃"].includes(task.status));
    if (preset === "done") list = list.filter((task) => task.status === "已完成");
    if (preset === "delayed") list = list.filter((task) => task.status === "延期");
    if (preset === "p01") list = list.filter((task) => ["P0", "P1"].includes(task.priority));
    if (preset === "stuck") list = list.filter((task) => task.is_stuck || task.delay_count >= 3);
    if (status !== "全部") list = list.filter((task) => task.status === status);
    if (quadrant !== "全部") list = list.filter((task) => task.quadrant === quadrant);
    if (category !== "全部") list = list.filter((task) => task.category === category);
    return sortTasks(list);
  }, [data.tasks, preset, status, quadrant, category]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">今日任务</h1>
          <p className="text-sm text-slate-500">默认只显示今天未完成、未放弃的任务。</p>
        </div>
        <Button onClick={() => setEditing(createTaskDraft())}>
          <Plus className="h-4 w-4" /> 新增正式任务
        </Button>
      </div>
      <Card>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <Select value={preset} onChange={(event) => setPreset(event.target.value as Preset)}>
            <option value="default">默认执行视图</option>
            <option value="all">全部今日任务</option>
            <option value="done">已完成任务</option>
            <option value="delayed">延期任务</option>
            <option value="p01">P0 / P1 任务</option>
            <option value="stuck">卡住任务</option>
          </Select>
          <Select value={status} onChange={(event) => setStatus(event.target.value as Status | "全部")}>
            <option>全部</option>
            {STATUSES.map((item) => <option key={item}>{item}</option>)}
          </Select>
          <Select value={quadrant} onChange={(event) => setQuadrant(event.target.value as Quadrant | "全部")}>
            <option>全部</option>
            {QUADRANTS.map((item) => <option key={item}>{item}</option>)}
          </Select>
          <Select value={category} onChange={(event) => setCategory(event.target.value as Category | "全部")}>
            <option>全部</option>
            {CATEGORIES.map((item) => <option key={item}>{item}</option>)}
          </Select>
        </CardContent>
      </Card>
      <div className="space-y-3">
        {tasks.map((task) => <TaskCard key={task.id} task={task} onEdit={setEditing} onComplete={actions.completeTask} onRollover={actions.rolloverTask} onDelete={actions.deleteTask} />)}
        {!tasks.length && <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">当前筛选下没有任务。</p>}
      </div>
      {editing && (
        <Modal title="任务编辑" onClose={() => setEditing(null)}>
          <TaskForm task={editing} onSubmit={(task) => { actions.upsertTask(task); setEditing(null); }} onCancel={() => setEditing(null)} />
        </Modal>
      )}
    </div>
  );
}
