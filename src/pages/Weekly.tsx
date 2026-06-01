import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { storage } from '@/services/storageService';
import { WeeklyTask } from '@/types';
import { Target, CheckCircle2, Circle, Plus, Calendar, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

const Weekly: React.FC = () => {
  const [goals, setGoals] = useState<WeeklyTask[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState('');

  const loadGoals = async () => {
    const allGoals = await storage.getWeeklyTasks();
    // 只显示本周目标 (简单处理：显示未完成或最近创建的)
    setGoals(allGoals);
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleAddGoal = async () => {
    if (!newGoal.trim()) return;
    
    const goal: WeeklyTask = {
      id: crypto.randomUUID(),
      user_id: 'default_user',
      title: newGoal,
      status: '进行中',
      week_number: 21, // 示例
      year: 2026,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await storage.saveWeeklyTask(goal);
    setNewGoal('');
    setIsAdding(false);
    loadGoals();
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-24 max-w-5xl mx-auto">
      <header className="flex justify-between items-center bg-white/5 p-8 rounded-[2rem] border border-white/10 glass-card">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-black tracking-[0.2em]">
            <Target size={16} />
            <span className="text-[10px] uppercase">Strategic Intent v2.0</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white">本周核心目标</h1>
          <p className="text-muted-foreground text-sm font-medium">聚焦产生结果。每周不超过 3 个核心目标。</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-white text-black w-14 h-14 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-110 hover:rotate-90 transition-all duration-500 flex items-center justify-center group"
        >
          <Plus size={28} className="group-hover:stroke-[3px]" />
        </button>
      </header>

      <div className="grid gap-10">
        <section className="space-y-6">
          <div className="flex items-center gap-4 px-2">
            <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-primary">Focus Objectives</h2>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>
          
          {isAdding && (
            <Card className="glass-card border-white/20 animate-in zoom-in-95">
              <CardContent className="p-8 flex flex-col sm:flex-row gap-6">
                <input 
                  autoFocus
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="设定一个本周必须拿下的结果..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-2xl font-black placeholder:text-muted-foreground/20 text-white tracking-tight"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
                />
                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsAdding(false)} 
                    className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddGoal} 
                    className="px-8 py-3 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest shadow-xl hover:opacity-90 transition-all"
                  >
                    Commit
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {goals.length > 0 ? goals.map((goal, index) => (
              <Card key={goal.id} className="glass-card hover:bg-white/5 transition-all group border-l-[6px] border-l-primary/30">
                <CardContent className="p-8 flex items-center gap-8">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-white border border-white/5 font-black text-2xl tabular-nums shadow-inner group-hover:scale-110 transition-transform">
                    0{index + 1}
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-black text-zinc-100 group-hover:text-white transition-colors tracking-tight">{goal.title}</h3>
                    <div className="flex items-center gap-5">
                      <span className="text-[10px] font-black bg-white/5 px-2.5 py-1 rounded-md text-muted-foreground/60 uppercase tracking-widest border border-white/5">
                        {goal.status}
                      </span>
                      <span className="text-[10px] font-black text-muted-foreground/30 flex items-center gap-1.5 uppercase tracking-widest tabular-nums">
                        <Calendar size={12} /> Week 21, 2026
                      </span>
                    </div>
                  </div>
                  <button className="w-12 h-12 flex items-center justify-center text-muted-foreground/20 hover:text-emerald-500 transition-all">
                    <Circle size={28} className="group-hover:scale-110 transition-all" />
                  </button>
                </CardContent>
              </Card>
            )) : !isAdding && (
              <div className="h-64 flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-white/5 bg-white/[0.01]">
                <div className="text-muted-foreground/30 font-black uppercase tracking-[0.3em]">No objectives set</div>
                <p className="text-[10px] text-muted-foreground/20 mt-4 uppercase tracking-widest">Identify your 3 core targets for the week</p>
              </div>
            )}
          </div>
        </section>

        <Card className="glass-card bg-emerald-500/5 border-emerald-500/10 p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
            <Flag size={200} />
          </div>
          <div className="flex items-center gap-3 text-emerald-500 font-black uppercase tracking-[0.3em] text-[10px] mb-8 relative z-10">
            <Flag size={14} />
            Execution Principles
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
            {[
              "周一至周五，每天必须推进核心目标",
              "任何非目标相关的干扰，默认拒绝或丢入收集箱",
              "目标必须可衡量，能够定义“做到了什么”",
              "周五 17:00 前完成周复盘"
            ].map((rule, i) => (
              <li key={i} className="flex gap-5 text-sm font-bold text-zinc-400 leading-relaxed">
                <span className="text-emerald-500 text-lg">0{i+1}</span>
                {rule}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Weekly;
