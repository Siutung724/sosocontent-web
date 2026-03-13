'use client';

import type { ToastType } from '@/providers/ToastProvider';

interface ToastProps {
  type: ToastType;
  message: string;
  onDismiss: () => void;
}

export default function Toast({ type, message, onDismiss }: ToastProps) {
  const isSuccess = type === 'success';

  return (
    <div
      className="pointer-events-auto flex items-start gap-3 bg-surface border border-primary/10 rounded-xl px-4 py-3 shadow-toast min-w-[260px] max-w-xs animate-in fade-in slide-in-from-bottom-2"
      role="alert"
    >
      {/* Colour bar */}
      <div
        className={`shrink-0 w-1 self-stretch rounded-full ${
          isSuccess ? 'bg-success' : 'bg-danger'
        }`}
      />

      {/* Icon + message */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-primary leading-snug">
          {isSuccess ? '✓ ' : '⚠ '}
          {message}
        </p>
      </div>

      {/* Dismiss */}
      <button
        onClick={onDismiss}
        className="shrink-0 text-secondary hover:text-primary transition-colors text-lg leading-none mt-px"
        aria-label="關閉"
      >
        ×
      </button>
    </div>
  );
}
