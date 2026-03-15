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

  const plan = (user.user_metadata?.plan as string | undefined) ?? 'free';

  const { data: planRow } = await supabase
    .from('user_plans')
    .select('bonus_credits')
    .eq('user_id', user.id)
    .single();
  const bonusCredits = planRow?.bonus_credits ?? 0;

  return (
    <AppLayout>
      <div className="space-y-8">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">設定</h1>
        <SettingsView
          email={user.email ?? ''}
          displayName={displayName}
          createdAt={user.created_at}
          plan={plan}
          bonusCredits={bonusCredits}
        />
      </div>
    </AppLayout>
  );
}
