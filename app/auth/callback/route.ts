import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Handles both Google OAuth and Email Magic Link callbacks from Supabase.
 * Supabase redirects here with ?code=... after the user authenticates.
 * Also: ensures user_plans row exists and applies referral code if present.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/workflows';

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && sessionData?.user) {
      const userId = sessionData.user.id;

      // Ensure user_plans row exists (creates with plan='free' + referral_code if new)
      await supabase.rpc('ensure_user_plan', { p_user_id: userId });

      // Apply referral code if one was stored in cookie
      const refCode = cookieStore.get('soso_ref')?.value;
      if (refCode) {
        await supabase.rpc('apply_referral', { p_code: refCode, p_referee_id: userId });
        // Clear the cookie regardless of result
        cookieStore.set('soso_ref', '', { path: '/', maxAge: 0 });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error('[auth/callback] error:', error?.message);
  }

  return NextResponse.redirect(`${origin}/auth?error=auth_failed`);
}
