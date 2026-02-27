'use client';

import React, { useState } from 'react';
import { GenerateRequest, GenerateResponse } from '@/lib/types';
import { USE_CASES, TONE_LEVELS } from '@/lib/constants';

export default function Home() {
  const [formData, setFormData] = useState<GenerateRequest>({
    brandName: '',
    productDescription: '',
    targetAudience: '',
    toneLevel: 1,
    contentType: 'facebook_post',
  });

  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data: GenerateResponse = await response.json();
      if (data.error) throw new Error(data.error);

      // 格式化生成結果
      const formattedResult = `
${data.mainContent}

---
建議變體：
${data.variants.join('\n\n')}

---
Hashtags:
${data.hashtags.join(' ')}
      `.trim();

      setResult(formattedResult);
    } catch (err: any) {
      setError(err.message || '發生錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <header className="hero">
        <h1>sosocontent.ai 🇭🇰</h1>
        <p>專為香港中小企打造的地道廣東話 AI 營銷助手</p>
      </header>

      <section className="main-grid">
        <form onSubmit={handleSubmit} className="card glass">
          <div className="form-group">
            <label>品牌名稱</label>
            <input
              type="text"
              placeholder="例如：街頭小食店"
              value={formData.brandName}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>產品/服務描述</label>
            <textarea
              placeholder="例如：新鮮熱辣雞蛋仔，外脆內軟..."
              rows={3}
              value={formData.productDescription}
              onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>目標客群</label>
            <input
              type="text"
              placeholder="例如：18-35歲、鍾意搵食嘅年輕人"
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>內容用途</label>
              <select
                value={formData.contentType}
                onChange={(e) => setFormData({ ...formData, contentType: e.target.value as any })}
              >
                {USE_CASES.map(uc => <option key={uc.value} value={uc.value}>{uc.label}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>語氣正式度 (0-3)</label>
              <input
                type="range"
                min="0" max="3"
                value={formData.toneLevel}
                onChange={(e) => setFormData({ ...formData, toneLevel: parseInt(e.target.value) as any })}
              />
              <span className="tone-hint">
                {TONE_LEVELS.find(t => t.value === formData.toneLevel)?.label}
              </span>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? '生成中...' : '一鍵生成文案 ✨'}
          </button>
        </form>

        <div className="result-area">
          {error && <div className="alert-error">{error}</div>}

          <div className="card glass result-card">
            <h3>生成結果</h3>
            {result ? (
              <div className="content-box">
                <textarea readOnly value={result} rows={12} />
                <button onClick={() => navigator.clipboard.writeText(result)} className="btn-secondary">
                  複製到剪貼簿 📋
                </button>
              </div>
            ) : (
              <p className="placeholder-text">喺左邊輸入資料，然後按「生成」啦！</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
