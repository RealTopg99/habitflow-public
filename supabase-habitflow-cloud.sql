-- HabitFlow cloud sync for Clerk + Supabase
-- Run this once in Supabase SQL Editor after enabling Clerk as a Third-Party Auth provider.

create table if not exists public.habitflow_user_data (
  user_id text primary key default (auth.jwt()->>'sub'),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.habitflow_user_data enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'habitflow_user_data'
  ) then
    alter publication supabase_realtime add table public.habitflow_user_data;
  end if;
end;
$$;

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

-- Daily widgets are stored separately from the large application document so
-- each device can update them immediately and receive Realtime changes.
create table if not exists public.habitflow_widget_state (
  id uuid primary key default gen_random_uuid(),
  user_id text not null default (auth.jwt()->>'sub'),
  widget_key text not null check (widget_key in ('hydration', 'brushing')),
  state jsonb not null default '{}'::jsonb,
  mutation_id uuid not null,
  device_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null,
  unique (user_id, widget_key)
);

create index if not exists habitflow_widget_state_user_updated_idx
on public.habitflow_widget_state (user_id, updated_at desc);

alter table public.habitflow_widget_state enable row level security;

drop policy if exists "habitflow_select_own_widget_state" on public.habitflow_widget_state;
drop policy if exists "habitflow_insert_own_widget_state" on public.habitflow_widget_state;
drop policy if exists "habitflow_update_own_widget_state" on public.habitflow_widget_state;
drop policy if exists "habitflow_delete_own_widget_state" on public.habitflow_widget_state;

create policy "habitflow_select_own_widget_state"
on public.habitflow_widget_state for select to anon, authenticated
using ((select auth.jwt()->>'sub') = user_id);

create policy "habitflow_insert_own_widget_state"
on public.habitflow_widget_state for insert to anon, authenticated
with check ((select auth.jwt()->>'sub') = user_id);

create policy "habitflow_update_own_widget_state"
on public.habitflow_widget_state for update to anon, authenticated
using ((select auth.jwt()->>'sub') = user_id)
with check ((select auth.jwt()->>'sub') = user_id);

create policy "habitflow_delete_own_widget_state"
on public.habitflow_widget_state for delete to anon, authenticated
using ((select auth.jwt()->>'sub') = user_id);

create table if not exists public.habitflow_widget_mutations (
  mutation_id uuid primary key,
  user_id text not null default (auth.jwt()->>'sub'),
  widget_key text not null check (widget_key in ('hydration', 'brushing')),
  device_id text not null,
  updated_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists habitflow_widget_mutations_user_created_idx
on public.habitflow_widget_mutations (user_id, created_at desc);

alter table public.habitflow_widget_mutations enable row level security;

drop policy if exists "habitflow_select_own_widget_mutations" on public.habitflow_widget_mutations;
drop policy if exists "habitflow_insert_own_widget_mutations" on public.habitflow_widget_mutations;

create policy "habitflow_select_own_widget_mutations"
on public.habitflow_widget_mutations for select to anon, authenticated
using ((select auth.jwt()->>'sub') = user_id);

create policy "habitflow_insert_own_widget_mutations"
on public.habitflow_widget_mutations for insert to anon, authenticated
with check ((select auth.jwt()->>'sub') = user_id);

create or replace function public.habitflow_apply_widget_mutation(
  p_widget_key text,
  p_state jsonb,
  p_updated_at timestamptz,
  p_mutation_id uuid,
  p_device_id text
)
returns table (
  id uuid,
  widget_key text,
  state jsonb,
  updated_at timestamptz,
  mutation_id uuid,
  device_id text
)
language plpgsql
set search_path = public
as $$
declare
  v_user_id text := auth.jwt()->>'sub';
  v_inserted integer := 0;
begin
  if v_user_id is null or v_user_id = '' then
    raise exception 'Authentication required';
  end if;
  if p_widget_key not in ('hydration', 'brushing') then
    raise exception 'Unsupported widget key';
  end if;

  insert into public.habitflow_widget_mutations (
    mutation_id, user_id, widget_key, device_id, updated_at
  ) values (
    p_mutation_id, v_user_id, p_widget_key, p_device_id, p_updated_at
  )
  on conflict on constraint habitflow_widget_mutations_pkey do nothing;
  get diagnostics v_inserted = row_count;

  if v_inserted > 0 then
    insert into public.habitflow_widget_state (
      user_id, widget_key, state, mutation_id, device_id, updated_at
    ) values (
      v_user_id, p_widget_key, p_state, p_mutation_id, p_device_id, p_updated_at
    )
    on conflict on constraint habitflow_widget_state_user_id_widget_key_key do update
    set state = excluded.state,
        mutation_id = excluded.mutation_id,
        device_id = excluded.device_id,
        updated_at = excluded.updated_at
    where excluded.updated_at > habitflow_widget_state.updated_at
       or (
         excluded.updated_at = habitflow_widget_state.updated_at
         and excluded.mutation_id::text > habitflow_widget_state.mutation_id::text
       );
  end if;

  return query
  select ws.id, ws.widget_key, ws.state, ws.updated_at, ws.mutation_id, ws.device_id
  from public.habitflow_widget_state ws
  where ws.user_id = v_user_id and ws.widget_key = p_widget_key;
end;
$$;

grant execute on function public.habitflow_apply_widget_mutation(text, jsonb, timestamptz, uuid, text)
to anon, authenticated;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'habitflow_widget_state'
  ) then
    alter publication supabase_realtime add table public.habitflow_widget_state;
  end if;
end;
$$;

create table if not exists public.habitflow_push_subscriptions (
  endpoint text primary key,
  user_id text not null default (auth.jwt()->>'sub'),
  subscription jsonb not null,
  device_id text,
  device_name text,
  platform text,
  timezone text,
  user_agent text,
  enabled boolean not null default true,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

alter table public.habitflow_push_subscriptions add column if not exists device_id text;
alter table public.habitflow_push_subscriptions add column if not exists device_name text;
alter table public.habitflow_push_subscriptions add column if not exists platform text;
alter table public.habitflow_push_subscriptions add column if not exists timezone text;
alter table public.habitflow_push_subscriptions add column if not exists active boolean not null default true;

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
