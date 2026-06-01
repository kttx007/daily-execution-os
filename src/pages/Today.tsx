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
      <header className="flex justify-between items-center bg-white/5 p-8 rounded-[2rem] border border-white/10 glass-card">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-black tracking-[0.2em]">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] uppercase">Execution Core v2.0</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white">今日执行任务</h1>
          <p className="text-muted-foreground text-sm font-medium">
            专注当下，把最重要的事情 (P0) 放在第一位。
          </p>
        </div>
        <button 
          onClick={handleCreateTask}
          className="bg-white text-black w-14 h-14 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-110 hover:rotate-90 transition-all duration-500 flex items-center justify-center group"
        >
          <Plus size={28} className="group-hover:stroke-[3px]" />
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
                  "text-[10px] font-black tracking-[0.3em] uppercase",
                  isP0 ? "text-red-500" : "text-muted-foreground/50"
                )}>
                  {isP0 ? 'Absolute Priority' : `Level ${priority}`}
                </h2>
                <div className="h-[1px] flex-1 bg-white/5" />
                {isP0 && <span className="text-[10px] font-bold text-red-500/50 bg-red-500/10 px-2 py-1 rounded-md uppercase tracking-widest">Action Required</span>}
              </div>

              <div className="grid gap-3">
                {priorityTasks.length > 0 ? priorityTasks.map(task => (
                  <Card key={task.id} className={cn(
                    "glass-card border-l-[6px] transition-all duration-300 hover:bg-white/5 hover:translate-x-1 group overflow-hidden",
                    isP0 ? "border-l-red-500 bg-red-500/5 shadow-[0_0_40px_rgba(239,68,68,0.1)]" : "border-l-zinc-700"
                  )}>
                    <CardContent className="p-0 flex items-stretch">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleToggleComplete(task.id); }}
                        className="w-16 flex items-center justify-center border-r border-white/5 hover:bg-emerald-500/20 transition-all group/btn"
                      >
                        <Circle size={24} className="text-muted-foreground/30 group-hover/btn:text-emerald-500 group-hover/btn:scale-110 transition-all" />
                      </button>
                      
                      <div 
                        onClick={() => handleEditTask(task)}
                        className="flex-1 p-5 space-y-3 cursor-pointer"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className={cn(
                            "text-lg font-bold tracking-tight group-hover:text-white transition-colors",
                            isP0 ? "text-white" : "text-zinc-300"
                          )}>
                            {task.title}
                          </div>
                          <div className="text-[11px] font-black text-muted-foreground/40 tabular-nums bg-white/5 px-2 py-1 rounded-md">
                            {task.due_time || '--:--'}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className={cn(
                            "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm",
                            isP0 ? "bg-red-500/20 text-red-400" : "bg-white/5 text-muted-foreground"
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
