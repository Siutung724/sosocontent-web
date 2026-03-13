import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// ── PATCH — update a brand profile ───────────────────────────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

  // RLS enforces ownership — users can only update profiles in their workspaces
  const { data, error } = await supabase
    .from('brand_profiles')
    .update({
      name,
      description: (body.description as string) || null,
      target_audience: (body.target_audience as string) || null,
      tone: (body.tone as string) || null,
      language_style: (body.language_style as string) || null,
      banned_words: (body.banned_words as string[]) ?? [],
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: '找不到此品牌資料' }, { status: 404 });

  return NextResponse.json(data);
}

// ── DELETE — delete a brand profile ──────────────────────────────────────────

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { error } = await supabase
    .from('brand_profiles')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
