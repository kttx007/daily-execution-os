import { CalendarClock, CheckCircle2, Edit3, RotateCcw, Trash2, AlertTriangle } from "lucide-react";
import type { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { PriorityBadge, QuadrantBadge, StatusBadge } from "@/components/task/TaskBadges";
import { cn } from "@/lib/utils";

export function TaskCard({
  task,
  onEdit,
  onComplete,
  onRollover,
  onDelete,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onComplete: (id: string) => void;
  onRollover: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className={cn("rounded-lg border bg-white p-3", task.is_stuck ? "border-orange-300 bg-orange-50/40" : "border-slate-200")}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <PriorityBadge priority={task.priority} />
            <QuadrantBadge quadrant={task.quadrant} />
            <StatusBadge status={task.status} />
            {task.is_stuck && (
              <span className="inline-flex items-center gap-1 rounded-md bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                <AlertTriangle className="h-3 w-3" /> 卡住
              </span>
            )}
          </div>
          <button className="text-left text-sm font-semibold text-slate-950 hover:text-blue-700" onClick={() => onEdit(task)}>
            {task.title}
          </button>
          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            <span>{task.project}</span>
            <span>{task.category}</span>
            <span className="inline-flex items-center gap-1">
              <CalendarClock className="h-3.5 w-3.5" />
              {task.plan_date} {task.due_time}
            </span>
            {task.delay_count > 0 && <span>延期 {task.delay_count} 次</span>}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button variant="ghost" onClick={() => onEdit(task)} aria-label="编辑">
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" onClick={() => onComplete(task.id)} aria-label="完成">
            <CheckCircle2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" onClick={() => onRollover(task.id)} aria-label="顺延">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" onClick={() => onDelete(task.id)} aria-label="删除">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {task.note && <p className="mt-2 text-xs leading-5 text-slate-500">{task.note}</p>}
    </div>
  );
}
