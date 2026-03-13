'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';

export default function SignOutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-xs border border-primary/10 hover:bg-primary/8 text-secondary hover:text-primary px-3 py-1.5 rounded-full transition-colors"
    >
      登出
    </button>
  );
}
