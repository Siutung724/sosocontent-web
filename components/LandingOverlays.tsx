'use client';

import { useState } from 'react';
import Link from 'next/link';

// ── Update Banner (Layer 2) ────────────────────────────────────────────────
// Fixed bottom-right card, dismissible

function UpdateBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 w-80 bg-surface border border-primary/10 rounded-2xl shadow-toast overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
        <div>
          <span className="block text-xs font-bold text-cta uppercase tracking-widest mb-0.5">
            📢 最新消息
          </span>
          <h3 className="text-sm font-semibold text-primary leading-snug">
            7日社交媒體計劃生成器正式上線
          </h3>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 text-secondary/50 hover:text-secondary transition-colors mt-0.5"
          aria-label="關閉"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
            <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="px-5 pb-4">
        <p className="text-xs text-secondary leading-relaxed mb-3">
          輸入品牌資料，AI 自動為你生成 Instagram、Facebook 及 LinkedIn 一週貼文計劃，每篇附主題、正文、Hashtag 及配圖建議。
        </p>
        <Link
          href="/auth"
          className="inline-flex items-center gap-1.5 bg-cta text-body text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-cta/90 transition-colors"
        >
          立即試用 →
        </Link>
      </div>
    </div>
  );
}

// ── Promo Modal (Layer 3) ──────────────────────────────────────────────────
// Full-screen backdrop + centered modal, dismissible

function PromoModal() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-body/80 backdrop-blur-sm"
        onClick={() => setDismissed(true)}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div className="relative z-10 w-full max-w-sm bg-surface border border-primary/10 rounded-2xl shadow-toast overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 bg-cta w-full" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 pt-5 pb-2">
          <div>
            <span className="block text-xs font-bold text-cta uppercase tracking-widest mb-1">
              🎁 限時優惠
            </span>
            <h2 className="text-lg font-bold text-primary leading-snug">
              首月免費使用<br />專業版功能
            </h2>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="shrink-0 text-secondary/50 hover:text-secondary transition-colors mt-1"
            aria-label="關閉"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6">
          <ul className="space-y-2 mb-5 mt-3">
            {[
              '無限次 AI 內容生成',
              '7日、30日社交媒體計劃',
              '品牌聲音分析及優化建議',
              '多平台一鍵發佈（即將推出）',
            ].map(item => (
              <li key={item} className="flex items-center gap-2 text-sm text-secondary">
                <span className="text-cta shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>

          <p className="text-xs text-secondary/60 mb-4">
            優惠期至 2025 年 3 月底。無需信用卡，隨時取消。
          </p>

          <Link
            href="/auth"
            className="block w-full bg-cta text-body text-sm font-bold text-center py-3 rounded-xl hover:bg-cta/90 transition-colors"
          >
            立即領取優惠
          </Link>

          <button
            onClick={() => setDismissed(true)}
            className="block w-full text-center text-xs text-secondary/50 hover:text-secondary mt-3 transition-colors"
          >
            不了，謝謝
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Combined export ────────────────────────────────────────────────────────

export default function LandingOverlays() {
  return (
    <>
      <PromoModal />
      <UpdateBanner />
    </>
  );
}
