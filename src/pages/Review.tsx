import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { localProvider } from '@/services/localStorage';
import { Task, OutputLog, DailyReview } from '@/types';
import { CheckCircle2, ChevronRight, MessageSquare, Star, ArrowRight, Save, LayoutGrid } from 'lucide-react';
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
    localProvider.getTasks().then(tasks => {
      setCompletedTasks(tasks.filter(t => t.plan_date === today && t.status === '已完成'));
    });
    localProvider.getOutputLogs().then(logs => {
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

    await localProvider.saveDailyReview(review);
    alert('今日复盘已存档，辛苦了！');
    window.location.hash = '#/';
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8 animate-in slide-in-from-right-4 duration-500">
      <header className="text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          Daily Reflection
        </div>
        <h1 className="text-3xl font-bold tracking-tight">今日执行复盘</h1>
        <div className="flex justify-center gap-4 mt-8">
          {[1, 2, 3].map(s => (
            <div 
              key={s} 
              className={cn(
                "w-12 h-1.5 rounded-full transition-all duration-500",
                step >= s ? "bg-primary" : "bg-muted"
              )} 
            />
          ))}
        </div>
      </header>

      {step === 1 && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <section className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <CheckCircle2 size={20} className="text-green-500" />
              回顾今日成果
            </h2>
            <div className="grid gap-2">
              {completedTasks.length > 0 ? completedTasks.map(task => (
                <div key={task.id} className="p-4 bg-muted/30 rounded-2xl border text-sm font-medium">
                  {task.title}
                </div>
              )) : (
                <div className="p-8 text-center border-2 border-dashed rounded-3xl text-muted-foreground italic">
                  今日无已完成任务
                </div>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <MessageSquare size={20} className="text-primary" />
              核心总结
            </h2>
            <textarea 
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="一句话总结今天的执行状态..."
              className="w-full min-h-[120px] bg-muted/50 border-none rounded-2xl p-4 text-sm focus:ring-2 ring-primary transition-all resize-none"
            />
          </section>

          <button 
            onClick={() => setStep(2)}
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all"
          >
            下一步：深度思考
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <section className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Star size={20} className="text-yellow-500" />
              执行自评
            </h2>
            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4, 5].map(v => (
                <button 
                  key={v}
                  onClick={() => setScore(v)}
                  className={cn(
                    "flex-1 py-6 rounded-2xl border-2 transition-all font-black text-xl",
                    score === v ? "border-primary bg-primary/5 text-primary scale-105" : "border-transparent bg-muted/50 text-muted-foreground"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground italic">1: 极度拖延 / 5: 完美执行</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <LayoutGrid size={20} className="text-orange-500" />
              今日习得 / 反思
            </h2>
            <textarea 
              value={topLearnings}
              onChange={(e) => setTopLearnings(e.target.value)}
              placeholder="今天发现了什么新规律？或者有什么可以优化的地方？"
              className="w-full min-h-[150px] bg-muted/50 border-none rounded-2xl p-4 text-sm focus:ring-2 ring-primary transition-all resize-none"
            />
          </section>

          <div className="flex gap-3">
            <button 
              onClick={() => setStep(1)}
              className="flex-1 py-4 border rounded-2xl font-bold hover:bg-accent transition-all"
            >
              返回
            </button>
            <button 
              onClick={handleFinishReview}
              className="flex-[2] py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            >
              完成复盘并存档
              <Save size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;
