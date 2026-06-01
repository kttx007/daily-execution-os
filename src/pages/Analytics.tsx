import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ReportService, WeeklyReport } from '@/services/reportService';
import { BarChart3, TrendingUp, AlertCircle, CheckCircle2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const Analytics: React.FC = () => {
  const [report, setReport] = useState<WeeklyReport | null>(null);

  useEffect(() => {
    ReportService.generateWeeklyReport().then(setReport);
  }, []);

  if (!report) return <div>Loading reports...</div>;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-24 max-w-7xl mx-auto">
      <header className="flex justify-between items-center bg-white/5 p-8 rounded-[2rem] border border-white/10 glass-card">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-black tracking-[0.2em]">
            <BarChart3 size={16} />
            <span className="text-[10px] uppercase">Intelligence Engine v2.0</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white">执行复利分析</h1>
          <p className="text-muted-foreground text-sm font-medium">数据揭示规律，规律产生壁垒。</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-48 -mt-48 transition-all duration-1000 group-hover:bg-primary/10" />
          <CardHeader className="p-8 border-b border-white/5 relative z-10">
            <CardTitle className="text-xl font-black flex items-center gap-3 tracking-tight">
              <TrendingUp size={24} className="text-emerald-500" />
              本周执行概览
              <span className="text-[10px] font-bold text-muted-foreground/40 uppercase ml-auto tracking-widest tabular-nums">
                {report.weekStart} — {report.weekEnd}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 py-6">
              <div className="space-y-2">
                <div className="text-6xl font-black text-white tracking-tighter tabular-nums">{report.totalCompleted}</div>
                <div className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">已完成任务</div>
              </div>
              <div className="space-y-2 border-l border-white/5 pl-12">
                <div className="text-6xl font-black text-primary tracking-tighter tabular-nums">{report.completionRate}%</div>
                <div className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">执行完成率</div>
              </div>
              <div className="space-y-2 border-l border-white/5 pl-12">
                <div className="text-6xl font-black text-orange-500 tracking-tighter tabular-nums">{report.stuckInsights.length}</div>
                <div className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">停滞事项</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="p-8 border-b border-white/5">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">分类权重分布</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {Object.entries(report.categoryDistribution).map(([cat, count]) => {
              const percentage = Math.round((count / report.totalCompleted) * 100);
              return (
                <div key={cat} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-black uppercase tracking-widest text-white">{cat}</span>
                    <span className="text-[10px] font-bold tabular-nums text-muted-foreground">{percentage}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden p-0.5 border border-white/5">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${percentage}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-card border-emerald-500/20">
          <CardHeader className="p-8 border-b border-white/5 bg-emerald-500/5">
            <CardTitle className="text-xl font-black flex items-center gap-3 tracking-tight">
              <CheckCircle2 size={24} className="text-emerald-500" />
              核心产出记录
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            {report.topOutputs.length > 0 ? report.topOutputs.map(log => (
              <div key={log.id} className="flex items-center gap-4 p-5 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.05] transition-all group cursor-pointer">
                <div className="w-2 h-2 bg-emerald-500 rounded-full group-hover:scale-150 transition-all shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">{log.title}</span>
              </div>
            )) : (
              <div className="h-48 flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-white/5 bg-white/[0.01]">
                <div className="text-muted-foreground/30 font-black uppercase tracking-widest">No assets logged</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card border-destructive/20">
          <CardHeader className="p-8 border-b border-white/5 bg-destructive/5">
            <CardTitle className="text-xl font-black flex items-center gap-3 tracking-tight">
              <AlertCircle size={24} className="text-destructive" />
              执行卡点诊断
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            {report.stuckInsights.length > 0 ? report.stuckInsights.map((insight, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-destructive/5 rounded-2xl border border-destructive/10 group">
                <div className="mt-1 flex-shrink-0">
                  <AlertCircle size={16} className="text-destructive" />
                </div>
                <p className="text-sm font-bold text-destructive/80 leading-relaxed italic">
                  "{insight}"
                </p>
              </div>
            )) : (
              <div className="h-48 flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-white/5 bg-white/[0.01]">
                <div className="text-muted-foreground/30 font-black uppercase tracking-widest">Smooth execution</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
