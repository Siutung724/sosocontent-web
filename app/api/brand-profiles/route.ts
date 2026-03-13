import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// ── GET — list all brand profiles for the current user ────────────────────────

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: workspaces } = await supabase
    .from('workspaces')
    .select('id')
    .eq('owner_id', user.id);

  if (!workspaces?.length) return NextResponse.json([]);

  const { data: profiles, error } = await supabase
    .from('brand_profiles')
    .select('*')
    .in('workspace_id', workspaces.map(w => w.id))
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(profiles ?? []);
}

// ── POST — create a new brand profile (auto-creates workspace if needed) ──────

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const name = (body.name as string)?.trim();
  if (!name) return NextResponse.json({ error: '請填寫品牌名稱' }, { status: 400 });

  // Get or auto-create default workspace
  const { data: existingWs } = await supabase
    .from('workspaces')
    .select('id')
    .eq('owner_id', user.id)
    .limit(1)
    .single();

  let workspaceId: string;

  if (existingWs) {
    workspaceId = existingWs.id;
  } else {
    const { data: newWs, error: wsErr } = await supabase
      .from('workspaces')
      .insert({ name: '我的工作區', owner_id: user.id })
      .select('id')
      .single();
    if (wsErr || !newWs) {
      return NextResponse.json({ error: '無法建立工作區' }, { status: 500 });
    }
    workspaceId = newWs.id;
  }

  const { data: profile, error } = await supabase
    .from('brand_profiles')
    .insert({
      workspace_id: workspaceId,
      name,
      description: (body.description as string) || null,
      target_audience: (body.target_audience as string) || null,
      tone: (body.tone as string) || null,
      language_style: (body.language_style as string) || null,
      banned_words: (body.banned_words as string[]) ?? [],
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(profile, { status: 201 });
}
