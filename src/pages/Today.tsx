import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CheckCircle2, Circle, Clock, ChevronRight, AlertCircle, Plus } from 'lucide-react';
import { storage } from '@/services/storageService';
import { TaskService } from '@/services/taskService';
import { Task } from '@/types';
import { cn } from '@/lib/utils';
import TaskModal from '@/components/tasks/TaskModal';

const Today: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const loadTasks = async () => {
    await TaskService.autoRolloverTasks();
    const tasks = await storage.getTasks();
    const today = new Date().toISOString().split('T')[0];
    setTasks(tasks.filter(t => t.plan_date === today && t.status !== '已完成'));
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      if (editingTask) {
        await storage.updateTask(editingTask.id, taskData);
      } else {
        await TaskService.createTask(
          taskData.title!, 
          taskData.priority!, 
          taskData.quadrant!, 
          taskData.category!,
          {
            plan_date: taskData.plan_date || new Date().toISOString().split('T')[0],
            due_time: taskData.due_time,
            note: taskData.note
          }
        );
      }
      setIsModalOpen(false);
      loadTasks();
    } catch (error) {
      console.error('Failed to save task:', error);
      alert('保存失败，请检查控制台日志');
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    await TaskService.completeTask(taskId);
    loadTasks();
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-24 max-w-5xl mx-auto">
      <header className="flex justify-between items-center bg-slate-900/40 p-10 rounded-[2.5rem] border border-slate-800/50 glass-card">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-blue-400 font-bold tracking-[0.2em]">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] uppercase">Execution Core v2.1</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-100">今日执行任务</h1>
          <p className="text-slate-400 text-sm font-medium">
            聚焦当下，把最重要的事情 <span className="text-blue-400 font-bold">(P0)</span> 放在第一位。
          </p>
        </div>
        <button 
          onClick={handleCreateTask}
          className="bg-blue-600 text-white w-16 h-16 rounded-2xl shadow-[0_20px_40px_rgba(37,99,235,0.2)] hover:scale-110 hover:bg-blue-500 hover:rotate-90 transition-all duration-500 flex items-center justify-center group"
        >
          <Plus size={32} className="group-hover:stroke-[3px]" />
        </button>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {['P0', 'P1', 'P2', 'P3'].map(priority => {
          const priorityTasks = tasks.filter(t => t.priority === priority);
          if (priorityTasks.length === 0 && priority !== 'P0') return null;

          const isP0 = priority === 'P0';

          return (
            <section key={priority} className="space-y-6">
              <div className="flex items-center gap-4 px-2">
                <h2 className={cn(
                  "text-[10px] font-bold tracking-[0.3em] uppercase",
                  isP0 ? "text-blue-400" : "text-slate-600"
                )}>
                  {isP0 ? 'Strategic Focus' : `Standard Level ${priority}`}
                </h2>
                <div className="h-[1px] flex-1 bg-slate-800" />
                {isP0 && <span className="text-[10px] font-bold text-blue-500/80 bg-blue-500/10 px-2.5 py-1 rounded-md uppercase tracking-widest border border-blue-500/20">Critical Output</span>}
              </div>

              <div className="grid gap-4">
                {priorityTasks.length > 0 ? priorityTasks.map(task => (
                  <Card key={task.id} className={cn(
                    "glass-card border-l-[6px] transition-all duration-300 hover:bg-slate-800/40 hover:translate-x-1 group overflow-hidden",
                    isP0 ? "border-l-blue-500 bg-blue-500/[0.02] shadow-[0_10px_40px_rgba(59,130,246,0.05)]" : "border-l-slate-700 bg-slate-900/20"
                  )}>
                    <CardContent className="p-0 flex items-stretch">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleToggleComplete(task.id); }}
                        className="w-20 flex items-center justify-center border-r border-slate-800/50 hover:bg-emerald-500/10 transition-all group/btn"
                      >
                        <Circle size={28} className="text-slate-700 group-hover/btn:text-emerald-500 group-hover/btn:scale-110 transition-all" />
                      </button>
                      
                      <div 
                        onClick={() => handleEditTask(task)}
                        className="flex-1 p-8 space-y-4 cursor-pointer"
                      >
                        <div className="flex justify-between items-start gap-6">
                          <div className={cn(
                            "text-xl font-bold tracking-tight group-hover:text-white transition-colors leading-snug",
                            isP0 ? "text-slate-100" : "text-slate-300"
                          )}>
                            {task.title}
                          </div>
                          <div className="text-[12px] font-bold text-slate-500 tabular-nums bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                            {task.due_time || '--:--'}
                          </div>
                        </div>

                        <div className="flex items-center gap-5">
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg border",
                            isP0 ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-slate-800/50 text-slate-500 border-slate-700/50"
                          )}>
                            {task.category}
                          </span>
                          
                          {task.delay_count > 0 && (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-orange-500/10 border border-orange-500/20">
                              <AlertCircle size={10} className="text-orange-500" />
                              <span className="text-[9px] text-orange-500 font-black uppercase tracking-tighter">
                                {task.delay_count}x Rollover
                              </span>
                            </div>
                          )}

                          {task.is_stuck && (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-red-500/20 animate-pulse">
                              <AlertCircle size={10} className="text-red-500" />
                              <span className="text-[9px] text-red-500 font-black uppercase tracking-tighter">Stuck</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <button 
                         onClick={() => handleEditTask(task)}
                         className="w-12 flex items-center justify-center text-muted-foreground/20 group-hover:text-primary transition-all"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="h-24 flex items-center justify-center rounded-[1.5rem] border border-dashed border-white/5 bg-white/[0.02] text-xs font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">
                    Empty Segment
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      <TaskModal 
        isOpen={isModalOpen}
        task={editingTask}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default Today;
