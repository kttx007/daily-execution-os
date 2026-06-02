import type { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/field";
import { CATEGORIES, PRIORITIES, PROJECTS, QUADRANTS, STATUSES } from "@/utils/constants";
import { taskPatchFromForm } from "@/utils/task";

export function TaskForm({ task, onSubmit, onCancel }: { task: Task; onSubmit: (task: Task) => void; onCancel: () => void }) {
  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ ...task, ...taskPatchFromForm(new FormData(event.currentTarget)) });
      }}
    >
      <Label>
        任务名称
        <Input name="title" defaultValue={task.title} required />
      </Label>
      <Label>
        所属项目
        <Input name="project" defaultValue={task.project} list="project-options" />
        <datalist id="project-options">{PROJECTS.map((item) => <option key={item} value={item} />)}</datalist>
      </Label>
      <Label>
        类别
        <Select name="category" defaultValue={task.category}>
          {CATEGORIES.map((item) => <option key={item}>{item}</option>)}
        </Select>
      </Label>
      <Label>
        优先级
        <Select name="priority" defaultValue={task.priority}>
          {PRIORITIES.map((item) => <option key={item}>{item}</option>)}
        </Select>
      </Label>
      <Label>
        四象限
        <Select name="quadrant" defaultValue={task.quadrant}>
          {QUADRANTS.map((item) => <option key={item}>{item}</option>)}
        </Select>
      </Label>
      <Label>
        状态
        <Select name="status" defaultValue={task.status}>
          {STATUSES.map((item) => <option key={item}>{item}</option>)}
        </Select>
      </Label>
      <Label>
        重要程度
        <Select name="importance" defaultValue={task.importance}>
          {["高", "中", "低"].map((item) => <option key={item}>{item}</option>)}
        </Select>
      </Label>
      <Label>
        紧急程度
        <Select name="urgency" defaultValue={task.urgency}>
          {["高", "中", "低"].map((item) => <option key={item}>{item}</option>)}
        </Select>
      </Label>
      <Label>
        计划日期
        <Input name="plan_date" type="date" defaultValue={task.plan_date} />
      </Label>
      <Label>
        截止时间
        <Input name="due_time" type="time" defaultValue={task.due_time} />
      </Label>
      <Label>
        预计耗时（分钟）
        <Input name="estimated_time" type="number" min={5} step={5} defaultValue={task.estimated_time} />
      </Label>
      <Label>
        输出物链接
        <Input name="output_link" defaultValue={task.output_link} placeholder="https://" />
      </Label>
      <label className="space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2">
        备注
        <Textarea name="note" defaultValue={task.note} />
      </label>
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">保存任务</Button>
      </div>
    </form>
  );
}
