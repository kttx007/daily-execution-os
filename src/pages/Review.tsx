import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { storage } from '@/services/storageService';
import { Task, OutputLog, DailyReview } from '@/types';
import { CheckCircle2, Star, LayoutGrid, Save, ArrowRight, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';


const Review: React.FC = () => {
  const [step, setStep] = useState(1);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<OutputLog[]>([]);
  const [summary, setSummary] = useState('');
  const [score, setScore] = useState(4);
  const [topLearnings, setTopLearnings] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    storage.getTasks().then(tasks => {
      setCompletedTasks(tasks.filter(t => t.plan_date === today && t.status === '已完成'));
    });
    storage.getOutputLogs().then(logs => {
      setLogs(logs.filter(l => l.completed_date === today));
    });
  }, []);

  const handleFinishReview = async () => {
    const review: DailyReview = {
      id: crypto.randomUUID(),
      user_id: 'default_user',
      date: new Date().toISOString().split('T')[0],
      score,
      summary,
      top_learnings: topLearnings.split('\n').filter(l => l.trim()),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await storage.saveDailyReview(review);
    alert('今日复盘已存档，辛苦了！');
    window.location.hash = '#/';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-24">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-primary px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4 glass-card animate-pulse">
          Execution Reflection v2.0
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-white">今日执行复盘</h1>
        <div className="flex justify-center gap-3 mt-8">
          {[1, 2].map(s => (
            <div 
              key={s} 
              className={cn(
                "w-20 h-1.5 rounded-full transition-all duration-700",
                step >= s ? "bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "bg-white/5"
              )} 
            />
          ))}
        </div>
      </header>

      {step === 1 && (
        <div className="space-y-10 animate-in fade-in duration-700">
          <Card className="glass-card">
            <CardHeader className="p-8 border-b border-white/5">
              <CardTitle className="text-xl font-black flex items-center gap-3 tracking-tight">
                <CheckCircle2 size={24} className="text-emerald-500" />
                回顾今日成果
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              {completedTasks.length > 0 ? completedTasks.map(task => (
                <div key={task.id} className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 text-sm font-bold text-zinc-300 flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  {task.title}
                </div>
              )) : (
                <div className="h-32 flex items-center justify-center border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.01] text-[10px] font-black uppercase tracking-widest text-muted-foreground/20">
                  Zero completion today
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="p-8 border-b border-white/5">
              <CardTitle className="text-xl font-black flex items-center gap-3 tracking-tight">
                <MessageSquare size={24} className="text-primary" />
                核心总结
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <textarea 
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="一句话总结今天的执行状态..."
                className="w-full min-h-[150px] bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 text-lg font-bold focus:ring-2 ring-white/10 transition-all resize-none text-white placeholder:text-muted-foreground/20"
              />
            </CardContent>
          </Card>

          <button 
            onClick={() => setStep(2)}
            className="w-full py-6 bg-white text-black rounded-3xl font-black uppercase tracking-widest text-sm shadow-[0_20px_40px_rgba(255,255,255,0.1)] flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Next: Deep Analysis
            <ArrowRight size={20} />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-10 animate-in fade-in duration-700">
          <Card className="glass-card">
            <CardHeader className="p-8 border-b border-white/5">
              <CardTitle className="text-xl font-black flex items-center gap-3 tracking-tight">
                <Star size={24} className="text-yellow-500" />
                执行自评
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex justify-between gap-4">
                {[1, 2, 3, 4, 5].map(v => (
                  <button 
                    key={v}
                    onClick={() => setScore(v)}
                    className={cn(
                      "flex-1 py-8 rounded-[2rem] border-2 transition-all font-black text-3xl tabular-nums shadow-lg",
                      score === v 
                        ? "border-white bg-white text-black scale-110 shadow-[0_0_30px_rgba(255,255,255,0.3)]" 
                        : "border-white/5 bg-white/[0.02] text-muted-foreground hover:bg-white/5"
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-4">
                <span>Stagnation</span>
                <span>Peak Performance</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="p-8 border-b border-white/5">
              <CardTitle className="text-xl font-black flex items-center gap-3 tracking-tight">
                <LayoutGrid size={24} className="text-orange-500" />
                今日习得 / 反思
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <textarea 
                value={topLearnings}
                onChange={(e) => setTopLearnings(e.target.value)}
                placeholder="今天发现了什么新规律？或者有什么可以优化的地方？"
                className="w-full min-h-[200px] bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 text-lg font-bold focus:ring-2 ring-white/10 transition-all resize-none text-white placeholder:text-muted-foreground/20"
              />
            </CardContent>
          </Card>

          <div className="flex gap-6">
            <button 
              onClick={() => setStep(1)}
              className="flex-1 py-6 border border-white/10 rounded-3xl font-black uppercase tracking-widest text-xs text-muted-foreground hover:text-white hover:bg-white/5 transition-all"
            >
              Back
            </button>
            <button 
              onClick={handleFinishReview}
              className="flex-[2] py-6 bg-white text-black rounded-3xl font-black uppercase tracking-widest text-xs shadow-[0_20px_40px_rgba(255,255,255,0.1)] flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Archive Reflection
              <Save size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;
