-- HabitFlow cloud sync for Clerk + Supabase
-- Run this once in Supabase SQL Editor after enabling Clerk as a Third-Party Auth provider.

create table if not exists public.habitflow_user_data (
  user_id text primary key default (auth.jwt()->>'sub'),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.habitflow_user_data enable row level security;

drop policy if exists "habitflow_select_own_data" on public.habitflow_user_data;
drop policy if exists "habitflow_insert_own_data" on public.habitflow_user_data;
drop policy if exists "habitflow_update_own_data" on public.habitflow_user_data;
drop policy if exists "habitflow_delete_own_data" on public.habitflow_user_data;

create policy "habitflow_select_own_data"
on public.habitflow_user_data
for select
to anon, authenticated
using ((select auth.jwt()->>'sub') = user_id);

create policy "habitflow_insert_own_data"
on public.habitflow_user_data
for insert
to anon, authenticated
with check ((select auth.jwt()->>'sub') = user_id);

create policy "habitflow_update_own_data"
on public.habitflow_user_data
for update
to anon, authenticated
using ((select auth.jwt()->>'sub') = user_id)
with check ((select auth.jwt()->>'sub') = user_id);

create policy "habitflow_delete_own_data"
on public.habitflow_user_data
for delete
to anon, authenticated
using ((select auth.jwt()->>'sub') = user_id);

create or replace function public.set_habitflow_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_habitflow_updated_at on public.habitflow_user_data;

create trigger set_habitflow_updated_at
before update on public.habitflow_user_data
for each row
execute function public.set_habitflow_updated_at();

create table if not exists public.habitflow_push_subscriptions (
  endpoint text primary key,
  user_id text not null default (auth.jwt()->>'sub'),
  subscription jsonb not null,
  user_agent text,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index if not exists habitflow_push_subscriptions_user_id_idx
on public.habitflow_push_subscriptions (user_id);

alter table public.habitflow_push_subscriptions enable row level security;

drop policy if exists "habitflow_select_own_push_subscriptions" on public.habitflow_push_subscriptions;
drop policy if exists "habitflow_insert_own_push_subscriptions" on public.habitflow_push_subscriptions;
drop policy if exists "habitflow_update_own_push_subscriptions" on public.habitflow_push_subscriptions;
drop policy if exists "habitflow_delete_own_push_subscriptions" on public.habitflow_push_subscriptions;

create policy "habitflow_select_own_push_subscriptions"
on public.habitflow_push_subscriptions
for select
to anon, authenticated
using ((select auth.jwt()->>'sub') = user_id);

create policy "habitflow_insert_own_push_subscriptions"
on public.habitflow_push_subscriptions
for insert
to anon, authenticated
with check ((select auth.jwt()->>'sub') = user_id);

create policy "habitflow_update_own_push_subscriptions"
on public.habitflow_push_subscriptions
for update
to anon, authenticated
using ((select auth.jwt()->>'sub') = user_id)
with check ((select auth.jwt()->>'sub') = user_id);

create policy "habitflow_delete_own_push_subscriptions"
on public.habitflow_push_subscriptions
for delete
to anon, authenticated
using ((select auth.jwt()->>'sub') = user_id);

drop trigger if exists set_habitflow_push_subscriptions_updated_at on public.habitflow_push_subscriptions;

create trigger set_habitflow_push_subscriptions_updated_at
before update on public.habitflow_push_subscriptions
for each row
execute function public.set_habitflow_updated_at();

create table if not exists public.habitflow_push_deliveries (
  delivery_key text primary key,
  user_id text not null,
  created_at timestamptz not null default now()
);

create index if not exists habitflow_push_deliveries_created_at_idx
on public.habitflow_push_deliveries (created_at);

-- Private audit log for notifications sent from the creator panel.
-- RLS is enabled without client policies: only the server-side service role can read or write it.
create table if not exists public.habitflow_creator_messages (
  id uuid primary key,
  creator_user_id text not null,
  audience text not null check (audience in ('all', 'selected')),
  target_user_ids jsonb not null default '[]'::jsonb,
  title text not null,
  body text not null,
  target_view text not null default 'dashboard',
  sent_count integer not null default 0,
  failed_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists habitflow_creator_messages_created_at_idx
on public.habitflow_creator_messages (created_at desc);

alter table public.habitflow_creator_messages enable row level security;
