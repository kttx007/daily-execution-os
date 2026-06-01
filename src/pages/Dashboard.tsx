import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowUpRight, CheckCircle2, Clock, AlertCircle, Plus, LayoutGrid, Zap } from 'lucide-react';
import { storage } from '@/services/storageService';
import { Task, OutputLog } from '@/types';
import { cn } from '@/lib/utils';
import TaskModal from '@/components/tasks/TaskModal';
import { TaskService } from '@/services/taskService';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<OutputLog[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    await TaskService.autoRolloverTasks();
    const [allTasks, allLogs] = await Promise.all([
      storage.getTasks(),
      storage.getOutputLogs()
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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-24 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white/5 p-10 rounded-[2.5rem] border border-white/10 glass-card relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32 animate-pulse" />
        
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-white/10 rounded-full border border-white/10">
              <span className="text-[10px] font-black tracking-widest text-primary uppercase">Executive Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500/80 uppercase">System Ready</span>
            </div>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white">下午好，安平。</h1>
          <p className="text-muted-foreground text-lg font-medium max-w-md">
            今日已攻克 <span className="text-white font-bold">{completedToday.length}</span> 项任务。保持节奏，专注 P0。
          </p>
        </div>

        <div className="relative z-10 flex gap-4 w-full md:w-auto">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.15)] group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            <span>快速新建</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="glass-card hover:translate-y-[-4px] transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</span>
              <div className={cn("p-2 rounded-xl bg-white/5", stat.color)}>
                <stat.icon size={16} />
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="text-4xl font-black tracking-tighter tabular-nums">{stat.value}</div>
              <div className="mt-2 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className={cn("h-full bg-current opacity-30", stat.color)} style={{ width: '40%' }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass-card">
          <CardHeader className="p-8 border-b border-white/5">
            <CardTitle className="text-xl font-black flex items-center gap-3 tracking-tight">
              <Zap size={24} className="text-yellow-500 fill-yellow-500/20" />
              关键待办
              <span className="text-xs font-bold text-muted-foreground/40 uppercase ml-auto tracking-widest">Next Up</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            {topTasks.length > 0 ? topTasks.map((task, i) => (
              <div 
                key={task.id} 
                className="flex items-center gap-6 p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all group cursor-pointer"
                onClick={() => handleToggleComplete(task.id)}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl font-black text-muted-foreground/20 group-hover:text-primary transition-all tabular-nums">
                  0{i + 1}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="text-lg font-bold group-hover:text-white transition-colors truncate">{task.title}</div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">{task.category}</span>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/10">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                      <span className="text-[9px] font-black text-primary uppercase">{task.priority}</span>
                    </div>
                  </div>
                </div>
                <ArrowUpRight size={24} className="text-muted-foreground/20 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
            )) : (
              <div className="h-64 flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-white/5 bg-white/[0.01]">
                <div className="text-muted-foreground/30 font-black uppercase tracking-widest">Victory achieved</div>
                <p className="text-[10px] text-muted-foreground/20 mt-2">All primary targets cleared</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="glass-card bg-primary/5 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Target size={120} />
            </div>
            <CardHeader className="p-8">
              <CardTitle className="text-xs font-black text-primary flex items-center justify-between uppercase tracking-widest">
                Q2 Concentration
                <span className="text-2xl tracking-tighter">{q2Ratio}%</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden p-0.5 border border-white/5">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(255,255,255,0.3)]" 
                  style={{ width: `${q2Ratio}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                Q2 占比代表您的**长期价值建设**。理想状态应保持在 <span className="text-white font-bold">40%+</span> 以对抗琐碎事务的侵蚀。
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-orange-500/20">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center gap-2">
                <Clock size={14} />
                Daily Ritual
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="space-y-4">
                <div className="text-2xl font-black tracking-tight text-white">17:00 准时复盘</div>
                <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 text-[11px] text-orange-200/60 leading-relaxed font-medium">
                  沉淀 SOP，建立复利壁垒。识别今日可自动化的流程。
                </div>
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
