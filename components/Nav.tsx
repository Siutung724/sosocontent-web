import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import NavLinks from './NavLinks';

export default async function Nav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const email = user?.email ?? '';
  const displayName =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    email.split('@')[0] ??
    '';

  return (
    <header className="sticky top-0 z-40 bg-body/90 backdrop-blur-md border-b border-primary/10">
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12 h-14 flex items-center justify-between gap-6">

        {/* Left: Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 shrink-0 group"
        >
          {/* Minimal icon: speech-bubble style */}
          <svg
            width="18" height="18" viewBox="0 0 18 18" fill="none"
            className="text-accent"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="1" y="1" width="16" height="12" rx="3" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M4 17 L4 14 L8 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="5.5" cy="7" r="1" fill="currentColor"/>
            <circle cx="9" cy="7" r="1" fill="currentColor"/>
            <circle cx="12.5" cy="7" r="1" fill="currentColor"/>
          </svg>
          {/* TODO: replace font-sans with Gunter when available */}
          <span className="text-base font-bold tracking-tight text-primary group-hover:opacity-80 transition-opacity">
            sosocontent
          </span>
        </Link>

        {/* Right: nav links + user (Client Component for pathname + sign-out) */}
        <div className="flex items-center gap-2 flex-1 justify-between">
          <NavLinks email={email} displayName={displayName} />
        </div>

      </div>
    </header>
  );
}
