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
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">执行复利分析</h1>
        <p className="text-muted-foreground mt-1">数据揭示规律，规律产生壁垒。</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" />
              本周执行概览 ({report.weekStart} ~ {report.weekEnd})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 py-4">
              <div className="text-center">
                <div className="text-4xl font-black text-primary">{report.totalCompleted}</div>
                <div className="text-xs text-muted-foreground mt-2 font-bold uppercase tracking-widest">已完成任务</div>
              </div>
              <div className="text-center border-x">
                <div className="text-4xl font-black">{report.completionRate}%</div>
                <div className="text-xs text-muted-foreground mt-2 font-bold uppercase tracking-widest">执行完成率</div>
              </div>
              <div className="text-center col-span-2 sm:col-span-1">
                <div className="text-4xl font-black text-orange-500">{report.stuckInsights.length}</div>
                <div className="text-xs text-muted-foreground mt-2 font-bold uppercase tracking-widest">停滞事项</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">分类权重分布</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(report.categoryDistribution).map(([cat, count]) => {
              const percentage = Math.round((count / report.totalCompleted) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{cat}</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary h-full transition-all" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-green-500/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 size={20} className="text-green-500" />
              核心产出 (Asset Logs)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.topOutputs.length > 0 ? report.topOutputs.map(log => (
              <div key={log.id} className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl border border-dashed">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium">{log.title}</span>
              </div>
            )) : (
              <div className="text-sm text-muted-foreground italic py-10 text-center">本周暂无高价值产出记录</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-destructive/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle size={20} className="text-destructive" />
              执行卡点 (Stuck Analysis)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.stuckInsights.length > 0 ? report.stuckInsights.map((insight, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-destructive/5 rounded-xl border border-destructive/10 text-destructive text-sm font-medium">
                <AlertCircle size={14} />
                {insight}
              </div>
            )) : (
              <div className="text-sm text-muted-foreground italic py-10 text-center">本周执行顺畅，无严重卡点</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
