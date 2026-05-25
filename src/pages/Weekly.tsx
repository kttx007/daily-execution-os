import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { localProvider } from '@/services/localStorage';
import { WeeklyTask } from '@/types';
import { Target, CheckCircle2, Circle, Plus, Calendar, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

const Weekly: React.FC = () => {
  const [goals, setGoals] = useState<WeeklyTask[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState('');

  const loadGoals = async () => {
    const allGoals = await localProvider.getWeeklyTasks();
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

    await localProvider.saveWeeklyTask(goal);
    setNewGoal('');
    setIsAdding(false);
    loadGoals();
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">本周核心目标</h1>
          <p className="text-muted-foreground mt-1">聚焦产生结果。每周不超过 3 个核心目标。</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-primary text-primary-foreground p-3 rounded-2xl shadow-lg hover:scale-105 transition-all"
        >
          <Plus size={24} />
        </button>
      </header>

      <div className="grid gap-6">
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold text-xs tracking-widest uppercase">
            <Target size={14} />
            Focus for Week 21
          </div>
          
          {isAdding && (
            <Card className="border-primary border-2 shadow-xl ring-4 ring-primary/5">
              <CardContent className="p-4 flex gap-3">
                <input 
                  autoFocus
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="设定一个本周必须拿下的结果..."
                  className="flex-1 bg-transparent border-none focus:ring-0 font-semibold"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
                />
                <div className="flex gap-2">
                  <button onClick={() => setIsAdding(false)} className="text-xs font-bold px-3 py-1 hover:bg-muted rounded-lg">取消</button>
                  <button onClick={handleAddGoal} className="text-xs font-bold px-4 py-1 bg-primary text-primary-foreground rounded-lg">保存</button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-3">
            {goals.length > 0 ? goals.map((goal, index) => (
              <Card key={goal.id} className="group hover:border-primary/50 transition-all">
                <CardContent className="p-6 flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl">
                    0{index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{goal.title}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded-full text-muted-foreground uppercase">
                        {goal.status}
                      </span>
                      <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
                        <Calendar size={10} /> Created May 25
                      </span>
                    </div>
                  </div>
                  <button className="text-muted-foreground hover:text-green-500 transition-colors">
                    <Circle size={24} />
                  </button>
                </CardContent>
              </Card>
            )) : !isAdding && (
              <div className="text-center py-20 border-2 border-dashed rounded-3xl text-muted-foreground italic bg-muted/10">
                尚未设定本周目标
              </div>
            )}
          </div>
        </section>

        <Card className="bg-primary/5 border-none shadow-none p-6">
          <div className="flex items-center gap-3 text-primary font-bold mb-4">
            <Flag size={20} />
            <span>执行准则</span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "周一至周五，每天必须推进核心目标",
              "任何非目标相关的干扰，默认拒绝或丢入收集箱",
              "目标必须可衡量，能够定义“做到了什么”",
              "周五 17:00 前完成周复盘"
            ].map((rule, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                <span className="text-primary font-black">•</span>
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
