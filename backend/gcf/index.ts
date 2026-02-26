import * as functions from '@google-cloud/functions-framework';
import fetch from 'node-fetch'; // 亦可使用 Node 18+ 原生 fetch

// 定義 Request/Response 格式 (與前端 lib/types.ts 一致)
interface GenerateRequest {
  brandName: string;
  productDescription: string;
  targetAudience: string;
  toneLevel: number;
  useCase: string;
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

  const { brandName, productDescription, targetAudience, toneLevel, useCase } = req.body as GenerateRequest;

  // 取得環境變數 (需在 GCP Console 設定)
  const API_KEY = process.env.AI_API_KEY;
  const API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

  if (!API_KEY) {
    res.status(500).json({ error: 'AI_API_KEY is not configured on server.' });
    return;
  }

  // AI Prompt 設計
  const toneMap: Record<number, string> = {
    0: "超貼地，好似老友係茶記吹水咁，可以用多啲潮流用語。",
    1: "輕鬆幽默，帶點玩味，適合同年輕人溝通。",
    2: "專業得嚟亦好親切，適合職場／中小企品牌。",
    3: "偏向正式，但仲係用廣東話繁體，保持品牌形象。"
  };

  const systemInstructions = `
你是一位專門幫香港中小企寫內容營銷文案的資深 Copywriter。
- 語言：香港廣東話 (Cantonese)，使用繁體中文。
- 語氣：${toneMap[toneLevel] || toneMap[1]} 參考香港高登 / LIHKG 風格，但不可以出現粗口或人身攻擊。
- 結構：先用一兩句吸睛 Hook，然後點出受眾痛點，再介紹產品如何解決問題，最後加入明確 Call-to-Action (CTA)。
- 所有輸出都要符合香港文化語境，多用 Emoji。
`;

  const userPrompt = `
目標用途: ${useCase}
品牌名稱: ${brandName}
產品描述: ${productDescription}
目標客群: ${targetAudience}

請根據以上資料生成一篇高質量的營銷文案。
  `;

  try {
    const response = await fetch(`${API_ENDPOINT}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${systemInstructions}\n\n${userPrompt}` }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      })
    });

    const data: any = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "AI 生成失敗，請檢查 API Key 或 Prompt。";

    res.status(200).json({
      content: content.trim(),
      meta: {
        useCase,
        language: "zh-Hant-yue",
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('AI API Error:', error);
    res.status(500).json({ error: 'Failed to connect to AI Provider.' });
  }
});

/*
GCP 部署說明：
1. 目標目錄：backend/gcf
2. 執行指令：gcloud functions deploy generateContent \
   --runtime nodejs20 \
   --trigger-http \
   --allow-unauthenticated \
   --set-env-vars AI_API_KEY=YOUR_GEMINI_KEY
*/
