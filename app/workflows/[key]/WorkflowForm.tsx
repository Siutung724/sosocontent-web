'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import type { PromptVariable, WeeklyPost, WeeklySocialResult } from '@/lib/workflow-types';

interface WorkflowFormProps {
  workflowKey: string;
  variables: PromptVariable[];
}

// ── Spinner ───────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ── Post Card ─────────────────────────────────────────────────────────────────

function PostCard({ post }: { post: WeeklyPost }) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = async () => {
    const text = [post.content, '', post.hashtags.join(' ')].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: do nothing silently
    }
  };

  return (
    <div className="bg-surface border border-primary/8 rounded-2xl overflow-hidden">
      {/* Card header */}
      <div className="bg-surface-2 border-b border-primary/8 px-5 py-3 flex items-start justify-between gap-3">
        <div>
          <span className="block text-xs font-bold text-accent uppercase tracking-widest mb-0.5">
            Day {post.day}
          </span>
          <h3 className="text-base font-semibold text-primary leading-snug">
            {post.theme}
          </h3>
        </div>
        <button
          onClick={handleCopy}
          className={`shrink-0 text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors duration-150 ${
            copied
              ? 'border-success/30 text-success bg-success/10'
              : 'border-primary/10 text-secondary hover:border-primary/20 hover:text-primary'
          }`}
        >
          {copied ? '✓ 已複製' : '複製全文'}
        </button>
      </div>

      {/* Card body */}
      <div className="px-5 py-4 space-y-3">
        {/* Main content */}
        <p className="text-sm text-primary leading-relaxed whitespace-pre-line">
          {post.content}
        </p>

        {/* Visual concept */}
        {post.visual_concept && (
          <p className="text-xs text-secondary italic flex items-start gap-1.5">
            <span className="shrink-0 mt-0.5">🖼</span>
            <span>{post.visual_concept}</span>
          </p>
        )}

        {/* Hashtags */}
        {post.hashtags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.hashtags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-accent/10 text-accent px-2.5 py-0.5 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Voice Bar — placeholder */}
      <div className="border-t border-primary/8 px-5 py-2.5 flex items-center justify-between">
        <button
          onClick={() => showToast('success', '語音生成功能即將推出')}
          className="flex items-center gap-1.5 border border-accent/30 text-accent hover:bg-accent/10 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
            <path d="M3 3.732a1.5 1.5 0 0 1 2.305-1.265l6.706 4.268a1.5 1.5 0 0 1 0 2.53L5.305 13.533A1.5 1.5 0 0 1 3 12.268V3.732Z" />
          </svg>
          播放
        </button>
        <span className="text-xs text-secondary/60">系統預設聲線</span>
      </div>
    </div>
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────

export default function WorkflowForm({ workflowKey, variables }: WorkflowFormProps) {
  // Initialise inputs with any default_value from DB
  const [inputs, setInputs] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    variables.forEach((v) => {
      if (v.default_value) init[v.name] = v.default_value;
    });
    return init;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WeeklySocialResult | null>(null);
  const { showToast } = useToast();

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleChange = (name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (name: string, value: string, checked: boolean) => {
    const current = inputs[name] ? inputs[name].split(',').filter(Boolean) : [];
    const next = checked ? [...current, value] : current.filter((v) => v !== value);
    setInputs((prev) => ({ ...prev, [name]: next.join(',') }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/workflows/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowKey, inputs }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? '生成失敗，請稍後再試');
        showToast('error', data.error ?? '生成失敗，請稍後再試');
        return;
      }

      setResult(data.result as WeeklySocialResult);
      showToast('success', '7 日貼文計劃已生成！');
    } catch {
      setError('網絡錯誤，請稍後再試');
      showToast('error', '網絡錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* ── Form ── */}
      <form
        onSubmit={handleSubmit}
        className="bg-surface border border-primary/8 rounded-2xl p-6 space-y-6"
      >
        {variables.length === 0 && (
          <p className="text-sm text-secondary text-center py-4">
            呢個工作流程暫時未設定輸入欄位
          </p>
        )}

        {variables.map((v) => (
          <div key={v.id}>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              {v.label}
              {v.required && <span className="text-danger ml-1">*</span>}
            </label>

            {/* text */}
            {v.type === 'text' && (
              <input
                type="text"
                value={inputs[v.name] ?? ''}
                onChange={(e) => handleChange(v.name, e.target.value)}
                required={v.required}
                placeholder={v.default_value ?? ''}
                className="w-full bg-surface-2 border border-primary/10 rounded-xl px-3 py-2.5 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition"
              />
            )}

            {/* textarea */}
            {v.type === 'textarea' && (
              <textarea
                value={inputs[v.name] ?? ''}
                onChange={(e) => handleChange(v.name, e.target.value)}
                required={v.required}
                rows={4}
                placeholder={v.default_value ?? ''}
                className="w-full bg-surface-2 border border-primary/10 rounded-xl px-3 py-2.5 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 resize-y transition"
              />
            )}

            {/* select */}
            {v.type === 'select' && v.options && (
              <select
                value={inputs[v.name] ?? ''}
                onChange={(e) => handleChange(v.name, e.target.value)}
                required={v.required}
                className="w-full bg-surface-2 border border-primary/10 rounded-xl px-3 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition"
              >
                <option value="">請選擇...</option>
                {v.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {/* multi-select → checkboxes */}
            {v.type === 'multi-select' && v.options && (
              <div className="grid grid-cols-2 gap-2">
                {v.options.map((opt) => {
                  const selected = inputs[v.name]?.split(',').includes(opt.value) ?? false;
                  return (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-2 cursor-pointer rounded-xl border px-3 py-2 text-sm transition ${
                        selected
                          ? 'border-accent/50 bg-accent/10 text-accent'
                          : 'border-primary/10 text-secondary hover:border-primary/20 hover:text-primary'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={(e) =>
                          handleMultiSelect(v.name, opt.value, e.target.checked)
                        }
                        className="rounded border-primary/20 text-accent focus:ring-accent/50"
                      />
                      {opt.label}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {/* Error banner */}
        {error && (
          <div className="bg-danger/10 border border-danger/30 text-danger rounded-xl px-4 py-3 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
        >
          {loading ? (
            <>
              <Spinner />
              AI 緊係幫你寫緊...
            </>
          ) : (
            '✨ 生成內容'
          )}
        </button>
      </form>

      {/* ── Loading overlay (optional extra feedback) ── */}
      {loading && (
        <div className="mt-6 text-center text-secondary text-sm animate-pulse">
          AI 正在分析你的品牌資料，生成 7 日內容計劃，請稍候...
        </div>
      )}

      {/* ── Results ── */}
      {result?.weekly_plan && result.weekly_plan.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary">📅 本週貼文計劃</h2>
            <span className="text-xs text-secondary bg-surface border border-primary/8 px-2.5 py-1 rounded-full">
              共 {result.weekly_plan.length} 篇
            </span>
          </div>

          <div className="space-y-4">
            {result.weekly_plan.map((post) => (
              <PostCard key={post.day} post={post} />
            ))}
          </div>

          <p className="text-xs text-secondary text-center mt-8">
            內容由 AI 生成，建議人工校對後再發佈
          </p>
        </div>
      )}
    </div>
  );
}
