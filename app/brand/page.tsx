import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import type { BrandProfile } from '@/lib/workflow-types';
import BrandManager from './BrandManager';

export default async function BrandPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth');

  // Fetch user's workspaces then brand profiles
  const { data: workspaces } = await supabase
    .from('workspaces')
    .select('id')
    .eq('owner_id', user.id);

  let profiles: BrandProfile[] = [];

  if (workspaces?.length) {
    const { data } = await supabase
      .from('brand_profiles')
      .select('*')
      .in('workspace_id', workspaces.map(w => w.id))
      .order('created_at', { ascending: false });
    profiles = (data as BrandProfile[]) ?? [];
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">品牌資料庫</h1>
          <p className="text-secondary text-sm mt-1">
            儲存品牌資料，AI 生成時會自動套用，省去每次重複填寫
          </p>
        </div>

        <BrandManager initial={profiles} />
      </div>
    </AppLayout>
  );
}
