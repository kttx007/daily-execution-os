import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowUpRight, CheckCircle2, Clock, AlertCircle, Plus, LayoutGrid, Zap, Target } from 'lucide-react';
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
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-slate-900/40 p-12 rounded-[3rem] border border-slate-800/50 glass-card relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -mr-64 -mt-64 animate-pulse" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
              <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">Executive Overview</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-semibold text-emerald-500/80 uppercase tracking-wider">System Live</span>
            </div>
          </div>
          <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-slate-500 bg-clip-text text-transparent">下午好，安平。</h1>
          <p className="text-slate-400 text-lg font-medium max-w-md leading-relaxed">
            今日已攻克 <span className="text-blue-400 font-bold">{completedToday.length}</span> 项任务。保持节奏，专注 P0 核心产出。
          </p>
        </div>

        <div className="relative z-10 flex gap-4 w-full md:w-auto">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-[1.5rem] font-bold text-sm hover:scale-105 hover:bg-blue-500 transition-all shadow-[0_20px_40px_rgba(37,99,235,0.2)] group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            <span>开启新任务</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="glass-card bg-slate-900/20 hover:bg-slate-800/40 border-slate-800/50 hover:border-blue-500/30 transition-all duration-500 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-8 pb-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{stat.label}</span>
              <div className={cn("p-2.5 rounded-xl bg-slate-800/50", stat.color)}>
                <stat.icon size={18} />
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="text-5xl font-bold tracking-tighter tabular-nums text-slate-100">{stat.value}</div>
              <div className="mt-4 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className={cn("h-full bg-blue-500 transition-all duration-1000", stat.value === '0' ? 'opacity-0' : 'opacity-100')} style={{ width: stat.value === '0' ? '0%' : '100%' }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-2 glass-card bg-slate-900/10 border-slate-800/50">
          <CardHeader className="p-10 border-b border-slate-800/50">
            <CardTitle className="text-xl font-bold flex items-center gap-3 tracking-tight text-slate-100">
              <Zap size={22} className="text-yellow-500 fill-yellow-500/10" />
              关键待办清单
              <span className="text-[10px] font-bold text-slate-600 uppercase ml-auto tracking-[0.3em]">Priority Execution</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10 space-y-6">
            {topTasks.length > 0 ? topTasks.map((task, i) => (
              <div 
                key={task.id} 
                className="flex items-center gap-8 p-8 rounded-[2rem] bg-slate-800/20 border border-slate-800/40 hover:bg-slate-800/40 hover:border-blue-500/20 transition-all group cursor-pointer"
                onClick={() => handleToggleComplete(task.id)}
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-900/50 flex items-center justify-center text-2xl font-bold text-slate-700 group-hover:text-blue-400 transition-all tabular-nums border border-slate-800">
                  0{i + 1}
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="text-xl font-bold text-slate-200 group-hover:text-white transition-colors truncate tracking-tight">{task.title}</div>
                  <div className="flex items-center gap-5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{task.category}</span>
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                      <span className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter">{task.priority}</span>
                    </div>
                  </div>
                </div>
                <ArrowUpRight size={24} className="text-slate-700 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
            )) : (
              <div className="h-80 flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-slate-800/50 bg-slate-900/10">
                <div className="text-slate-600 font-bold uppercase tracking-[0.3em] text-sm">Mission Completed</div>
                <p className="text-[10px] text-slate-700 mt-4 uppercase tracking-[0.2em]">Rest and refocus for the next wave</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-10">
          <Card className="glass-card bg-blue-600/[0.03] border-blue-500/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-1000">
              <Target size={200} />
            </div>
            <CardHeader className="p-10">
              <CardTitle className="text-[10px] font-bold text-blue-400 flex items-center justify-between uppercase tracking-[0.3em]">
                Q2 Concentration
                <span className="text-3xl tracking-tighter font-bold">{q2Ratio}%</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 pt-0 space-y-8">
              <div className="w-full bg-slate-900 rounded-full h-4 overflow-hidden p-1 border border-slate-800 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(59,130,246,0.3)]" 
                  style={{ width: `${q2Ratio}%` }}
                />
              </div>
              <p className="text-[13px] text-slate-400 font-medium leading-relaxed">
                Q2 占比代表您的<span className="text-slate-100">长期价值建设</span>。理想状态应保持在 <span className="text-blue-400 font-bold">40%+</span> 以对抗琐碎事务。
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-orange-500/10 bg-orange-500/[0.02]">
            <CardHeader className="p-10 pb-5">
              <CardTitle className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-400 flex items-center gap-3">
                <Clock size={16} />
                Daily Ritual
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 pt-0 space-y-6">
              <div className="text-3xl font-bold tracking-tight text-slate-100">17:00 准时复盘</div>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                沉淀 SOP，建立复利壁垒。识别今日可自动化的流程，释放未来生产力。
              </p>
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
