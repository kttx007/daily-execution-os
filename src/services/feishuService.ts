/**
 * FeishuService - 负责与飞书体系的集成
 * 包含日历同步、多维表格导出及机器人消息处理
 */
export class FeishuService {
  private static BITABLE_TOKEN = 'TepQb4lKealMNNsn0BecUKEyn7c';
  private static TABLE_ID = 'tbljtx3HYZh5bX2n';
  private static API_BASE = '/api/feishu'; // 预留 Vercel Serverless Function 路径

  /**
   * 同步任务到飞书日历
   * @param taskTitle 任务标题
   * @param planDate 计划日期 (YYYY-MM-DD)
   * @param dueTime 截止时间 (HH:mm)
   */
  static async syncToCalendar(taskTitle: string, planDate: string, dueTime?: string): Promise<boolean> {
    console.log(`[Feishu] Syncing task "${taskTitle}" to calendar...`);
    
    try {
      const response = await fetch(`${this.API_BASE}/calendar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: taskTitle,
          start_time: dueTime ? `${planDate} ${dueTime}:00` : `${planDate} 09:00:00`,
          end_time: dueTime ? `${planDate} ${dueTime}:30` : `${planDate} 10:00:00`
        })
      });
      return response.ok;
    } catch (error) {
      console.error('[Feishu] Calendar sync failed:', error);
      return false;
    }
  }

  /**
   * 将完成记录同步到飞书多维表格 (Bitable)
   * 用于沉淀 SOP 和执行数据
   */
  static async exportToBitable(data: {
    taskName: string;
    date: string;
    category: string;
    priority: string;
    duration?: number;
    sopLink?: string;
    status: 'Completed' | 'Rolled-over' | 'Abandoned';
  }): Promise<boolean> {
    console.log('[Feishu] Exporting output log to Bitable...', data);
    
    try {
      const response = await fetch(`${this.API_BASE}/bitable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseToken: this.BITABLE_TOKEN,
          tableId: this.TABLE_ID,
          fields: {
            'TaskName': data.taskName,
            'Date': new Date(data.date).getTime(), // Bitable 日期通常接收毫秒时间戳
            'Category': data.category,
            'Priority': data.priority,
            'Duration': data.duration || 0,
            'SOPLink': data.sopLink ? { text: data.sopLink, link: data.sopLink } : null,
            'Status': data.status
          }
        })
      });
      return response.ok;
    } catch (error) {
      console.error('[Feishu] Bitable export failed:', error);
      return false;
    }
  }

  /**
   * 处理从飞书机器人接收到的消息 (Webhook 入口逻辑)
   * 此逻辑主要在后端实现，此处为前端处理 Inbox 流入的 Mock
   */
  static processIncomingMessage(content: string): { title: string; source: string } {
    return {
      title: content,
      source: 'Feishu Bot'
    };
  }
}
