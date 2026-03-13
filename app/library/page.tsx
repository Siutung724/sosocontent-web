import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import LibraryView from './LibraryView';

export default async function LibraryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth');

  // Initial fetch — newest 20 executions for this user
  const { data } = await supabase
    .from('executions')
    .select('id, workflow_id, inputs, result, model, tokens_used, created_at, workflows(key, name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  const initial = data ?? [];

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary">內容庫</h1>
            <p className="text-secondary text-sm mt-1">所有 AI 生成的內容紀錄</p>
          </div>
          <span className="text-xs text-secondary bg-surface border border-primary/8 px-3 py-1 rounded-full mt-1">
            共 {initial.length}+ 條
          </span>
        </div>

        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <LibraryView initial={initial as any} />
      </div>
    </AppLayout>
  );
}
