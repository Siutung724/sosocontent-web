import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import type { Workflow, Execution } from '@/lib/workflow-types';

const WORKFLOW_ICONS: Record<string, string> = {
  weekly_social: '📅',
  brand_story: '✍️',
  product_launch: '🚀',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('zh-HK', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth');

  const displayName =
    user.user_metadata?.full_name ?? user.user_metadata?.name ??
    user.email?.split('@')[0] ?? '用家';

  const { data: workflowData } = await supabase
    .from('workflows').select('*').eq('is_active', true).order('created_at');
  const workflows: Workflow[] = workflowData ?? [];

  const { data: execData } = await supabase
    .from('executions')
    .select('id, workflow_id, inputs, created_at, model')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  type ExecRow = Pick<Execution, 'id' | 'workflow_id' | 'inputs' | 'created_at' | 'model'>;
  const recentExecs: ExecRow[] = execData ?? [];
  const wfMap = Object.fromEntries(workflows.map(w => [w.id, w]));

  return (
    <AppLayout>
      <div className="space-y-10">

        {/* Greeting */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            你好，{displayName} 👋
          </h1>
          <p className="text-secondary text-sm mt-1">選一個工作流程，開始生成內容</p>
        </div>

        {/* Workflows */}
        <section>
          <h2 className="text-xs font-semibold text-secondary uppercase tracking-widest mb-4">工作流程</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflows.map(wf => (
              <Link key={wf.id} href={`/workflows/${wf.key}`}
                className="group bg-surface border border-primary/8 hover:border-primary/10 rounded-2xl p-5 flex items-start gap-4 transition-colors shadow-card"
              >
                <span className="text-3xl shrink-0">{WORKFLOW_ICONS[wf.key] ?? '✨'}</span>
                <div>
                  <h3 className="text-sm font-semibold text-primary group-hover:text-accent transition-colors leading-snug">
                    {wf.name}
                  </h3>
                  <p className="text-xs text-secondary mt-1 leading-relaxed line-clamp-2">
                    {wf.description ?? 'AI 自動生成專業內容'}
                  </p>
                </div>
              </Link>
            ))}
            {workflows.length === 0 && (
              <p className="col-span-3 text-center py-10 text-secondary text-sm">暫時未有可用工作流程</p>
            )}
          </div>
        </section>

        {/* Quick Links */}
        <section>
          <h2 className="text-xs font-semibold text-secondary uppercase tracking-widest mb-4">管理</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {([
              { href: '/brand',     icon: '🏷️', title: '品牌資料庫', sub: '管理品牌資料' },
              { href: '/library',   icon: '📚', title: '內容庫',     sub: '所有生成紀錄' },
              { href: '/workflows', icon: '⚡', title: '內容工作坊', sub: 'AI 工作流程'  },
            ] as const).map(({ href, icon, title, sub }) => (
              <Link key={href} href={href}
                className="bg-surface border border-primary/8 hover:border-primary/10 rounded-2xl p-4 flex items-center gap-4 transition-colors"
              >
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="text-sm font-semibold text-primary">{title}</p>
                  <p className="text-xs text-secondary mt-0.5">{sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {([
            { label: '可用 Workflow', value: String(workflows.length), sub: '持續增加中' },
            { label: '帳戶狀態', value: '免費版', sub: '升級解鎖更多功能' },
          ] as const).map(({ label, value, sub }) => (
            <div key={label} className="bg-surface border border-primary/8 rounded-2xl p-5 flex flex-col gap-1">
              <span className="text-xs text-secondary font-medium">{label}</span>
              <span className="text-xl font-bold text-primary">{value}</span>
              <span className="text-xs text-secondary">{sub}</span>
            </div>
          ))}
        </section>

        {/* Recent executions */}
        <section>
          <h2 className="text-xs font-semibold text-secondary uppercase tracking-widest mb-4">最近生成紀錄</h2>
          {recentExecs.length === 0 ? (
            <div className="bg-surface border border-primary/8 rounded-2xl p-10 text-center">
              <p className="text-4xl mb-3">📝</p>
              <p className="text-secondary text-sm">未有生成紀錄，選一個工作流程開始吧！</p>
              <Link href="/workflows" className="inline-block mt-4 text-sm text-accent hover:text-accent/80 font-medium">
                前往工作坊 →
              </Link>
            </div>
          ) : (
            <div className="bg-surface border border-primary/8 rounded-2xl overflow-hidden">
              <ul className="divide-y divide-primary/8">
                {recentExecs.map(ex => {
                  const wf = ex.workflow_id ? wfMap[ex.workflow_id] : null;
                  const preview = Object.values(ex.inputs ?? {}).filter(Boolean)[0] ?? '';
                  return (
                    <li key={ex.id} className="px-5 py-4 flex items-center gap-4">
                      <span className="text-2xl shrink-0">{wf ? (WORKFLOW_ICONS[wf.key] ?? '✨') : '📄'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-primary truncate">{wf?.name ?? '未知流程'}</p>
                        {preview && <p className="text-xs text-secondary truncate mt-0.5">{preview}</p>}
                      </div>
                      <span className="text-xs text-secondary shrink-0 hidden sm:block">{formatDate(ex.created_at)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </section>

      </div>
    </AppLayout>
  );
}
