import { Task, OutputLog, DailyReview } from '../types';
import { storage } from './storageService';

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  totalCompleted: number;
  totalTasks: number;
  completionRate: number;
  categoryDistribution: Record<string, number>;
  topOutputs: OutputLog[];
  stuckInsights: string[];
}

export class ReportService {
  static async generateWeeklyReport(date: Date = new Date()): Promise<WeeklyReport> {
    const tasks = await storage.getTasks();
    const logs = await storage.getOutputLogs();
    
    // Calculate week range (Mon to Sun)
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const start = new Date(date.setDate(diff));
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    const weekStartStr = start.toISOString().split('T')[0];
    const weekEndStr = end.toISOString().split('T')[0];

    const weekTasks = tasks.filter(t => t.plan_date >= weekStartStr && t.plan_date <= weekEndStr);
    const completedTasks = weekTasks.filter(t => t.status === '已完成');
    const weekLogs = logs.filter(l => l.completed_date >= weekStartStr && l.completed_date <= weekEndStr);

    const categoryDistribution: Record<string, number> = {};
    completedTasks.forEach(t => {
      categoryDistribution[t.category] = (categoryDistribution[t.category] || 0) + 1;
    });

    const stuckTasks = weekTasks.filter(t => t.is_stuck);
    const stuckInsights = stuckTasks.map(t => `${t.title} (延期 ${t.delay_count} 次)`);

    return {
      weekStart: weekStartStr,
      weekEnd: weekEndStr,
      totalCompleted: completedTasks.length,
      totalTasks: weekTasks.length,
      completionRate: weekTasks.length > 0 ? Math.round((completedTasks.length / weekTasks.length) * 100) : 0,
      categoryDistribution,
      topOutputs: weekLogs.sort((a, b) => (b.value_level === '高' ? 1 : 0) - (a.value_level === '高' ? 1 : 0)).slice(0, 5),
      stuckInsights
    };
  }

  static async generateMonthlyReport(year: number, month: number): Promise<any> {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    
    // Similar logic for monthly...
    return { start, end };
  }
}
