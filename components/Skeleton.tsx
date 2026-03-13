/**
 * Skeleton — 載入佔位動畫組件
 * 使用方式：<Skeleton /> 單行、<Skeleton variant="card" /> 卡片、<Skeleton variant="post-card" /> 貼文卡
 */

interface SkeletonProps {
  className?: string;
}

function SkeletonBase({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`bg-surface-2 rounded-lg animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

// ── Inline variants ────────────────────────────────────────────────────────────

/** 單行文字佔位 */
export function SkeletonLine({ className = '' }: SkeletonProps) {
  return <SkeletonBase className={`h-4 ${className}`} />;
}

/** 標題佔位（較粗） */
export function SkeletonTitle({ className = '' }: SkeletonProps) {
  return <SkeletonBase className={`h-6 ${className}`} />;
}

// ── Card variants ──────────────────────────────────────────────────────────────

/** Workflow Hub 卡片佔位 */
export function SkeletonWorkflowCard() {
  return (
    <div className="bg-surface border border-primary/8 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <SkeletonBase className="h-10 w-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <SkeletonTitle className="w-1/2" />
          <SkeletonLine className="w-3/4" />
        </div>
      </div>
      <SkeletonLine className="w-full" />
      <SkeletonLine className="w-5/6" />
      <SkeletonBase className="h-9 w-28 rounded-xl mt-2" />
    </div>
  );
}

/** 貼文卡片佔位（結果列表 / Library） */
export function SkeletonPostCard() {
  return (
    <div className="bg-surface border border-primary/8 rounded-2xl overflow-hidden">
      {/* header */}
      <div className="bg-surface-2 border-b border-primary/8 px-5 py-3 flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1">
          <SkeletonBase className="h-3 w-16 rounded-full" />
          <SkeletonTitle className="w-2/3" />
        </div>
        <SkeletonBase className="h-7 w-16 rounded-lg shrink-0" />
      </div>
      {/* body */}
      <div className="px-5 py-4 space-y-2">
        <SkeletonLine className="w-full" />
        <SkeletonLine className="w-full" />
        <SkeletonLine className="w-4/5" />
        <div className="flex gap-1.5 pt-1">
          <SkeletonBase className="h-5 w-16 rounded-full" />
          <SkeletonBase className="h-5 w-16 rounded-full" />
          <SkeletonBase className="h-5 w-16 rounded-full" />
        </div>
      </div>
      {/* voice bar */}
      <div className="border-t border-primary/8 px-5 py-2.5 flex items-center justify-between">
        <SkeletonBase className="h-6 w-14 rounded-lg" />
        <SkeletonBase className="h-3 w-20 rounded-full" />
      </div>
    </div>
  );
}

/** Brand Profile 卡片佔位 */
export function SkeletonBrandCard() {
  return (
    <div className="bg-surface border border-primary/8 rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <SkeletonTitle className="w-1/3" />
        <SkeletonBase className="h-5 w-12 rounded-full" />
      </div>
      <SkeletonLine className="w-full" />
      <SkeletonLine className="w-4/5" />
      <div className="flex gap-2 pt-1">
        <SkeletonBase className="h-8 w-14 rounded-lg" />
        <SkeletonBase className="h-8 w-14 rounded-lg" />
      </div>
    </div>
  );
}

/** Execution 列表行佔位 */
export function SkeletonExecRow() {
  return (
    <div className="bg-surface border border-primary/8 rounded-2xl px-5 py-4 flex items-center justify-between gap-3">
      <div className="flex-1 space-y-1.5">
        <SkeletonTitle className="w-1/3" />
        <SkeletonLine className="w-1/4" />
      </div>
      <SkeletonBase className="h-6 w-6 rounded-full shrink-0" />
    </div>
  );
}

// ── Page-level skeletons ───────────────────────────────────────────────────────

/** Workflow Hub 整頁佔位（3 張卡片） */
export function SkeletonWorkflowPage() {
  return (
    <div className="space-y-8">
      <SkeletonTitle className="w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SkeletonWorkflowCard />
        <SkeletonWorkflowCard />
        <SkeletonWorkflowCard />
      </div>
    </div>
  );
}

/** Library 整頁佔位 */
export function SkeletonLibraryPage() {
  return (
    <div className="space-y-8">
      <SkeletonTitle className="w-40" />
      <div className="space-y-3">
        <SkeletonExecRow />
        <SkeletonExecRow />
        <SkeletonExecRow />
      </div>
    </div>
  );
}

// ── Default export ─────────────────────────────────────────────────────────────

/** 通用單行 Skeleton（默認導出） */
export default SkeletonLine;
