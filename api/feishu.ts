import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Super-fast Feishu Verification Handler
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Immediate response for verification to beat the 3s timeout
  if (req.method === 'POST' && req.body?.type === 'url_verification') {
    console.log('[Feishu] Verification challenge received');
    return res.status(200).json({ challenge: req.body.challenge });
  }

  // 2. Health check for pinging
  if (req.method === 'GET') {
    return res.status(200).send('Daily OS Feishu Gateway: Active');
  }

  // 3. Environment check
  const { FEISHU_APP_ID, FEISHU_APP_SECRET } = process.env;
  if (!FEISHU_APP_ID || !FEISHU_APP_SECRET) {
    return res.status(500).json({ error: 'Missing Feishu Credentials' });
  }

  try {
    // 处理事件订阅 (如消息接收)
    if (req.body?.header?.event_type === 'im.message.receive_v1') {
      console.log('[Feishu] Message received');
      // 逻辑处理...
      return res.status(200).json({ status: 'success' });
    }

    // 4. API Forwarding (Calendar / Bitable)
    const path = req.url?.split('/').pop();
    if (path === 'calendar' || path === 'bitable') {
      const tokenRes = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app_id: FEISHU_APP_ID, app_secret: FEISHU_APP_SECRET })
      });
      const { tenant_access_token } = await tokenRes.json();

      if (path === 'calendar') {
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
        return res.status(200).json(await calendarRes.json());
      }

      if (path === 'bitable') {
        const { baseToken, tableId, fields } = req.body;
        const bitableRes = await fetch(`https://open.feishu.cn/open-apis/bitable/v1/apps/${baseToken}/tables/${tableId}/records`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tenant_access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ fields })
        });
        return res.status(200).json(await bitableRes.json());
      }
    }

    return res.status(200).json({ message: 'Event received' });
  } catch (error: any) {
    console.error('[Feishu Gateway Error]', error);
    return res.status(500).json({ error: error.message });
  }
}
