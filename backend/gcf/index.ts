import * as functions from '@google-cloud/functions-framework';
import fetch from 'node-fetch';

// 定義 Request/Response 格式 (與前端 lib/types.ts 保持一致)
interface GenerateRequest {
  brandName: string;
  productDescription: string;
  targetAudience?: string;
  toneLevel?: number;
  contentType: string; // 統一使用 contentType
}

interface GenerateResponse {
  type: string;
  mainContent: string;
  variants: string[];
  hashtags: string[];
  error?: string;
}

functions.http('generateContent', async (req, res) => {
  // CORS 設定
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  // Debug: 紀錄收到資料
  console.log('Received GCF Request Body:', JSON.stringify(req.body));

  const body = req.body as GenerateRequest;

  // 驗證必要欄位
  if (!body || !body.brandName || !body.productDescription) {
    console.error('Validation Error: Missing fields', body);
    res.status(400).json({ error: 'Missing required fields (brandName, productDescription)' });
    return;
  }

  const API_KEY = process.env.GEMINI_API_KEY;
  const API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

  if (!API_KEY) {
    console.error('Config Error: GEMINI_API_KEY not found');
    res.status(500).json({ error: 'GEMINI_API_KEY is not configured on server.' });
    return;
  }

  // 構建 Prompt (與 Cloudflare 版本同步)
  const prompt = `
你而家係一位專業既香港 Content Marketer。請根據以下資料，用香港人鍾意既地道廣東話同繁體中文寫一組營銷內容。
語氣要參考：香港高登/連登風，幽默、貼地、帶少量網絡用語，但唔好用粗口。

品牌名稱：${body.brandName}
產品描述：${body.productDescription}
目標受眾：${body.targetAudience || '香港大眾'}
正式度 (0-3)：${body.toneLevel ?? 1}

請輸出 JSON 格式：
{
  "type": "${body.contentType}",
  "mainContent": "標題、Hook、正文同 CTA",
  "variants": ["短版本 1", "短版本 2"],
  "hashtags": ["#tag1", "#tag2"]
}
`;

  try {
    const response = await fetch(`${API_ENDPOINT}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json",
          temperature: 0.7,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error Response:', errorText);
      res.status(response.status).json({ error: `Gemini API error: ${errorText}` });
      return;
    }

    const result: any = await response.json();
    const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No content returned from Gemini');
    }

    // 解析 AI 輸出的 JSON
    const data: GenerateResponse = JSON.parse(generatedText);

    // Debug: 紀錄成功生成
    console.log('Successfully generated content for:', body.brandName);

    res.status(200).json(data);

  } catch (error: any) {
    console.error('GCF Execution Error:', error);
    res.status(500).json({ error: 'Internal Server Error during GCF execution: ' + error.message });
  }
});
