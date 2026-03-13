-- ── 004_user_plans.sql ────────────────────────────────────────────────────────
-- Tracks Stripe subscription state per user.
-- User's active plan is also mirrored into auth.users.user_metadata->>'plan'
-- for fast server-side reads without a DB round-trip.

create table if not exists user_plans (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  plan                text not null default 'free',   -- 'free' | 'pro' | 'enterprise'
  stripe_customer_id  text,
  stripe_subscription_id text,
  stripe_price_id     text,
  current_period_end  timestamptz,
  status              text default 'active',          -- 'active' | 'canceled' | 'past_due'
  created_at          timestamptz default now(),
  updated_at          timestamptz default now(),
  unique (user_id)
);

-- RLS: users can read their own row; only service role can write
alter table user_plans enable row level security;

create policy "user can read own plan"
  on user_plans for select
  using (auth.uid() = user_id);

-- updated_at trigger
create or replace function update_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger user_plans_updated_at
  before update on user_plans
  for each row execute function update_updated_at_column();
