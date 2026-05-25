import React from 'react';
import { LayoutDashboard, Inbox, Calendar, Grid3X3, ListChecks, Repeat, FileText, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
  collapsed?: boolean;
}

const NavItem = ({ icon: Icon, label, active, onClick, collapsed }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full p-3 rounded-lg transition-colors",
      active ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground text-muted-foreground",
      collapsed ? "justify-center" : "space-x-3"
    )}
  >
    <Icon size={20} />
    {!collapsed && <span className="font-medium">{label}</span>}
  </button>
);

export const Sidebar = ({ currentPath, onNavigate }: { currentPath: string; onNavigate: (path: string) => void }) => {
  const navItems = [
    { path: 'dashboard', label: '首页驾驶舱', icon: LayoutDashboard },
    { path: 'inbox', label: '任务收集箱', icon: Inbox },
    { path: 'today', label: '今日任务', icon: Calendar },
    { path: 'matrix', label: '四象限', icon: Grid3X3 },
    { path: 'weekly', label: '周任务', icon: ListChecks },
    { path: 'recurring', label: '重复任务', icon: Repeat },
    { path: 'output', label: '完成记录', icon: FileText },
    { path: 'review', label: '每日复盘', icon: BarChart3 },
    { path: 'settings', label: '设置', icon: Settings },
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
