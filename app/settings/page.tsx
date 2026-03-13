import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import SettingsView from './SettingsView';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth');

  const displayName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split('@')[0] ??
    '用家';

  return (
    <AppLayout>
      <div className="space-y-8">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">設定</h1>
        <SettingsView
          email={user.email ?? ''}
          displayName={displayName}
          createdAt={user.created_at}
        />
      </div>
    </AppLayout>
  );
}
