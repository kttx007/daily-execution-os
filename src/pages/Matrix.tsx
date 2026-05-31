import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { storage } from '@/services/storageService';
import { Task, Quadrant } from '@/types';
import { cn } from '@/lib/utils';
import { Zap, Target, MessageSquare, Coffee, Plus } from 'lucide-react';
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
    <div className="h-full space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">四象限执行矩阵</h1>
          <p className="text-muted-foreground mt-1">
            平衡长期复利 (Q2) 与短期压力 (Q1) 的决策中心
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-180px)]">
        {matrixConfig.map((config) => (
          <Card key={config.id} className={cn(
            "flex flex-col border-2 overflow-hidden transition-all",
            config.borderColor,
            config.bgColor
          )}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-xl text-white", config.color)}>
                  <config.icon size={20} />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">{config.title}</CardTitle>
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                    {config.subtitle}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => handleAddTask(config.id)}
                className="p-1.5 hover:bg-background/50 rounded-lg transition-colors"
              >
                <Plus size={18} />
              </button>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 pt-0">
              <div className="space-y-2">
                {tasks.filter(t => t.quadrant === config.id).length > 0 ? (
                  tasks.filter(t => t.quadrant === config.id).map(task => (
                    <div 
                      key={task.id}
                      className="bg-background/60 backdrop-blur-sm p-3 rounded-xl border border-primary/5 shadow-sm flex items-center justify-between group cursor-pointer hover:border-primary/20 transition-all"
                    >
                      <div className="flex-1 min-w-0 mr-4">
                        <div className="text-sm font-semibold truncate">{task.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-bold uppercase opacity-50">{task.category}</span>
                          <span className={cn("text-[9px] font-bold", config.textColor)}>{task.priority}</span>
                        </div>
                      </div>
                      <div className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {task.plan_date.split('-').slice(1).join('/')}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-20 flex items-center justify-center text-xs text-muted-foreground/40 italic border border-dashed rounded-xl">
                    暂无任务
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
