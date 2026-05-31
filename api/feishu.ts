import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 添加更详细的日志以供排错
  console.log('--- Incoming Feishu Request ---');
  console.log('Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers));
  console.log('Body:', JSON.stringify(req.body));

  // 1. 飞书 URL 验证请求 (POST)
  if (req.method === 'POST') {
    const body = req.body;
    
    // 如果是加密的
    if (body?.encrypt) {
      console.warn('Received encrypted payload, but decryption is not configured.');
    }

    // 标准明文挑战响应
    // 飞书验证请求结构可能是 { challenge: "...", type: "url_verification", ... }
    const challenge = body?.challenge || body?.data?.challenge;
    const type = body?.type || body?.data?.type;

    if (type === 'url_verification' || challenge) {
      console.log('Responding to url_verification with challenge:', challenge);
      return res.status(200).json({ challenge });
    }
    
    console.log('No challenge found in POST body');
  }

  // 2. 探活响应 (GET)
  if (req.method === 'GET') {
    return res.status(200).send('Daily OS Feishu Gateway Active (HKG1)');
  }

  return res.status(200).json({ status: 'ok', info: 'Ready for Feishu events', timestamp: new Date().toISOString() });
}
