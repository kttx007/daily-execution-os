import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

/**
 * Vercel Serverless Function for Feishu Integration
 * Handles Calendar sync, Bitable logging, and Webhook receiving
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { 
    FEISHU_APP_ID, 
    FEISHU_APP_SECRET,
    FEISHU_VERIFICATION_TOKEN,
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
  } = process.env;

  if (!FEISHU_APP_ID || !FEISHU_APP_SECRET) {
    return res.status(500).json({ error: 'Feishu credentials not configured' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ status: 'healthy' });
  }

  const path = req.url?.split('/').pop();

  // 处理飞书 Webhook 事件转发
  if (req.method === 'POST' && req.body?.type === 'url_verification') {
    return res.status(200).json({ challenge: req.body.challenge });
  }

  try {
    // 飞书消息事件监听 -> 写入 Inbox
    if (req.body?.header?.event_type === 'im.message.receive_v1') {
      const { message } = req.body.event;
      const content = JSON.parse(message.content).text;

      if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        await supabase.from('inbox').insert({
          title: content,
          source: 'Feishu Bot',
          user_id: 'default_user', // 逻辑上应通过 open_id 映射
          created_at: new Date().toISOString()
        });
      }
      return res.status(200).json({ status: 'ok' });
    }

    // 1. 获取 Tenant Access Token
    const tokenRes = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app_id: FEISHU_APP_ID, app_secret: FEISHU_APP_SECRET })
    });
    const tokenData = await tokenRes.json();
    const tenant_access_token = tokenData.tenant_access_token;

    if (path === 'calendar') {
      // 创建日程
      const { summary, start_time, end_time } = req.body;
      const calendarRes = await fetch('https://open.feishu.cn/open-apis/calendar/v4/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tenant_access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          summary,
          start_time: { timestamp: Math.floor(new Date(start_time).getTime() / 1000).toString() },
          end_time: { timestamp: Math.floor(new Date(end_time).getTime() / 1000).toString() }
        })
      });
      const data = await calendarRes.json();
      return res.status(200).json(data);
    }

    if (path === 'bitable') {
      // 写入 Bitable 记录
      const { baseToken, tableId, fields } = req.body;
      const bitableRes = await fetch(`https://open.feishu.cn/open-apis/bitable/v1/apps/${baseToken}/tables/${tableId}/records`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tenant_access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fields })
      });
      const data = await bitableRes.json();
      return res.status(200).json(data);
    }

    return res.status(404).json({ error: 'Endpoint not found' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
