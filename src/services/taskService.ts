import { Task, TaskStatus, Quadrant, Priority, Level, OutputLog } from '../types';
import { localProvider } from './localStorage';

export class TaskService {
  static async completeTask(task: Task): Promise<void> {
    const completedTask: Task = {
      ...task,
      status: '已完成' as TaskStatus,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await localProvider.saveTask(completedTask);

    // 自动创建输出日志
    const outputLog: OutputLog = {
      id: crypto.randomUUID(),
      user_id: task.user_id,
      task_id: task.id,
      completed_date: new Date().toISOString().split('T')[0],
      title: task.title,
      project: task.project,
      category: task.category,
      output_link: task.output_link,
      reusable: false,
      sop_candidate: false,
      value_level: '中' as Level,
      created_at: new Date().toISOString(),
    };

    await localProvider.saveOutputLog(outputLog);
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
      status: '延期' as TaskStatus,
      is_stuck: isStuck,
      updated_at: new Date().toISOString(),
    };

    await localProvider.saveTask(updatedTask);
  }

  static async createTask(title: string, userId: string, overrides?: Partial<Task>): Promise<Task> {
    const newTask: Task = {
      id: crypto.randomUUID(),
      user_id: userId,
      title,
      status: '未开始' as TaskStatus,
      delay_count: 0,
      auto_rollover: true,
      is_stuck: false,
      plan_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...overrides,
    };

    await localProvider.saveTask(newTask);
    return newTask;
  }
}
