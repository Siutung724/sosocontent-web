import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Derive referral code from user.id (first 8 chars, uppercase)
  const referralCode = user.id.substring(0, 8).toUpperCase();

  // Fetch bonus_credits and referral count in parallel
  const [planRes, countRes] = await Promise.all([
    supabase
      .from('user_plans')
      .select('bonus_credits')
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('referrals')
      .select('id', { count: 'exact', head: true })
      .eq('referrer_id', user.id),
  ]);

  return NextResponse.json({
    referralCode,
    referralUrl: `https://sosocontent.ai?ref=${referralCode}`,
    referralCount: countRes.count ?? 0,
    bonusCredits: planRes.data?.bonus_credits ?? 0,
    bonusPerReferral: 500,
  });
}
