import { Task, TaskStatus, Quadrant, Priority, Level, OutputLog, Category } from '../types';
import { storage } from './storageService';
import { FeishuService } from './feishuService';
import { generateId } from '../utils/uuid';

export class TaskService {
  static async completeTask(taskId: string): Promise<void> {
    const tasks = await storage.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const completedTask: Task = {
      ...task,
      status: '已完成',
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await storage.updateTask(taskId, completedTask);

    // 自动创建输出日志并同步到飞书
    const outputData = {
      taskName: task.title,
      date: new Date().toISOString().split('T')[0],
      category: task.category,
      priority: task.priority,
      duration: task.estimated_time || 0,
      sopLink: task.output_link,
      status: 'Completed' as const
    };

    // 背景同步 (不阻塞主流程)
    FeishuService.exportToBitable(outputData);

    const outputLog: OutputLog = {
      id: generateId(),
      user_id: task.user_id,
      task_id: task.id,
      completed_date: outputData.date,
      title: task.title,
      project: task.project,
      category: task.category,
      output_link: task.output_link,
      reusable: false,
      sop_candidate: false,
      value_level: '中',
      created_at: new Date().toISOString(),
    };

    await storage.saveOutputLog(outputLog);
  }

  static async autoRolloverTasks(): Promise<void> {
    const tasks = await storage.getTasks();
    const today = new Date().toISOString().split('T')[0];
    
    const overdueTasks = tasks.filter(t => 
      t.status !== '已完成' && 
      t.plan_date < today
    );

    for (const task of overdueTasks) {
      const delayCount = (task.delay_count || 0) + 1;
      const updatedTask: Task = {
        ...task,
        plan_date: today,
        delay_count: delayCount,
        status: '延期',
        is_stuck: delayCount >= 3,
        updated_at: new Date().toISOString(),
      };
      await storage.updateTask(task.id, updatedTask);
    }
  }

  static async rolloverTask(task: Task): Promise<void> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const delayCount = (task.delay_count || 0) + 1;
    const isStuck = delayCount >= 3;

    const updatedTask: Task = {
      ...task,
      plan_date: tomorrow.toISOString().split('T')[0],
      delay_count: delayCount,
      status: '延期',
      is_stuck: isStuck,
      updated_at: new Date().toISOString(),
    };

    await storage.updateTask(task.id, updatedTask);
    
    // 顺延也同步到 Bitable 记录状态
    FeishuService.exportToBitable({
      taskName: task.title,
      date: new Date().toISOString().split('T')[0],
      category: task.category,
      priority: task.priority,
      status: 'Rolled-over'
    });
  }

  static async createTask(title: string, priority: Priority, quadrant: Quadrant, category: Category, overrides?: Partial<Task>): Promise<Task> {
    const id = generateId();

    const newTask: Task = {
      id,
      user_id: 'default_user', // 暂时硬编码
      title,
      priority,
      quadrant,
      category,
      status: '未开始',
      delay_count: 0,
      auto_rollover: true,
      is_stuck: false,
      plan_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...overrides,
    };

    console.log('[TaskService] Creating task:', newTask);

    try {
      await storage.saveTask(newTask);
      console.log('[TaskService] Task saved successfully');
    } catch (error) {
      console.error('[TaskService] Failed to save task:', error);
      throw error;
    }

    // 创建时同步到飞书日历 (后台同步)
    FeishuService.syncToCalendar(newTask.title, newTask.plan_date, newTask.due_time);

    return newTask;
  }
}
