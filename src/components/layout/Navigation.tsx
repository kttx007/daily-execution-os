import React from 'react';
import { LayoutDashboard, Inbox, Calendar, Grid3X3, ListChecks, Repeat, FileText, BarChart3, Settings, Target, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: any;
  label: string;
  active: boolean;
  href: string;
}

const NavItem = ({ icon: Icon, label, active, href }: NavItemProps) => (
  <a
    href={href}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all",
      active 
        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    )}
  >
    <Icon size={18} />
    {label}
  </a>
);

export const Sidebar = ({ currentPath }: { currentPath: string }) => {
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
        <span className="text-xl font-bold tracking-tight text-primary">Daily OS</span>
      </div>
      <div className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            active={currentPath === item.href}
            href={item.href}
          />
        ))}
      </div>
    </div>
  );
};

export const MobileNav = ({ currentPath }: { currentPath: string }) => {
  const mobileItems = [
    { href: '#/', label: '首页', icon: LayoutDashboard },
    { href: '#/today', label: '今日', icon: Calendar },
    { href: '#/inbox', label: '收集箱', icon: Inbox },
    { href: '#/review', label: '复盘', icon: BarChart3 },
    { href: '#/matrix', label: '矩阵', icon: Grid3X3 },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t bg-card flex items-center justify-around px-2 z-50">
      {mobileItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={cn(
            "flex flex-col items-center justify-center space-y-1 flex-1",
            currentPath === item.href ? "text-primary" : "text-muted-foreground"
          )}
        >
          <item.icon size={20} />
          <span className="text-[10px] font-bold">{item.label}</span>
        </a>
      ))}
    </div>
  );
};
