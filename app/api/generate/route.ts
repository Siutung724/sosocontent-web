import { NextRequest, NextResponse } from 'next/server';
import { CONFIG } from '@/lib/config';
import { GenerateRequest, GenerateResponse } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();

    // 驗證必要欄位
    if (!body.brandName || !body.productDescription) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
    }

    // 構建 Prompt
    const prompt = `
你而家係一位專業既香港 Content Marketer。請根據以下資料，用香港人鍾意既地道廣東話同繁體中文寫一組營銷內容。
語氣要參考：香港高登/連登風，幽默、貼地、帶少量網絡用語，但唔好用粗口。

品牌名稱：${body.brandName}
產品描述：${body.productDescription}
目標受眾：${body.targetAudience || '香港大眾'}
賣點：${(body.keyBenefits || []).join(', ')}
正式度 (0-3)：${body.toneLevel ?? 1}

請輸出 JSON 格式：
{
  "type": "${body.contentType}",
  "mainContent": "標題、Hook、正文同 CTA",
  "variants": ["短版本 1", "短版本 2"],
  "hashtags": ["#tag1", "#tag2"]
}
`;

    // 呼叫 Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json"
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Gemini API error: ${errorText}` }, { status: response.status });
    }

    const result = await response.json();
    const generatedText = result.candidates[0].content.parts[0].text;

    // 解析 AI 輸出的 JSON
    const data: GenerateResponse = JSON.parse(generatedText);
    return NextResponse.json(data);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
