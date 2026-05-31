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
    if (editingTask) {
      await storage.updateTask(editingTask.id, taskData);
    } else {
      await TaskService.createTask(taskData.title!, taskData.priority!, taskData.quadrant!, taskData.category!);
    }
    setIsModalOpen(false);
    loadTasks();
  };

  const handleToggleComplete = async (taskId: string) => {
    await TaskService.completeTask(taskId);
    loadTasks();
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 pb-20">
      <header className="flex justify-between items-center sm:items-end">
        <div>
          <div className="flex items-center gap-2 text-primary font-semibold mb-1">
            <Clock size={16} />
            <span className="text-xs">TODAY EXECUTION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">今日执行列表</h1>
        </div>
        <button 
          onClick={handleCreateTask}
          className="bg-primary text-primary-foreground p-3 rounded-2xl shadow-lg hover:scale-105 transition-transform"
        >
          <Plus size={24} />
        </button>
      </header>

      <div className="space-y-4">
        {['P0', 'P1', 'P2', 'P3'].map(priority => {
          const priorityTasks = tasks.filter(t => t.priority === priority);
          if (priorityTasks.length === 0 && priority !== 'P0') return null;

          return (
            <section key={priority} className="space-y-3">
              <h2 className={cn(
                "text-xs font-bold tracking-widest uppercase px-1",
                priority === 'P0' ? "text-destructive" : "text-muted-foreground"
              )}>
                {priority === 'P0' ? '🔥 绝对核心 (P0)' : `优先级 ${priority}`}
              </h2>
              <div className="grid gap-2">
                {priorityTasks.length > 0 ? priorityTasks.map(task => (
                  <Card key={task.id} className={cn(
                    "border-l-4 transition-all hover:shadow-md cursor-pointer group",
                    task.priority === 'P0' ? "border-l-destructive" : "border-l-primary"
                  )}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleToggleComplete(task.id); }}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Circle size={22} />
                      </button>
                      <div 
                        onClick={() => handleEditTask(task)}
                        className="flex-1 min-w-0"
                      >
                        <div className="font-semibold truncate group-hover:text-primary transition-colors">{task.title}</div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter">
                            {task.category}
                          </span>
                          {task.delay_count > 0 && (
                            <span className="text-[10px] text-orange-500 font-bold flex items-center gap-0.5">
                              <AlertCircle size={10} /> 顺延 {task.delay_count} 次
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-xs font-medium">{task.due_time || '--:--'}</span>
                        <ChevronRight size={18} />
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="text-sm text-muted-foreground italic p-4 bg-muted/20 rounded-2xl border border-dashed">
                    该等级下暂无任务
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
