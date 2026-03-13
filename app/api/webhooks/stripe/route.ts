import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// ── Stripe price → plan mapping ────────────────────────────────────────────────
// Map by buy-button product amount (cents) as fallback if price IDs aren't set.
// Prefer explicit STRIPE_PRICE_PRO / STRIPE_PRICE_ENTERPRISE env vars.
const PLAN_BY_PRICE_ID: Record<string, 'pro' | 'enterprise'> = {
  ...(process.env.STRIPE_PRICE_PRO        ? { [process.env.STRIPE_PRICE_PRO]: 'pro' }        : {}),
  ...(process.env.STRIPE_PRICE_ENTERPRISE ? { [process.env.STRIPE_PRICE_ENTERPRISE]: 'enterprise' } : {}),
};

function planFromSession(session: Stripe.Checkout.Session): 'pro' | 'enterprise' {
  // 1. Try price ID match
  const priceId = (session as any).line_items?.data?.[0]?.price?.id as string | undefined;
  if (priceId && PLAN_BY_PRICE_ID[priceId]) return PLAN_BY_PRICE_ID[priceId];

  // 2. Fallback: infer from amount_total (US$ cents)
  const cents = session.amount_total ?? 0;
  if (cents >= 5000) return 'enterprise'; // US$50
  return 'pro';                           // US$20
}

// ── Supabase admin client (service role — bypasses RLS) ───────────────────────
function adminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}

// ── Webhook handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    console.error('[stripe-webhook] STRIPE_SECRET_KEY not set');
    return NextResponse.json({ error: 'Stripe secret key not configured' }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey, { apiVersion: '2025-02-24.acacia' });

  // Verify webhook signature
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
  } catch (err: any) {
    console.error('[stripe-webhook] Signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = adminSupabase();

  // ── Handle events ────────────────────────────────────────────────────────────

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Identify user: prefer client_reference_id (Supabase user UUID),
    // fall back to customer email lookup.
    let userId: string | null = session.client_reference_id ?? null;

    if (!userId && session.customer_details?.email) {
      const { data } = await supabase.auth.admin.listUsers();
      const match = data?.users?.find(u => u.email === session.customer_details!.email);
      userId = match?.id ?? null;
    }

    if (!userId) {
      console.warn('[stripe-webhook] checkout.session.completed — could not identify user', session.id);
      return NextResponse.json({ received: true });
    }

    const plan = planFromSession(session);
    const customerId = typeof session.customer === 'string' ? session.customer : null;
    const subscriptionId = typeof session.subscription === 'string' ? session.subscription : null;

    // Fetch subscription period end if available
    let periodEnd: string | null = null;
    if (subscriptionId) {
      try {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        periodEnd = new Date((sub as any).current_period_end * 1000).toISOString();
      } catch { /* non-fatal */ }
    }

    // 1. Upsert user_plans table
    await supabase.from('user_plans').upsert({
      user_id:                userId,
      plan,
      stripe_customer_id:     customerId,
      stripe_subscription_id: subscriptionId,
      current_period_end:     periodEnd,
      status:                 'active',
    }, { onConflict: 'user_id' });

    // 2. Mirror plan into user_metadata for fast server reads
    await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { plan },
    });

    console.log(`[stripe-webhook] ✅ User ${userId} upgraded to ${plan}`);
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = typeof sub.customer === 'string' ? sub.customer : null;
    if (!customerId) return NextResponse.json({ received: true });

    // Find user by stripe_customer_id
    const { data: planRow } = await supabase
      .from('user_plans')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (planRow?.user_id) {
      await supabase.from('user_plans').update({
        plan: 'free',
        status: 'canceled',
        stripe_subscription_id: null,
        current_period_end: null,
      }).eq('user_id', planRow.user_id);

      await supabase.auth.admin.updateUserById(planRow.user_id, {
        user_metadata: { plan: 'free' },
      });

      console.log(`[stripe-webhook] ⬇️ User ${planRow.user_id} downgraded to free (subscription canceled)`);
    }
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId = typeof invoice.customer === 'string' ? invoice.customer : null;
    if (customerId) {
      await supabase.from('user_plans')
        .update({ status: 'past_due' })
        .eq('stripe_customer_id', customerId);
      console.warn(`[stripe-webhook] ⚠️ Payment failed for customer ${customerId}`);
    }
  }

  return NextResponse.json({ received: true });
}
