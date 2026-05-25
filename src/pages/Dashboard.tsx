import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowUpRight, CheckCircle2, Clock, AlertCircle, Plus, LayoutGrid } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { label: '今日必办', value: '5', icon: Clock, color: 'text-primary' },
    { label: '已完成', value: '12', icon: CheckCircle2, color: 'text-green-500' },
    { label: '卡住/延期', value: '2', icon: AlertCircle, color: 'text-destructive' },
    { label: 'SOP 候选', value: '3', icon: LayoutGrid, color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">执行驾驶舱</h1>
          <p className="text-muted-foreground mt-1">下午好，安平。今天是你实现复利的第 128 天。</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-all shadow-sm">
            <Plus size={18} />
            新任务
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={stat.color} size={16} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">今日 Top 3 核心任务</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 border rounded-xl hover:bg-accent/50 transition-colors group">
                <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:border-primary">
                  {i}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">示例核心任务 {i}：处理光衍业务增长逻辑</div>
                  <div className="text-xs text-muted-foreground">所属项目：开腾业务增长 • P0 • Q1</div>
                </div>
                <ArrowUpRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">复盘提醒</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30">
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-semibold mb-2">
                <Clock size={18} />
                <span>17:00 准时复盘</span>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                别忘了总结今日产出，沉淀 SOP，为明天腾出带宽。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
