import { useState } from "react";
import type { AppData, Quadrant, Task } from "@/types";
import type { TaskActions } from "@/hooks/useTasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { TaskForm } from "@/components/forms/TaskForm";
import { TaskCard } from "@/components/task/TaskCard";
import { QUADRANT_META, QUADRANTS } from "@/utils/constants";
import { todayISO } from "@/utils/date";

export function Matrix({ data, actions }: { data: AppData; actions: TaskActions }) {
  const [date, setDate] = useState(todayISO());
  const [todayOnly, setTodayOnly] = useState(true);
  const [editing, setEditing] = useState<Task | null>(null);
  const tasks = data.tasks.filter((task) => !todayOnly || task.plan_date === date);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">四象限矩阵</h1>
          <p className="text-sm text-slate-500">第一版保留点击编辑，后续可在这层加入拖拽排序。</p>
        </div>
        <div className="flex items-center gap-3">
          <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          <label className="flex min-w-fit items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={todayOnly} onChange={(event) => setTodayOnly(event.target.checked)} />
            只看指定日期
          </label>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {QUADRANTS.map((quadrant) => {
          const meta = QUADRANT_META[quadrant as Quadrant];
          const quadrantTasks = tasks.filter((task) => task.quadrant === quadrant);
          return (
            <Card key={quadrant} className="min-h-[280px]">
              <CardHeader className={meta.tone}>
                <CardTitle>{meta.title}</CardTitle>
                <p className="text-xs">{meta.description}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {quadrantTasks.map((task) => <TaskCard key={task.id} task={task} onEdit={setEditing} onComplete={actions.completeTask} onRollover={actions.rolloverTask} onDelete={actions.deleteTask} />)}
                {!quadrantTasks.length && <p className="rounded-lg border border-dashed border-slate-200 p-5 text-center text-sm text-slate-400">暂无任务</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>
      {editing && (
        <Modal title="编辑象限任务" onClose={() => setEditing(null)}>
          <TaskForm task={editing} onSubmit={(task) => { actions.upsertTask(task); setEditing(null); }} onCancel={() => setEditing(null)} />
        </Modal>
      )}
    </div>
  );
}
