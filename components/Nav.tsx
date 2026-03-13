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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="sosocontent" className="h-7 w-7 object-contain" />
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
