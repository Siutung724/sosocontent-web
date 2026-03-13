import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * GET /api/executions
 * Query params:
 *   workflow_key  — filter by workflow key (e.g. "weekly_social")
 *   limit         — default 20, max 50
 *   offset        — default 0 (for pagination)
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const workflowKey = searchParams.get('workflow_key');
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50);
  const offset = parseInt(searchParams.get('offset') ?? '0');

  let query = supabase
    .from('executions')
    .select('id, workflow_id, inputs, result, model, tokens_used, created_at, workflows(key, name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (workflowKey) {
    // filter via the joined workflows table
    query = query.eq('workflows.key', workflowKey);
  }

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data ?? []);
}
