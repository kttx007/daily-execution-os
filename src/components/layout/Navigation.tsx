import React from 'react';
import { LayoutDashboard, Inbox, Calendar, Grid3X3, ListChecks, Repeat, FileText, BarChart3, Settings, Target, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Sidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: '执行驾驶舱', href: '#/' },
    { icon: Inbox, label: '收集箱', href: '#/inbox' },
    { icon: Calendar, label: '今日执行', href: '#/today' },
    { icon: Grid3X3, label: '四象限矩阵', href: '#/matrix' },
    { icon: Target, label: '本周目标', href: '#/weekly' },
    { icon: ClipboardCheck, label: '今日复盘', href: '#/review' },
    { icon: ListChecks, label: '任务清单', href: '#/tasks' },
    { icon: Repeat, label: '定期重复', href: '#/recurring' },
    { icon: FileText, label: '输出日志', href: '#/logs' },
    { icon: BarChart3, label: '执行分析', href: '#/analytics' },
  ];


  return (
    <div className="hidden md:flex flex-col h-screen w-64 border-r bg-card p-4 space-y-2">
      <div className="flex items-center space-x-2 px-3 py-6 mb-4">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-xl">D</span>
        </div>
        <span className="text-xl font-bold tracking-tight">Daily OS</span>
      </div>
      <div className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            active={currentPath === item.path}
            onClick={() => onNavigate(item.path)}
          />
        ))}
      </div>
    </div>
  );
};

export const MobileNav = ({ currentPath, onNavigate }: { currentPath: string; onNavigate: (path: string) => void }) => {
  const mobileItems = [
    { path: 'dashboard', label: '首页', icon: LayoutDashboard },
    { path: 'today', label: '今日', icon: Calendar },
    { path: 'inbox', label: '收集箱', icon: Inbox },
    { path: 'review', label: '复盘', icon: BarChart3 },
    { path: 'settings', label: '更多', icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t bg-card flex items-center justify-around px-2 z-50">
      {mobileItems.map((item) => (
        <button
          key={item.path}
          onClick={() => onNavigate(item.path)}
          className={cn(
            "flex flex-col items-center justify-center space-y-1",
            currentPath === item.path ? "text-primary" : "text-muted-foreground"
          )}
        >
          <item.icon size={20} />
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
};
