import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import { StripeBuyButton } from '@/components/StripeBuyButton';
import { createClient } from '@/lib/supabase-server';

// ── Feature lists ──────────────────────────────────────────────────────────────

const FREE_FEATURES = [
  { zh: '全部 7 個 AI 工作流程', en: 'All 7 AI workflows', included: true },
  { zh: '1 個品牌資料', en: '1 brand profile', included: true },
  { zh: '內容庫查閱記錄', en: 'Content library access', included: true },
  { zh: '推薦好友各得 +500 積分', en: 'Refer friends for +500 credits each', included: true },
  { zh: '品牌聲線 TTS 朗讀', en: 'Brand voice TTS playback', included: false },
  { zh: '多品牌管理', en: 'Multiple brand profiles', included: false },
  { zh: '優先客戶支援', en: 'Priority support', included: false },
];

const PRO_FEATURES = [
  { zh: '全部 7 個 AI 工作流程', en: 'All 7 AI workflows', included: true },
  { zh: '3 個品牌資料', en: 'Up to 3 brand profiles', included: true },
  { zh: '內容庫完整記錄', en: 'Full content library', included: true },
  { zh: '品牌聲線 TTS 朗讀', en: 'Brand voice TTS playback', included: true },
  { zh: '推薦好友各得 +500 積分', en: 'Refer friends for +500 credits each', included: true },
  { zh: '多品牌管理', en: 'Multiple brand profiles', included: false },
  { zh: '優先客戶支援', en: 'Priority support', included: false },
];

const ENTERPRISE_FEATURES = [
  { zh: '全部 7 個 AI 工作流程', en: 'All 7 AI workflows', included: true },
  { zh: '無限品牌資料', en: 'Unlimited brand profiles', included: true },
  { zh: '內容庫完整記錄', en: 'Full content library', included: true },
  { zh: '品牌聲線 TTS 朗讀（無限次）', en: 'Brand voice TTS (unlimited)', included: true },
  { zh: '多品牌管理', en: 'Multiple brand profiles', included: true },
  { zh: '推薦好友各得 +500 積分', en: 'Refer friends for +500 credits each', included: true },
  { zh: '優先客戶支援', en: 'Priority support', included: true },
];

// ── Credit examples ─────────────────────────────────────────────────────────────

const CREDIT_EXAMPLES = [
  { credits: 10, label: '廣告文案 / KOL 腳本 / 限時優惠帖', en: 'Ad copy / KOL script / Flash sale post' },
  { credits: 20, label: '七日社媒計劃 / 品牌定位 / 競爭分析', en: 'Weekly social plan / Brand strategy / Competitor analysis' },
];

// ── FAQ ────────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: '積分是什麼？怎樣計算？\nWhat are credits and how are they calculated?',
    a: '每個 AI 工作流程消耗不同積分：簡單工作流程（廣告文案、KOL 腳本、限時優惠、客評轉化）消耗 10 積分；複雜工作流程（七日社媒計劃、品牌定位、競爭對手分析）消耗 20 積分。\nEach workflow costs credits: simple workflows (ad copy, KOL script, flash sale, trust) = 10 credits; complex workflows (weekly social, brand strategy, competitor analysis) = 20 credits.',
  },
  {
    q: '免費版的 120 積分會過期嗎？\nDo Free plan credits expire?',
    a: '不會。免費版 120 積分是一次性永久配額，無使用期限，足夠試用全部 7 個工作流程還有餘額。\nNo. Free plan credits are a one-time lifetime allotment — no expiry. Enough to try all 7 workflows with credits to spare.',
  },
  {
    q: '付費版積分會累積嗎？\nDo paid plan credits roll over?',
    a: '不會累積，每個帳單周期重新發放。Pro 每月 1,000 積分，Enterprise 每月 5,000 積分。推薦好友獲得的獎勵積分會疊加在基本配額之上。\nPaid credits reset each billing period. Pro = 1,000/month, Enterprise = 5,000/month. Referral bonus credits stack on top of your base allowance.',
  },
  {
    q: '可以隨時取消訂閱嗎？\nCan I cancel anytime?',
    a: '可以，所有方案均可隨時取消，取消後仍可使用至月費期結束。\nYes. Cancel anytime — you\'ll retain access until the end of your billing period.',
  },
];

// ── Components ─────────────────────────────────────────────────────────────────

function FeatureList({ features }: { features: typeof FREE_FEATURES }) {
  return (
    <ul className="space-y-2.5 flex-1 mb-6">
      {features.map((f, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span className={`mt-0.5 shrink-0 text-sm ${f.included ? 'text-success' : 'text-secondary/30'}`}>
            {f.included ? '✓' : '✕'}
          </span>
          <div className={`text-xs leading-snug ${f.included ? 'text-secondary' : 'text-secondary/40'}`}>
            <p>{f.zh}</p>
            <p className="text-secondary/50">{f.en}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function CreditBadge({ amount, period, color }: { amount: string; period: string; color: string }) {
  return (
    <div className={`inline-flex flex-col items-center rounded-xl px-4 py-2 mb-5 ${color}`}>
      <span className="text-2xl font-extrabold leading-none">{amount}</span>
      <span className="text-xs mt-0.5 opacity-80">{period}</span>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  return (
    <AppLayout>
      <div className="space-y-16">

        {/* Hero */}
        <div className="text-center py-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
            定價方案  /  Pricing
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-primary leading-snug mb-3">
            按積分使用，靈活不浪費<br className="hidden sm:block" />
            <span className="text-accent">Pay by credits. Use what you need.</span>
          </h1>
          <p className="text-secondary text-sm max-w-md mx-auto leading-relaxed">
            每個方案均包含固定積分配額，用於驅動 AI 生成、TTS 語音等功能。<br />
            All plans include a credit allowance for AI generation, TTS voice & more.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

          {/* ── Free ── */}
          <div className="bg-surface border border-primary/8 rounded-2xl flex flex-col">
            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-1">
                <h2 className="text-base font-semibold text-primary">
                  免費體驗
                  <span className="text-secondary/50 font-normal ml-1.5 text-sm">/ Free</span>
                </h2>
                <div className="mt-2 flex items-end gap-1.5">
                  <span className="text-3xl font-bold text-primary">$0</span>
                  <span className="pb-1 text-xs text-secondary">永久免費 / Free forever</span>
                </div>
              </div>
              <CreditBadge amount="120 積分" period="一次性永久配額 · 無期限" color="bg-primary/10 text-primary" />
              <p className="text-xs text-secondary/70 mb-4 -mt-2">
                足夠試用全部 7 個工作流程，還有 20 積分餘額<br />
                <span className="text-secondary/50">Enough to try all 7 workflows + 20 credits to spare</span>
              </p>
              <FeatureList features={FREE_FEATURES} />
              <Link
                href="/auth"
                className="block w-full text-center py-2.5 px-4 rounded-xl text-sm border border-primary/20 hover:border-accent/40 text-secondary hover:text-primary transition-colors"
              >
                立即開始  /  Get Started
              </Link>
            </div>
          </div>

          {/* ── Pro ── */}
          <div className="relative bg-accent/5 border border-accent/40 rounded-2xl shadow-lg shadow-accent/10 scale-[1.02] flex flex-col">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                最受歡迎  /  Most Popular
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-1">
                <h2 className="text-base font-semibold text-primary">
                  專業版
                  <span className="text-secondary/50 font-normal ml-1.5 text-sm">/ Pro</span>
                </h2>
                <div className="mt-2 flex items-end gap-1.5">
                  <span className="text-3xl font-bold text-accent">US$20</span>
                  <div className="pb-1 text-xs text-secondary leading-tight">
                    <p>每月 / per month</p>
                  </div>
                </div>
              </div>
              <CreditBadge amount="1,000 積分" period="每月發放新配額 · 沒有累積" color="bg-accent/15 text-accent" />
              <p className="text-xs text-secondary/70 mb-4 -mt-2">
                每月可完成約 50 次複雜任務或 100 次快速生成<br />
                <span className="text-secondary/50">~50 complex or ~100 simple workflow runs/month</span>
              </p>
              <FeatureList features={PRO_FEATURES} />
              <div className="flex justify-center">
                <StripeBuyButton buyButtonId="buy_btn_1TAYKzFFnwNrhEtRwJzJUnnb" clientReferenceId={userId} />
              </div>
            </div>
          </div>

          {/* ── Enterprise ── */}
          <div className="bg-surface border border-yellow-500/20 rounded-2xl flex flex-col">
            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-1">
                <h2 className="text-base font-semibold text-primary">
                  企業版
                  <span className="text-secondary/50 font-normal ml-1.5 text-sm">/ Enterprise</span>
                </h2>
                <div className="mt-2 flex items-end gap-1.5">
                  <span className="text-3xl font-bold text-yellow-500 dark:text-yellow-400">US$50</span>
                  <div className="pb-1 text-xs text-secondary leading-tight">
                    <p>每月 / per month</p>
                  </div>
                </div>
              </div>
              <CreditBadge amount="5,000 積分" period="每月發放新配額 · 沒有累積" color="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" />
              <p className="text-xs text-secondary/70 mb-4 -mt-2">
                高頻創作者首選，支援多品牌大量生產<br />
                <span className="text-secondary/50">For power users & agencies managing multiple brands</span>
              </p>
              <FeatureList features={ENTERPRISE_FEATURES} />
              <div className="flex justify-center">
                <StripeBuyButton buyButtonId="buy_btn_1TAYQiFFnwNrhEtR14w7OiXs" clientReferenceId={userId} />
              </div>
            </div>
          </div>

        </div>

        {/* Credit value table */}
        <div className="bg-surface border border-primary/8 rounded-2xl p-5 max-w-2xl mx-auto">
          <p className="text-xs font-semibold text-secondary uppercase tracking-widest mb-4 text-center">
            積分消耗參考  /  Credit Cost Reference
          </p>
          <div className="space-y-3">
            {CREDIT_EXAMPLES.map((ex, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-primary">{ex.label}</p>
                  <p className="text-xs text-secondary/60">{ex.en}</p>
                </div>
                <span className="shrink-0 bg-accent/10 text-accent font-bold text-sm px-3 py-1 rounded-full">
                  {ex.credits} 積分
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-secondary/50 mt-4 text-center">
            推薦好友成功註冊，雙方各獲 +500 積分獎勵 🎁<br />
            Refer a friend and both of you get +500 bonus credits
          </p>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xs font-semibold text-secondary uppercase tracking-widest mb-6 text-center">
            常見問題  /  FAQ
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-surface border border-primary/8 rounded-2xl p-5">
                <p className="text-sm font-semibold text-primary mb-2 leading-snug whitespace-pre-line">{faq.q}</p>
                <p className="text-sm text-secondary leading-relaxed whitespace-pre-line">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
