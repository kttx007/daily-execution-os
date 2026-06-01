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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <Card className="w-full max-w-xl shadow-2xl border-white/10 glass-card animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/[0.02]">
          <h2 className="text-2xl font-black tracking-tighter text-white">{task ? '编辑任务' : '新建任务'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-muted-foreground hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <CardContent className="p-8 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
              Task Name
            </label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full text-2xl font-black bg-transparent border-none focus:ring-0 p-0 placeholder:text-muted-foreground/20 text-white tracking-tight"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                <Flag size={12} /> Priority
              </label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl p-3 text-sm font-bold focus:ring-2 ring-white/20 transition-all text-zinc-300 appearance-none cursor-pointer hover:bg-white/10"
              >
                <option value="P0">🔥 P0 绝对核心</option>
                <option value="P1">⚡ P1 高级优先</option>
                <option value="P2">📅 P2 普通事项</option>
                <option value="P3">☕ P3 低级琐事</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                <AlertCircle size={12} /> Matrix
              </label>
              <select 
                value={quadrant}
                onChange={(e) => setQuadrant(e.target.value as Quadrant)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl p-3 text-sm font-bold focus:ring-2 ring-white/20 transition-all text-zinc-300 appearance-none cursor-pointer hover:bg-white/10"
              >
                <option value="Q1">Q1 重要且紧急</option>
                <option value="Q2">Q2 重要不紧急</option>
                <option value="Q3">Q3 紧急不重要</option>
                <option value="Q4">Q4 不重要不紧急</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                <CalendarIcon size={12} /> Plan Date
              </label>
              <input
                type="date"
                value={planDate}
                onChange={(e) => setPlanDate(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl p-3 text-sm font-bold focus:ring-2 ring-white/20 transition-all text-zinc-300 invert-[0.9] dark:invert-0"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                <Clock size={12} /> Due Time
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl p-3 text-sm font-bold focus:ring-2 ring-white/20 transition-all text-zinc-300 invert-[0.9] dark:invert-0"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
              <Tag size={12} /> Domain
            </label>
            <div className="flex flex-wrap gap-2">
              {['Work', 'Life', 'Growth', 'Health'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat as Category)}
                  className={cn(
                    "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm",
                    category === cat 
                      ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
                      : "bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
              Notes & Context
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any extra context or SOP links..."
              className="w-full min-h-[120px] bg-white/5 border border-white/5 rounded-[1.5rem] p-4 text-sm font-medium focus:ring-2 ring-white/20 transition-all resize-none text-zinc-300 placeholder:text-muted-foreground/20"
            />
          </div>
        </CardContent>

        <div className="p-8 pt-0 flex gap-4 bg-white/[0.02] border-t border-white/5 mt-4">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-2xl border border-white/5 text-muted-foreground font-black uppercase tracking-widest text-xs hover:bg-white/5 hover:text-white transition-all"
          >
            Cancel
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
            className="flex-1 px-6 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90 disabled:opacity-50 transition-all shadow-xl active:scale-95"
          >
            Commit Task
          </button>
        </div>
      </Card>
    </div>
  );
};

export default TaskModal;
