import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import type { Workflow } from '@/lib/workflow-types';

const WORKFLOW_ICONS: Record<string, string> = {
  weekly_social: '📅',
  brand_story: '✍️',
  product_launch: '🚀',
};

export default async function WorkflowsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('workflows')
    .select('*')
    .eq('is_active', true)
    .order('created_at');

  const workflows: Workflow[] = data ?? [];

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">內容工作坊</h1>
          <p className="text-secondary text-sm mt-1">
            選擇一個工作流程，讓 AI 幫你喺幾分鐘內生成專業內容
          </p>
        </div>

        {workflows.length === 0 ? (
          <div className="text-center py-24 text-secondary">
            <p className="text-5xl mb-4">🔧</p>
            <p className="text-base font-medium text-primary">暫時未有可用的工作流程</p>
            <p className="text-sm mt-1">請稍後再來查看</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflows.map((wf) => (
              <div
                key={wf.id}
                className="bg-surface border border-primary/8 hover:border-primary/10 rounded-2xl shadow-card flex flex-col transition-colors"
              >
                <div className="p-6 flex-1">
                  <div className="text-4xl mb-4">
                    {WORKFLOW_ICONS[wf.key] ?? '✨'}
                  </div>
                  <h2 className="text-base font-semibold text-primary mb-2 leading-snug">
                    {wf.name}
                  </h2>
                  <p className="text-secondary text-sm leading-relaxed">
                    {wf.description ?? 'AI 自動生成專業內容，節省你的時間'}
                  </p>
                </div>
                <div className="px-6 pb-6">
                  <Link
                    href={`/workflows/${wf.key}`}
                    className="block w-full text-center bg-accent hover:bg-accent/90 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm"
                  >
                    開始使用
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
