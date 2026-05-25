import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowUpRight, CheckCircle2, Clock, AlertCircle, Plus, LayoutGrid, Zap } from 'lucide-react';
import { localProvider } from '@/services/localStorage';
import { Task, OutputLog } from '@/types';
import { cn } from '@/lib/utils';
import TaskModal from '@/components/tasks/TaskModal';
import { TaskService } from '@/services/taskService';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<OutputLog[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    const [allTasks, allLogs] = await Promise.all([
      localProvider.getTasks(),
      localProvider.getOutputLogs()
    ]);
    setTasks(allTasks);
    setLogs(allLogs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.plan_date === today);
  const completedToday = todayTasks.filter(t => t.status === '已完成');
  const stuckTasks = tasks.filter(t => t.is_stuck);
  const sopCandidates = logs.filter(l => l.sop_candidate);

  const stats = [
    { label: '今日必办', value: todayTasks.length.toString(), icon: Clock, color: 'text-primary' },
    { label: '今日已成', value: completedToday.length.toString(), icon: CheckCircle2, color: 'text-green-500' },
    { label: '停滞/卡住', value: stuckTasks.length.toString(), icon: AlertCircle, color: 'text-destructive' },
    { label: 'SOP 候选', value: sopCandidates.length.toString(), icon: LayoutGrid, color: 'text-orange-500' },
  ];

  // 计算 Q2 占比 (重要不紧急)
  const q2Tasks = tasks.filter(t => t.quadrant === 'Q2');
  const q2Ratio = tasks.length > 0 ? Math.round((q2Tasks.length / tasks.length) * 100) : 0;

  const topTasks = todayTasks
    .filter(t => t.status !== '已完成')
    .sort((a, b) => a.priority.localeCompare(b.priority))
    .slice(0, 3);

  const handleSaveTask = async (taskData: Partial<Task>) => {
    await TaskService.createTask(taskData.title!, taskData.priority!, taskData.quadrant!, taskData.category!);
    setIsModalOpen(false);
    loadData();
  };

  const handleToggleComplete = async (taskId: string) => {
    await TaskService.completeTask(taskId);
    loadData();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">执行驾驶舱</h1>
          <p className="text-muted-foreground mt-1">
            你好，安平。今日已完成 {completedToday.length} 项任务，执行复利持续增长中。
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
          >
            <Plus size={18} />
            新任务
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={stat.color} size={16} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-primary/5 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap size={18} className="text-yellow-500" />
              今日待办 Top 3
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topTasks.length > 0 ? topTasks.map((task, i) => (
              <div key={task.id} className="flex items-center gap-4 p-4 border rounded-2xl hover:bg-accent/30 transition-all group cursor-pointer">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleToggleComplete(task.id); }}
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold text-muted-foreground hover:border-primary hover:text-primary transition-all"
                >
                  {i + 1}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold group-hover:text-primary transition-colors truncate">{task.title}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">{task.category}</span>
                    <span className="text-[10px] font-bold text-primary">{task.priority}</span>
                    <span className="text-[10px] text-muted-foreground/60">{task.quadrant}</span>
                  </div>
                </div>
                <ArrowUpRight size={18} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            )) : (
              <div className="text-center py-10 border-2 border-dashed rounded-3xl text-muted-foreground italic">
                今日核心待办已清空
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-primary flex items-center justify-between">
                Q2 关注度 (重要不紧急)
                <span>{q2Ratio}%</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-1000" 
                  style={{ width: `${q2Ratio}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
                Q2 占比越高，代表你正在处理长期价值事项，而非被动应付紧急。
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/5 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold">复盘提醒</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold mb-2">
                  <Clock size={16} />
                  <span>17:00 准时复盘</span>
                </div>
                <p className="text-xs text-orange-700/80 dark:text-orange-300/80 leading-relaxed">
                  沉淀 SOP，建立复利壁垒。今日是否有可自动化的流程？
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default Dashboard;
