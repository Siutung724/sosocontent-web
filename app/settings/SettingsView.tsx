'use client';

import Link from 'next/link';
import { useToast } from '@/hooks/useToast';

interface SettingsViewProps {
  email: string;
  displayName: string;
  createdAt: string;
  plan: string;
  bonusCredits: number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('zh-HK', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

const PLAN_INFO: Record<string, { label: string; labelEn: string; credits: string; creditsEn: string; color: string }> = {
  free: {
    label: '免費版', labelEn: 'Free',
    credits: '120 積分（終身一次性配額）',
    creditsEn: '120 credits · one-time lifetime allotment',
    color: 'bg-accent/10 text-accent',
  },
  pro: {
    label: '專業版', labelEn: 'Pro',
    credits: '1,000 積分 / 每月發放',
    creditsEn: '1,000 credits · renews monthly',
    color: 'bg-accent/10 text-accent',
  },
  enterprise: {
    label: '企業版', labelEn: 'Enterprise',
    credits: '5,000 積分 / 每月發放',
    creditsEn: '5,000 credits · renews monthly',
    color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  },
};

export default function SettingsView({ email, displayName, createdAt, plan, bonusCredits }: SettingsViewProps) {
  const { showToast } = useToast();
  const planInfo = PLAN_INFO[plan] ?? PLAN_INFO.free;

  return (
    <div className="max-w-2xl space-y-8">

      {/* ── 帳戶資料 ── */}
      <section>
        <h2 className="text-xs font-semibold text-secondary uppercase tracking-widest mb-4">帳戶資料</h2>
        <div className="bg-surface border border-primary/8 rounded-2xl divide-y divide-primary/8">
          <div className="px-5 py-4 flex items-center justify-between gap-4">
            <span className="text-sm text-secondary">顯示名稱</span>
            <span className="text-sm text-primary font-medium">{displayName}</span>
          </div>
          <div className="px-5 py-4 flex items-center justify-between gap-4">
            <span className="text-sm text-secondary">電郵</span>
            <span className="text-sm text-primary font-medium">{email}</span>
          </div>
          <div className="px-5 py-4 flex items-center justify-between gap-4">
            <span className="text-sm text-secondary">加入日期</span>
            <span className="text-sm text-primary font-medium">{formatDate(createdAt)}</span>
          </div>
        </div>
      </section>

      {/* ── 訂閱計劃 ── */}
      <section>
        <h2 className="text-xs font-semibold text-secondary uppercase tracking-widest mb-4">訂閱計劃</h2>
        <div className="bg-surface border border-primary/8 rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <h3 className="text-sm font-semibold text-primary">
                {planInfo.label}
                <span className="text-secondary/50 font-normal ml-1.5 text-xs">/ {planInfo.labelEn}</span>
              </h3>
              <p className="text-xs text-secondary mt-0.5">{planInfo.credits}</p>
              <p className="text-xs text-secondary/50">{planInfo.creditsEn}</p>
            </div>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium shrink-0 ${planInfo.color}`}>
              使用中
            </span>
          </div>
          {bonusCredits > 0 && (
            <p className="text-xs text-success mb-3">
              + {bonusCredits} 推薦獎勵積分 · {bonusCredits} referral bonus credits
            </p>
          )}
          {plan === 'free' && (
            <Link
              href="/pricing"
              className="inline-block text-sm border border-accent/30 text-accent hover:bg-accent/10 px-4 py-2 rounded-xl transition-colors font-medium"
            >
              升級至專業版 →
            </Link>
          )}
        </div>
      </section>

      {/* ── 聲線設定 ── */}
      <section>
        <h2 className="text-xs font-semibold text-secondary uppercase tracking-widest mb-4">聲線設定</h2>
        <div className="bg-surface border border-primary/8 rounded-2xl p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="text-sm font-semibold text-primary">粵語 TTS 聲線</h3>
              <p className="text-xs text-secondary mt-0.5">管理聲線設定，用於 AI 生成內容的語音朗讀</p>
            </div>
            <span className="text-xs bg-cta/10 text-cta px-2 py-0.5 rounded-full shrink-0 font-medium">
              MiniMax
            </span>
          </div>
          <Link
            href="/settings/voice"
            className="inline-flex items-center gap-2 bg-cta hover:bg-cta/90 text-body font-semibold text-sm px-4 py-2 rounded-xl transition-colors"
          >
            管理聲線設定 →
          </Link>
        </div>
      </section>

      {/* ── 危險區域 ── */}
      <section>
        <h2 className="text-xs font-semibold text-secondary uppercase tracking-widest mb-4">其他</h2>
        <div className="bg-surface border border-primary/8 rounded-2xl p-5">
          <p className="text-sm text-secondary mb-4">如需刪除帳號或匯出資料，請聯絡我們。</p>
          <button
            onClick={() => showToast('success', '如需協助，請電郵至 hello@sosocontent.ai')}
            className="text-sm border border-primary/10 hover:bg-primary/8 text-secondary hover:text-primary px-4 py-2 rounded-xl transition-colors"
          >
            聯絡支援
          </button>
        </div>
      </section>

    </div>
  );
}
