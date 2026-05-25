import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { X, Calendar as CalendarIcon, Clock, Tag, Flag, AlertCircle } from 'lucide-react';
import { Task, Priority, Quadrant, Category } from '@/types';
import { cn } from '@/lib/utils';

interface TaskModalProps {
  task?: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('P1');
  const [quadrant, setQuadrant] = useState<Quadrant>('Q2');
  const [category, setCategory] = useState<Category>('Work');
  const [planDate, setPlanDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setPriority(task.priority || 'P1');
      setQuadrant(task.quadrant || 'Q2');
      setCategory((task.category as Category) || 'Work');
      setPlanDate(task.plan_date);
      setDueTime(task.due_time || '');
      setNote(task.note || '');
    } else {
      setTitle('');
      setPriority('P1');
      setQuadrant('Q2');
      setCategory('Work');
      setPlanDate(new Date().toISOString().split('T')[0]);
      setDueTime('');
      setNote('');
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-lg shadow-2xl border-primary/10">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold tracking-tight">{task ? '编辑任务' : '新建任务'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              任务名称
            </label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="做什么？"
              className="w-full text-lg font-semibold bg-transparent border-none focus:ring-0 p-0 placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Flag size={14} /> 优先级
              </label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-muted/50 border-none rounded-xl p-2 text-sm font-medium focus:ring-2 ring-primary transition-all"
              >
                <option value="P0">🔥 P0 绝对核心</option>
                <option value="P1">⚡ P1 高级优先</option>
                <option value="P2">📅 P2 普通事项</option>
                <option value="P3">☕ P3 低级琐事</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertCircle size={14} /> 四象限
              </label>
              <select 
                value={quadrant}
                onChange={(e) => setQuadrant(e.target.value as Quadrant)}
                className="w-full bg-muted/50 border-none rounded-xl p-2 text-sm font-medium focus:ring-2 ring-primary transition-all"
              >
                <option value="Q1">Q1 重要且紧急</option>
                <option value="Q2">Q2 重要不紧急</option>
                <option value="Q3">Q3 紧急不重要</option>
                <option value="Q4">Q4 不重要不紧急</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CalendarIcon size={14} /> 计划日期
              </label>
              <input
                type="date"
                value={planDate}
                onChange={(e) => setPlanDate(e.target.value)}
                className="w-full bg-muted/50 border-none rounded-xl p-2 text-sm font-medium focus:ring-2 ring-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock size={14} /> 截止时间
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full bg-muted/50 border-none rounded-xl p-2 text-sm font-medium focus:ring-2 ring-primary transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Tag size={14} /> 领域分类
            </label>
            <div className="flex flex-wrap gap-2">
              {['Work', 'Life', 'Growth', 'Health'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat as Category)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold transition-all border",
                    category === cat 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-muted/50 text-muted-foreground hover:bg-muted border-transparent"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              备注内容
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="添加补充说明或 SOP 链接..."
              className="w-full min-h-[100px] bg-muted/50 border-none rounded-xl p-3 text-sm focus:ring-2 ring-primary transition-all resize-none"
            />
          </div>
        </CardContent>

        <div className="p-6 pt-0 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2 border rounded-xl hover:bg-accent transition-colors font-medium"
          >
            取消
          </button>
          <button 
            onClick={() => onSave({
              title,
              priority,
              quadrant,
              category,
              plan_date: planDate,
              due_time: dueTime || undefined,
              note
            })}
            disabled={!title}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-50 transition-all font-bold"
          >
            保存任务
          </button>
        </div>
      </Card>
    </div>
  );
};

export default TaskModal;
