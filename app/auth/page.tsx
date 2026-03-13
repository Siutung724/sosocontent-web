'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';

type AuthView = 'login' | 'magic_link_sent';

export default function AuthPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();

  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingMagic, setLoadingMagic] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Show error if redirected back from callback with ?error=auth_failed
  useEffect(() => {
    if (searchParams.get('error') === 'auth_failed') {
      setError('登入失敗，請再試一次');
    }
  }, [searchParams]);

  // ── Google OAuth ──────────────────────────────────────────────────────────

  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/workflows`,
      },
    });
    if (error) {
      setError(error.message);
      setLoadingGoogle(false);
    }
    // On success, browser will redirect — no need to setLoading(false)
  };

  // ── Email Magic Link ──────────────────────────────────────────────────────

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoadingMagic(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/workflows`,
      },
    });

    setLoadingMagic(false);

    if (error) {
      setError(error.message);
    } else {
      setView('magic_link_sent');
    }
  };

  // ── Render: Magic Link Sent ───────────────────────────────────────────────

  if (view === 'magic_link_sent') {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="text-5xl mb-4">📬</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">電郵已發送！</h2>
          <p className="text-gray-500 text-sm mb-1">
            我哋已將登入連結發送至
          </p>
          <p className="text-indigo-600 font-medium text-sm mb-6">{email}</p>
          <p className="text-gray-400 text-xs leading-relaxed">
            請查看你的電子郵件並點擊連結完成登入。
            <br />連結有效期為 1 小時。
          </p>
          <button
            onClick={() => { setView('login'); setEmail(''); }}
            className="mt-6 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← 返回重新輸入
          </button>
        </div>
      </main>
    );
  }

  // ── Render: Login Form ────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">

        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-indigo-600 mb-1">sosocontent.ai</h1>
          <p className="text-gray-500 text-sm">香港中小企 AI 內容助理</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 text-center">
            登入 / 建立帳戶
          </h2>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-5">
              ⚠️ {error}
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loadingGoogle}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors duration-150 mb-5 disabled:opacity-50"
          >
            {loadingGoogle ? (
              <Spinner />
            ) : (
              <GoogleIcon />
            )}
            {loadingGoogle ? '跳轉中...' : '用 Google 帳戶登入'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">或用電郵</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Magic Link Form */}
          <form onSubmit={handleMagicLink} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                電子郵件地址
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
            <button
              type="submit"
              disabled={loadingMagic || !email.trim()}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-150 text-sm"
            >
              {loadingMagic ? (
                <>
                  <Spinner className="text-white" />
                  發送中...
                </>
              ) : (
                '發送登入連結 ✉️'
              )}
            </button>
          </form>

          {/* Terms */}
          <p className="text-xs text-gray-400 text-center mt-6 leading-relaxed">
            登入即代表你同意我們的
            <span className="text-gray-500"> 服務條款 </span>及
            <span className="text-gray-500"> 私隱政策</span>。
          </p>
        </div>

        {/* Back to home */}
        <p className="text-center mt-5">
          <a href="/" className="text-sm text-gray-400 hover:text-gray-600">
            ← 返回首頁
          </a>
        </p>
      </div>
    </main>
  );
}

// ── Small UI helpers ──────────────────────────────────────────────────────────

function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`animate-spin h-4 w-4 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}
