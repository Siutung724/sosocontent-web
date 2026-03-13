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
      className="text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors"
    >
      登出
    </button>
  );
}
