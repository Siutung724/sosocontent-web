/**
 * Ticker — 頂部走馬燈橫幅
 * 使用 #00edcb (cta) 作為背景色，深色文字
 */

const MESSAGES = [
  '🚀 全新功能上線 — 7日社交媒體計劃生成器',
  '✨ 現已支援 Instagram、Facebook、LinkedIn 內容生成',
  '🇭🇰 專為香港中小企設計，地道廣東話文案',
  '🎯 AI 一鍵生成品牌故事、產品推廣、活動宣傳',
  '⚡ 免費試用中，立即開始生成你的內容計劃',
];

const SEPARATOR = '　✦　';

export default function Ticker() {
  // Duplicate content so the loop appears seamless
  const track = [...MESSAGES, ...MESSAGES].join(SEPARATOR);

  return (
    <div className="w-full bg-cta overflow-hidden py-2 select-none" aria-hidden="true">
      <div className="flex whitespace-nowrap animate-marquee">
        {/* Render twice so the duplicate fills the gap during loop */}
        <span className="text-xs font-semibold text-body px-4 shrink-0">{track}</span>
        <span className="text-xs font-semibold text-body px-4 shrink-0" aria-hidden="true">{track}</span>
      </div>
    </div>
  );
}
