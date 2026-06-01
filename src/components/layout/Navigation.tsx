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
      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
      active 
        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10 active-glow" 
        : "text-muted-foreground hover:bg-white/5 hover:text-foreground translate-x-0 hover:translate-x-1"
    )}
  >
    <Icon size={18} className={cn(active ? "animate-pulse" : "")} />
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
    <div className="hidden md:flex flex-col h-screen w-72 border-r bg-black/20 backdrop-blur-xl p-6 space-y-4">
      <div className="flex items-center space-x-3 px-2 py-8">
        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center rotate-3 shadow-xl">
          <span className="text-black font-black text-2xl tracking-tighter">D</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tighter text-white">DAILY OS</span>
          <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase opacity-50">Execution Core</span>
        </div>
      </div>
      
      <div className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar pt-4">
        <div className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest px-4 mb-3">Workspace</div>
        {navItems.slice(0, 4).map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            active={currentPath === item.href}
            href={item.href}
          />
        ))}
        
        <div className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest px-4 mb-3 mt-8">Execution</div>
        {navItems.slice(4).map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            active={currentPath === item.href}
            href={item.href}
          />
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 space-y-3 mt-auto">
        <div className="text-xs font-bold text-muted-foreground">System Status</div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-500/80 tracking-wide uppercase">Core Online</span>
        </div>
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
