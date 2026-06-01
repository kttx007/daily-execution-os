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
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-4 glass-card animate-pulse">
          Execution Reflection v2.1
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-slate-100">今日执行复盘</h1>
        <div className="flex justify-center gap-3 mt-8">
          {[1, 2].map(s => (
            <div 
              key={s} 
              className={cn(
                "w-20 h-2 rounded-full transition-all duration-700",
                step >= s ? "bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.5)]" : "bg-slate-800"
              )} 
            />
          ))}
        </div>
      </header>

      {step === 1 && (
        <div className="space-y-10 animate-in fade-in duration-700">
          <Card className="glass-card bg-slate-900/40 border-slate-800/50">
            <CardHeader className="p-10 border-b border-slate-800/50">
              <CardTitle className="text-xl font-bold flex items-center gap-3 tracking-tight text-slate-100">
                <CheckCircle2 size={24} className="text-emerald-500" />
                回顾今日成果
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-4">
              {completedTasks.length > 0 ? completedTasks.map(task => (
                <div key={task.id} className="p-6 bg-slate-800/20 rounded-2xl border border-slate-800/50 text-base font-medium text-slate-300 flex items-center gap-5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  {task.title}
                </div>
              )) : (
                <div className="h-40 flex items-center justify-center border-2 border-dashed border-slate-800/50 rounded-[2.5rem] bg-slate-900/20 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                  Zero completion today
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card bg-slate-900/40 border-slate-800/50">
            <CardHeader className="p-10 border-b border-slate-800/50">
              <CardTitle className="text-xl font-bold flex items-center gap-3 tracking-tight text-slate-100">
                <MessageSquare size={24} className="text-blue-500" />
                核心总结
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10">
              <textarea 
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="一句话总结今天的执行状态..."
                className="w-full min-h-[180px] bg-slate-900/50 border border-slate-800/50 rounded-[2rem] p-8 text-lg font-medium focus:ring-2 ring-blue-500/20 transition-all resize-none text-slate-100 placeholder:text-slate-700"
              />
            </CardContent>
          </Card>

          <button 
            onClick={() => setStep(2)}
            className="w-full py-6 bg-blue-600 text-white rounded-[1.5rem] font-bold uppercase tracking-widest text-sm shadow-[0_20px_40px_rgba(37,99,235,0.2)] flex items-center justify-center gap-4 hover:scale-[1.02] hover:bg-blue-500 active:scale-95 transition-all"
          >
            Next: Deep Analysis
            <ArrowRight size={20} />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-10 animate-in fade-in duration-700">
          <Card className="glass-card bg-slate-900/40 border-slate-800/50">
            <CardHeader className="p-10 border-b border-slate-800/50">
              <CardTitle className="text-xl font-bold flex items-center gap-3 tracking-tight text-slate-100">
                <Star size={24} className="text-yellow-500" />
                执行自评
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
              <div className="flex justify-between gap-5">
                {[1, 2, 3, 4, 5].map(v => (
                  <button 
                    key={v}
                    onClick={() => setScore(v)}
                    className={cn(
                      "flex-1 py-10 rounded-[2rem] border-2 transition-all font-bold text-4xl tabular-nums",
                      score === v 
                        ? "border-blue-500 bg-blue-600 text-white scale-110 shadow-[0_15px_30px_rgba(59,130,246,0.3)]" 
                        : "border-slate-800 bg-slate-900/50 text-slate-600 hover:bg-slate-800 hover:text-slate-400"
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 px-4">
                <span>Stagnation</span>
                <span>Peak Performance</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card bg-slate-900/40 border-slate-800/50">
            <CardHeader className="p-10 border-b border-slate-800/50">
              <CardTitle className="text-xl font-bold flex items-center gap-3 tracking-tight text-slate-100">
                <LayoutGrid size={24} className="text-orange-500" />
                今日习得 / 反思
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10">
              <textarea 
                value={topLearnings}
                onChange={(e) => setTopLearnings(e.target.value)}
                placeholder="今天发现了什么新规律？或者有什么可以优化的地方？"
                className="w-full min-h-[250px] bg-slate-900/50 border border-slate-800/50 rounded-[2rem] p-8 text-lg font-medium focus:ring-2 ring-blue-500/20 transition-all resize-none text-slate-100 placeholder:text-slate-700"
              />
            </CardContent>
          </Card>

          <div className="flex gap-8">
            <button 
              onClick={() => setStep(1)}
              className="flex-1 py-6 border border-slate-800 rounded-[1.5rem] font-bold uppercase tracking-widest text-xs text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-all"
            >
              Back
            </button>
            <button 
              onClick={handleFinishReview}
              className="flex-[2] py-6 bg-blue-600 text-white rounded-[1.5rem] font-bold uppercase tracking-widest text-xs shadow-[0_20px_40px_rgba(37,99,235,0.2)] flex items-center justify-center gap-4 hover:scale-[1.02] hover:bg-blue-500 active:scale-95 transition-all"
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
