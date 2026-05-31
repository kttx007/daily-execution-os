import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('--- Bitable Sync Request ---');
  if (req.method !== 'POST') {
    return res.status(405).json({ msg: 'Method Not Allowed' });
  }

  const { baseToken, tableId, fields } = req.body;
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

    // 2. Push to Bitable
    const bitableRes = await fetch(`https://open.feishu.cn/open-apis/bitable/v1/apps/${baseToken}/tables/${tableId}/records`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields })
    });
    const bitableData = await bitableRes.json();
    
    if (bitableData.code !== 0) {
      return res.status(400).json({ msg: bitableData.msg, code: bitableData.code });
    }

    return res.status(200).json({ status: 'ok', data: bitableData.data });
  } catch (error: any) {
    return res.status(500).json({ msg: error.message });
  }
}
