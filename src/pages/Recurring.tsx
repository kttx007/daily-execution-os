import { useState } from "react";
import { Plus, Play, Trash2 } from "lucide-react";
import type { AppData, Category, Frequency, Priority, RecurringTask } from "@/types";
import type { TaskActions } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { CATEGORIES, PRIORITIES } from "@/utils/constants";
import { makeId } from "@/utils/task";
import { nowISO } from "@/utils/date";

function recurringDraft(): RecurringTask {
  const now = nowISO();
  return { id: makeId("recurring"), user_id: null, title: "", frequency: "每天", default_time: "09:00", priority: "P2", category: "个人事务", enabled: true, note: "", created_at: now, updated_at: now };
}

export function Recurring({ data, actions }: { data: AppData; actions: TaskActions }) {
  const [editing, setEditing] = useState<RecurringTask | null>(null);
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">重复任务</h1>
          <p className="text-sm text-slate-500">每天、每周、每月的固定动作一键生成。</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={actions.generateRecurringToday}><Play className="h-4 w-4" /> 生成今日重复任务</Button>
          <Button onClick={() => setEditing(recurringDraft())}><Plus className="h-4 w-4" /> 新增</Button>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {data.recurring_tasks.map((item) => (
          <Card key={item.id}>
            <CardContent>
              <div className="flex items-start justify-between gap-3">
                <button className="text-left" onClick={() => setEditing(item)}>
                  <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.frequency} · {item.default_time} · {item.priority} · {item.category}</p>
                </button>
                <div className="flex gap-1">
                  <Button variant={item.enabled ? "secondary" : "outline"} onClick={() => actions.upsertRecurring({ ...item, enabled: !item.enabled })}>{item.enabled ? "启用" : "停用"}</Button>
                  <Button variant="ghost" onClick={() => actions.deleteRecurring(item.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {editing && (
        <Modal title="重复任务编辑" onClose={() => setEditing(null)}>
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              actions.upsertRecurring({ ...editing, title: String(form.get("title")), frequency: String(form.get("frequency")) as Frequency, default_time: String(form.get("default_time")), priority: String(form.get("priority")) as Priority, category: String(form.get("category")) as Category, enabled: form.get("enabled") === "on", note: String(form.get("note")) });
              setEditing(null);
            }}
          >
            <Label>任务名称<Input name="title" defaultValue={editing.title} required /></Label>
            <Label>频率<Select name="frequency" defaultValue={editing.frequency}>{["每天", "每周", "每月"].map((item) => <option key={item}>{item}</option>)}</Select></Label>
            <Label>默认时间<Input name="default_time" type="time" defaultValue={editing.default_time} /></Label>
            <Label>默认优先级<Select name="priority" defaultValue={editing.priority}>{PRIORITIES.map((item) => <option key={item}>{item}</option>)}</Select></Label>
            <Label>默认类别<Select name="category" defaultValue={editing.category}>{CATEGORIES.map((item) => <option key={item}>{item}</option>)}</Select></Label>
            <label className="flex items-center gap-2 pt-7 text-sm text-slate-700"><input name="enabled" type="checkbox" defaultChecked={editing.enabled} /> 启用</label>
            <label className="space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2">备注<Textarea name="note" defaultValue={editing.note} /></label>
            <div className="flex justify-end gap-2 sm:col-span-2"><Button type="button" variant="outline" onClick={() => setEditing(null)}>取消</Button><Button type="submit">保存</Button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}
