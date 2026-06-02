import { useMemo, useState } from "react";
import { Check, FilePlus2, Trash2 } from "lucide-react";
import type { AppData, InboxItem, InboxSource, Task } from "@/types";
import type { TaskActions } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { TaskForm } from "@/components/forms/TaskForm";
import { createTaskDraft } from "@/utils/task";
import { suggestPriority, suggestQuadrant, suggestTaskCategory } from "@/services/aiService";

const SOURCES: InboxSource[] = ["手动输入", "客户", "阿里国际站", "微信", "文件", "想法", "其他"];

export function InboxPage({ data, actions }: { data: AppData; actions: TaskActions }) {
  const [title, setTitle] = useState("");
  const [source, setSource] = useState<InboxSource | "全部">("全部");
  const [onlyOpen, setOnlyOpen] = useState(true);
  const [converting, setConverting] = useState<{ item: InboxItem; task: Task } | null>(null);
  const items = useMemo(() => data.inbox_items.filter((item) => (source === "全部" || item.source === source) && (!onlyOpen || !item.is_processed)), [data.inbox_items, source, onlyOpen]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">任务收集箱</h1>
        <p className="text-sm text-slate-500">先快速捕获，再整理成正式执行任务。</p>
      </div>
      <Card>
        <CardContent>
          <form
            className="grid gap-3 md:grid-cols-[1fr_180px_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              if (!title.trim()) return;
              actions.addInbox(title.trim(), source === "全部" ? "手动输入" : source);
              setTitle("");
            }}
          >
            <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="客户事项、文件事项、想法先丢进来" />
            <Select value={source} onChange={(event) => setSource(event.target.value as InboxSource | "全部")}>
              <option>全部</option>
              {SOURCES.map((item) => <option key={item}>{item}</option>)}
            </Select>
            <Button type="submit">新增收集</Button>
          </form>
          <label className="mt-3 flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={onlyOpen} onChange={(event) => setOnlyOpen(event.target.checked)} />
            只看未整理
          </label>
        </CardContent>
      </Card>
      <div className="grid gap-3 lg:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-600">{item.source}</span>
                  <span className={item.is_processed ? "rounded-md bg-emerald-100 px-2 py-1 text-emerald-700" : "rounded-md bg-amber-100 px-2 py-1 text-amber-700"}>{item.is_processed ? "已整理" : "未整理"}</span>
                </div>
                <p className="mt-3 text-sm font-medium text-slate-950">{item.title}</p>
                {item.note && <p className="mt-1 text-xs text-slate-500">{item.note}</p>}
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" onClick={() => actions.upsertInbox({ ...item, is_processed: true })} aria-label="标记已整理"><Check className="h-4 w-4" /></Button>
                <Button variant="ghost" onClick={() => setConverting({ item, task: { ...createTaskDraft(item.title), category: suggestTaskCategory(item.title), priority: suggestPriority(item.title), quadrant: suggestQuadrant(item.title), note: item.note } })} aria-label="转任务"><FilePlus2 className="h-4 w-4" /></Button>
                <Button variant="ghost" onClick={() => actions.deleteInbox(item.id)} aria-label="删除"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {converting && (
        <Modal title="转为正式任务" onClose={() => setConverting(null)}>
          <TaskForm task={converting.task} onSubmit={(task) => { actions.convertInbox(converting.item, task); setConverting(null); }} onCancel={() => setConverting(null)} />
        </Modal>
      )}
    </div>
  );
}
