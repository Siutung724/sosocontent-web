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

    if (!CONFIG.CONTENT_API_BASE_URL) {
      return NextResponse.json({ error: 'Backend API URL not configured' }, { status: 500 });
    }

    // 呼叫後端 Serverless API (GCF 或 GAS)
    const response = await fetch(CONFIG.CONTENT_API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Backend error: ${errorText}` }, { status: response.status });
    }

    const data: GenerateResponse = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Proxy API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error in Proxy' }, { status: 500 });
  }
}
