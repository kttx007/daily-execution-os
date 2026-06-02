import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { AppData, Priority, Status, WeeklyTask } from "@/types";
import type { TaskActions } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { PRIORITIES, PROJECTS, STATUSES } from "@/utils/constants";
import { makeId } from "@/utils/task";
import { nowISO, todayISO } from "@/utils/date";

function weeklyDraft(): WeeklyTask {
  const now = nowISO();
  return { id: makeId("weekly"), user_id: null, title: "", project: "人生乘法系统", goal: "", priority: "P1", progress: 0, status: "未开始", start_date: todayISO(), end_date: todayISO(), related_task_ids: [], note: "", created_at: now, updated_at: now };
}

export function Weekly({ data, actions }: { data: AppData; actions: TaskActions }) {
  const [editing, setEditing] = useState<WeeklyTask | null>(null);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">周任务</h1>
          <p className="text-sm text-slate-500">把本周目标拆成可推进的执行块。</p>
        </div>
        <Button onClick={() => setEditing(weeklyDraft())}><Plus className="h-4 w-4" /> 新增周任务</Button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {data.weekly_tasks.map((item) => (
          <Card key={item.id}>
            <CardContent>
              <div className="flex items-start justify-between gap-3">
                <button onClick={() => setEditing(item)} className="text-left">
                  <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.goal}</p>
                </button>
                <Button variant="ghost" onClick={() => actions.deleteWeekly(item.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>{item.project}</span>
                <span>{item.priority} · {item.status}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-blue-700" style={{ width: `${item.progress}%` }} /></div>
            </CardContent>
          </Card>
        ))}
      </div>
      {editing && (
        <Modal title="周任务编辑" onClose={() => setEditing(null)}>
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              actions.upsertWeekly({ ...editing, title: String(form.get("title")), project: String(form.get("project")), goal: String(form.get("goal")), priority: String(form.get("priority")) as Priority, progress: Number(form.get("progress")), status: String(form.get("status")) as Status, start_date: String(form.get("start_date")), end_date: String(form.get("end_date")), note: String(form.get("note")) });
              setEditing(null);
            }}
          >
            <Label>周任务名称<Input name="title" defaultValue={editing.title} required /></Label>
            <Label>所属项目<Input name="project" defaultValue={editing.project} list="weekly-projects" /><datalist id="weekly-projects">{PROJECTS.map((item) => <option key={item} value={item} />)}</datalist></Label>
            <Label>优先级<Select name="priority" defaultValue={editing.priority}>{PRIORITIES.map((item) => <option key={item}>{item}</option>)}</Select></Label>
            <Label>状态<Select name="status" defaultValue={editing.status}>{STATUSES.map((item) => <option key={item}>{item}</option>)}</Select></Label>
            <Label>开始日期<Input name="start_date" type="date" defaultValue={editing.start_date} /></Label>
            <Label>结束日期<Input name="end_date" type="date" defaultValue={editing.end_date} /></Label>
            <Label>进度<Input name="progress" type="number" min={0} max={100} defaultValue={editing.progress} /></Label>
            <label className="space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2">本周目标<Textarea name="goal" defaultValue={editing.goal} /></label>
            <label className="space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2">备注<Textarea name="note" defaultValue={editing.note} /></label>
            <div className="flex justify-end gap-2 sm:col-span-2"><Button type="button" variant="outline" onClick={() => setEditing(null)}>取消</Button><Button type="submit">保存</Button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}
