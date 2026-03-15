'use client';

import { useState } from 'react';

interface ReferralCardProps {
  referralCode: string;
  referralCount: number;
  bonusCredits: number;
}

export default function ReferralCard({ referralCode, referralCount, bonusCredits }: ReferralCardProps) {
  const [copied, setCopied] = useState(false);
  const referralUrl = `https://sosocontent.ai?ref=${referralCode}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = referralUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/25 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-primary">🎁 與好友分享，各得 500 積分</p>
          <p className="text-xs text-secondary mt-1">
            好友用你的連結成功註冊，雙方同時獲得 500 積分獎勵
          </p>
        </div>
        {bonusCredits > 0 && (
          <div className="text-right shrink-0">
            <p className="text-xl font-bold text-accent">+{bonusCredits.toLocaleString()}</p>
            <p className="text-xs text-secondary/70">已獲積分</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <div className="flex-1 bg-surface border border-primary/10 rounded-xl px-3 py-2.5 text-xs text-secondary/80 truncate font-mono">
          {referralUrl}
        </div>
        <button
          onClick={copy}
          className="shrink-0 bg-accent text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-accent/90 active:scale-95 transition-all"
        >
          {copied ? '✓ 已複製' : '複製連結'}
        </button>
      </div>

      {referralCount > 0 && (
        <p className="text-xs text-secondary/60 mt-2">
          已成功邀請 <span className="font-semibold text-accent">{referralCount}</span> 位好友
        </p>
      )}
    </div>
  );
}
