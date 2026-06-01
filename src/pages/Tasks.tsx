import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Plus, Search, Filter, MoreVertical, ListChecks, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { storage } from '@/services/storageService';
import { Task } from '@/types';
import TaskModal from '@/components/tasks/TaskModal';
import { cn } from '@/lib/utils';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const loadTasks = () => {
    storage.getTasks().then(setTasks);
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

  const handleToggleComplete = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    await storage.updateTask(taskId, { 
      status: task.status === '已完成' ? '未开始' : '已完成',
      completed_at: task.status === '已完成' ? undefined : new Date().toISOString()
    });
    loadTasks();
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    if (editingTask) {
      await storage.updateTask(editingTask.id, taskData);
    } else {
      // 通过 TaskService 或 storage 直接创建，这里为了简单直接 storage
      await storage.saveTask({
        id: crypto.randomUUID(),
        user_id: 'default_user',
        title: taskData.title!,
        priority: taskData.priority || 'P2',
        quadrant: taskData.quadrant || 'Q2',
        category: taskData.category || 'Work',
        status: '未开始',
        delay_count: 0,
        is_stuck: false,
        plan_date: taskData.plan_date || new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...taskData
      } as Task);
    }
    setIsModalOpen(false);
    loadTasks();
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-24 max-w-6xl mx-auto">
      <header className="flex justify-between items-center bg-white/5 p-8 rounded-[2rem] border border-white/10 glass-card">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-black tracking-[0.2em]">
            <ListChecks size={16} />
            <span className="text-[10px] uppercase">Task Repository</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white">全量任务清单</h1>
          <p className="text-muted-foreground text-sm font-medium">
            管理所有已规划的任务，点击完成或编辑详情。
          </p>
        </div>
        <button 
          onClick={handleCreateTask}
          className="bg-white text-black w-14 h-14 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-110 hover:rotate-90 transition-all duration-500 flex items-center justify-center group"
        >
          <Plus size={28} className="group-hover:stroke-[3px]" />
        </button>
      </header>

      <div className="flex gap-4 p-2 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-white transition-colors" size={18} />
          <input 
            placeholder="搜索任务标题、备注或标签..." 
            className="w-full pl-12 pr-4 py-3 bg-transparent border-none rounded-xl focus:ring-0 text-white placeholder:text-muted-foreground/40 font-medium"
          />
        </div>
        <button className="px-4 border-l border-white/5 hover:text-white transition-colors">
          <Filter size={20} className="text-muted-foreground" />
        </button>
      </div>

      <div className="grid gap-3">
        {tasks.sort((a, b) => b.created_at.localeCompare(a.created_at)).map(task => (
          <Card key={task.id} className={cn(
            "glass-card hover:bg-white/5 transition-all group border-l-[6px]",
            task.status === '已完成' ? "border-l-emerald-500/50 opacity-60" : "border-l-primary/30"
          )}>
            <CardContent className="p-0 flex items-stretch">
              <button 
                onClick={() => handleToggleComplete(task.id)}
                className="w-16 flex items-center justify-center border-r border-white/5 hover:bg-white/5 transition-all"
              >
                {task.status === '已完成' ? (
                  <CheckCircle2 size={24} className="text-emerald-500" />
                ) : (
                  <Circle size={24} className="text-muted-foreground/30 group-hover:text-primary transition-all" />
                )}
              </button>
              
              <div 
                onClick={() => handleEditTask(task)}
                className="flex-1 p-5 space-y-2 cursor-pointer"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className={cn(
                    "font-bold tracking-tight transition-all",
                    task.status === '已完成' ? "text-muted-foreground line-through" : "text-zinc-200 group-hover:text-white"
                  )}>
                    {task.title}
                  </div>
                  <div className="text-[10px] font-black text-muted-foreground/30 tabular-nums">
                    {task.plan_date}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm bg-white/5 text-muted-foreground/60">
                    {task.category}
                  </span>
                  <span className={cn(
                    "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm bg-white/5",
                    task.priority === 'P0' ? "text-red-400" : "text-primary/60"
                  )}>
                    {task.priority}
                  </span>
                  {task.delay_count > 0 && (
                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-tighter flex items-center gap-1">
                      <AlertCircle size={10} /> {task.delay_count}x
                    </span>
                  )}
                </div>
              </div>

              <button className="w-12 flex items-center justify-center text-muted-foreground/20 group-hover:text-white transition-all">
                <MoreVertical size={20} />
              </button>
            </CardContent>
          </Card>
        ))}
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

export default Tasks;
