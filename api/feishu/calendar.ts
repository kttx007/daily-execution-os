import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('--- Calendar Sync Request ---');
  if (req.method !== 'POST') {
    return res.status(405).json({ msg: 'Method Not Allowed' });
  }

  const { summary, start_time, end_time, description } = req.body;
  const appId = process.env.FEISHU_APP_ID;
  const appSecret = process.env.FEISHU_APP_SECRET;

  if (!appId || !appSecret) {
    console.error('Missing Feishu credentials in environment variables');
    return res.status(500).json({ msg: 'Feishu credentials not configured' });
  }

  try {
    // 1. Get tenant_access_token
    const tokenRes = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app_id: appId, app_secret: appSecret })
    });
    const tokenData = await tokenRes.json();
    if (tokenData.code !== 0) throw new Error(tokenData.msg);

    const token = tokenData.tenant_access_token;

    // 2. Create Calendar Event
    // This is a simplified version, usually you need to find the primary calendar first
    // For now we assume a direct create call or a specific calendar id
    const calendarRes = await fetch('https://open.feishu.cn/open-apis/calendar/v4/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        summary,
        description,
        start_time: { timestamp: Math.floor(new Date(start_time).getTime() / 1000).toString() },
        end_time: { timestamp: Math.floor(new Date(end_time).getTime() / 1000).toString() }
      })
    });
    const calendarData = await calendarRes.json();
    
    if (calendarData.code !== 0) {
      return res.status(400).json({ msg: calendarData.msg, code: calendarData.code });
    }

    return res.status(200).json({ status: 'ok', data: calendarData.data });
  } catch (error: any) {
    return res.status(500).json({ msg: error.message });
  }
}
