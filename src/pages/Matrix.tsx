import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { storage } from '@/services/storageService';
import { Task, Quadrant } from '@/types';
import { cn } from '@/lib/utils';
import { Zap, Target, MessageSquare, Coffee, Plus, Grid3X3 } from 'lucide-react';
import TaskModal from '@/components/tasks/TaskModal';
import { TaskService } from '@/services/taskService';

const Matrix: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuadrant, setSelectedQuadrant] = useState<Quadrant | null>(null);

  const loadTasks = async () => {
    const allTasks = await storage.getTasks();
    setTasks(allTasks.filter(t => t.status !== '已完成'));
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const matrixConfig = [
    {
      id: 'Q1' as Quadrant,
      title: '重要且紧急',
      subtitle: '马上处理 (Do First)',
      icon: Zap,
      color: 'bg-red-500',
      textColor: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      borderColor: 'border-red-200 dark:border-red-900/30'
    },
    {
      id: 'Q2' as Quadrant,
      title: '重要不紧急',
      subtitle: '计划安排 (Schedule)',
      icon: Target,
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-900/30'
    },
    {
      id: 'Q3' as Quadrant,
      title: '紧急不重要',
      subtitle: '授权他人 (Delegate)',
      icon: MessageSquare,
      color: 'bg-orange-500',
      textColor: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      borderColor: 'border-orange-200 dark:border-orange-900/30'
    },
    {
      id: 'Q4' as Quadrant,
      title: '不重要不紧急',
      subtitle: '尽量不做 (Eliminate)',
      icon: Coffee,
      color: 'bg-gray-500',
      textColor: 'text-gray-500',
      bgColor: 'bg-gray-50 dark:bg-gray-950/20',
      borderColor: 'border-gray-200 dark:border-gray-900/30'
    }
  ];

  const handleAddTask = (q: Quadrant) => {
    setSelectedQuadrant(q);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    await TaskService.createTask(
      taskData.title!,
      taskData.priority!,
      taskData.quadrant || selectedQuadrant || 'Q2',
      taskData.category!
    );
    setIsModalOpen(false);
    loadTasks();
  };

  return (
    <div className="h-full space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-24 max-w-7xl mx-auto">
      <header className="flex justify-between items-center bg-white/5 p-8 rounded-[2rem] border border-white/10 glass-card">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-black tracking-[0.2em]">
            <Grid3X3 size={16} />
            <span className="text-[10px] uppercase">Decision Matrix v2.0</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white">执行权重矩阵</h1>
          <p className="text-muted-foreground text-sm font-medium">
            平衡长期复利 <span className="text-primary font-bold">(Q2)</span> 与短期压力 <span className="text-red-500 font-bold">(Q1)</span> 的核心中枢。
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-auto lg:h-[calc(100vh-280px)]">
        {matrixConfig.map((config) => (
          <Card key={config.id} className={cn(
            "flex flex-col border-2 overflow-hidden transition-all duration-500 hover:scale-[1.01] glass-card",
            config.id === 'Q1' ? "border-red-500/20 bg-red-500/5 shadow-[0_0_50px_rgba(239,68,68,0.05)]" : 
            config.id === 'Q2' ? "border-primary/20 bg-primary/5 shadow-[0_0_50px_rgba(255,255,255,0.05)]" :
            "border-white/5 bg-white/[0.02]"
          )}>
            <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg", config.color)}>
                  <config.icon size={28} />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black tracking-tighter text-white">{config.title}</CardTitle>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                    {config.subtitle}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => handleAddTask(config.id)}
                className="w-10 h-10 bg-white/5 hover:bg-white text-muted-foreground hover:text-black rounded-xl transition-all flex items-center justify-center"
              >
                <Plus size={20} />
              </button>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-4">
              <div className="grid gap-3">
                {tasks.filter(t => t.quadrant === config.id).length > 0 ? (
                  tasks.filter(t => t.quadrant === config.id).map(task => (
                    <div 
                      key={task.id}
                      className="bg-white/[0.03] backdrop-blur-md p-4 rounded-2xl border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/[0.08] hover:border-white/10 transition-all"
                    >
                      <div className="flex-1 min-w-0 mr-4 space-y-1">
                        <div className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors truncate">{task.title}</div>
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">{task.category}</span>
                          <span className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-white/5", config.textColor)}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                      <div className="text-[10px] font-black tabular-nums text-muted-foreground/30 bg-white/5 px-2 py-1 rounded-md">
                        {task.plan_date.split('-').slice(1).join('/')}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-32 flex flex-col items-center justify-center text-[10px] font-black text-muted-foreground/20 uppercase tracking-[0.3em] border-2 border-dashed border-white/5 rounded-3xl">
                    <Plus size={16} className="mb-2 opacity-20" />
                    Empty Sector
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <TaskModal 
        isOpen={isModalOpen}
        task={selectedQuadrant ? { quadrant: selectedQuadrant } as Task : null}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default Matrix;
