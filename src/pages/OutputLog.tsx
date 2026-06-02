import { useMemo, useState } from "react";
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import type { AppData, Category, OutputLog, Project, ValueLevel } from "@/types";
import type { TaskActions } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { CATEGORIES, PROJECTS } from "@/utils/constants";
import { makeId } from "@/utils/task";
import { nowISO, todayISO } from "@/utils/date";

function outputDraft(): OutputLog {
  return { id: makeId("output"), user_id: null, task_id: null, completed_date: todayISO(), title: "", project: "人生乘法系统", category: "其他", output_link: "", reusable: true, sop_candidate: false, value_level: "中", note: "", created_at: nowISO() };
}

export function OutputLogPage({ data, actions }: { data: AppData; actions: TaskActions }) {
  const [editing, setEditing] = useState<OutputLog | null>(null);
  const [value, setValue] = useState<ValueLevel | "全部">("全部");
  const [sopOnly, setSopOnly] = useState(false);
  const [project, setProject] = useState<Project | "全部">("全部");
  const [category, setCategory] = useState<Category | "全部">("全部");
  const logs = useMemo(() => data.output_logs.filter((log) => (value === "全部" || log.value_level === value) && (!sopOnly || log.sop_candidate) && (project === "全部" || log.project === project) && (category === "全部" || log.category === category)), [data.output_logs, value, sopOnly, project, category]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">完成记录库</h1>
          <p className="text-sm text-slate-500">把完成事项沉淀为输出物、复用资料和 SOP 候选。</p>
        </div>
        <Button onClick={() => setEditing(outputDraft())}><Plus className="h-4 w-4" /> 手动新增</Button>
      </div>
      <Card>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <Select value={value} onChange={(event) => setValue(event.target.value as ValueLevel | "全部")}><option>全部</option><option>高</option><option>中</option><option>低</option></Select>
          <Select value={project} onChange={(event) => setProject(event.target.value as Project | "全部")}><option>全部</option>{PROJECTS.map((item) => <option key={item}>{item}</option>)}</Select>
          <Select value={category} onChange={(event) => setCategory(event.target.value as Category | "全部")}><option>全部</option>{CATEGORIES.map((item) => <option key={item}>{item}</option>)}</Select>
          <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={sopOnly} onChange={(event) => setSopOnly(event.target.checked)} /> 只看 SOP 候选</label>
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        {logs.map((log) => (
          <Card key={log.id}>
            <CardContent>
              <div className="flex items-start justify-between gap-3">
                <button className="text-left" onClick={() => setEditing(log)}>
                  <p className="text-sm font-semibold text-slate-950">{log.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{log.completed_date} · {log.project} · {log.category}</p>
                </button>
                <Button variant="ghost" onClick={() => actions.deleteOutput(log.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-md bg-indigo-100 px-2 py-1 text-indigo-700">价值 {log.value_level}</span>
                {log.reusable && <span className="rounded-md bg-emerald-100 px-2 py-1 text-emerald-700">可复用</span>}
                {log.sop_candidate && <span className="rounded-md bg-blue-100 px-2 py-1 text-blue-700">SOP 候选</span>}
                {log.output_link && <a className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-slate-700" href={log.output_link} target="_blank"><ExternalLink className="h-3 w-3" /> 输出物</a>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {editing && (
        <Modal title="完成记录编辑" onClose={() => setEditing(null)}>
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              actions.upsertOutput({ ...editing, title: String(form.get("title")), completed_date: String(form.get("completed_date")), project: String(form.get("project")), category: String(form.get("category")) as Category, output_link: String(form.get("output_link")), reusable: form.get("reusable") === "on", sop_candidate: form.get("sop_candidate") === "on", value_level: String(form.get("value_level")) as ValueLevel, note: String(form.get("note")) });
              setEditing(null);
            }}
          >
            <Label>完成任务<Input name="title" defaultValue={editing.title} required /></Label>
            <Label>完成日期<Input name="completed_date" type="date" defaultValue={editing.completed_date} /></Label>
            <Label>所属项目<Input name="project" defaultValue={editing.project} list="output-projects" /><datalist id="output-projects">{PROJECTS.map((item) => <option key={item} value={item} />)}</datalist></Label>
            <Label>类别<Select name="category" defaultValue={editing.category}>{CATEGORIES.map((item) => <option key={item}>{item}</option>)}</Select></Label>
            <Label>价值等级<Select name="value_level" defaultValue={editing.value_level}>{["高", "中", "低"].map((item) => <option key={item}>{item}</option>)}</Select></Label>
            <Label>输出物链接<Input name="output_link" defaultValue={editing.output_link} /></Label>
            <label className="flex items-center gap-2 text-sm text-slate-700"><input name="reusable" type="checkbox" defaultChecked={editing.reusable} /> 可复用</label>
            <label className="flex items-center gap-2 text-sm text-slate-700"><input name="sop_candidate" type="checkbox" defaultChecked={editing.sop_candidate} /> 可沉淀 SOP</label>
            <label className="space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2">备注<Textarea name="note" defaultValue={editing.note} /></label>
            <div className="flex justify-end gap-2 sm:col-span-2"><Button type="button" variant="outline" onClick={() => setEditing(null)}>取消</Button><Button type="submit">保存</Button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}
