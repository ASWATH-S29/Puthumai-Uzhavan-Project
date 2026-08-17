-- ================================================================
-- Migration: Farmer Memory, Alerts, Scheme Info
-- Puthumai Uzhavan v2.0
-- ================================================================

-- ── 1. farmer_memory ─────────────────────────────────────────────
-- Stores structured farming data per authenticated farmer
create table if not exists public.farmer_memory (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  -- Identity / location
  farmer_name     text,
  village         text,
  district        text,
  state           text default 'Tamil Nadu',
  -- Farm info
  farm_size_acres numeric(10,2),
  soil_type       text,          -- red, black, alluvial, laterite
  irrigation_method text,        -- drip, sprinkler, flood, rain-fed
  -- Current season
  current_crop    text,
  crop_variety    text,
  crop_stage      text,          -- sowing, vegetative, flowering, harvesting
  planting_date   date,
  expected_harvest date,
  -- History
  previous_crop   text,
  previous_yield_kg numeric(10,2),
  -- Preferences
  preferred_language text default 'en',
  farming_category  text,        -- small, marginal, medium, large
  -- Free-form notes
  extra_notes     text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  unique(user_id)
);

-- RLS
alter table public.farmer_memory enable row level security;

create policy "farmer_memory_owner_select" on public.farmer_memory
  for select using (auth.uid() = user_id);
create policy "farmer_memory_owner_insert" on public.farmer_memory
  for insert with check (auth.uid() = user_id);
create policy "farmer_memory_owner_update" on public.farmer_memory
  for update using (auth.uid() = user_id);
create policy "farmer_memory_owner_delete" on public.farmer_memory
  for delete using (auth.uid() = user_id);

-- auto-updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger farmer_memory_updated_at
  before update on public.farmer_memory
  for each row execute procedure public.set_updated_at();

-- ── 2. ai_conversations ──────────────────────────────────────────
-- Persists chat history for farm-aware AI
create table if not exists public.ai_conversations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null check (role in ('user','assistant')),
  message    text not null,
  context    jsonb,            -- optional: crop/weather snapshot at time of message
  created_at timestamptz default now()
);

create index if not exists ai_conversations_user_created
  on public.ai_conversations(user_id, created_at desc);

alter table public.ai_conversations enable row level security;

create policy "ai_conv_owner_select" on public.ai_conversations
  for select using (auth.uid() = user_id);
create policy "ai_conv_owner_insert" on public.ai_conversations
  for insert with check (auth.uid() = user_id);
create policy "ai_conv_owner_delete" on public.ai_conversations
  for delete using (auth.uid() = user_id);

-- ── 3. farmer_alerts ─────────────────────────────────────────────
-- Smart farming alerts / reminders
create table if not exists public.farmer_alerts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  detail      text,
  alert_type  text not null check (alert_type in ('weather','crop','irrigation','scheme','reminder','health','ai')),
  severity    text default 'info' check (severity in ('info','warning','critical')),
  is_read     boolean default false,
  is_live     boolean default false,  -- false = AI/static reminder, true = live data
  created_at  timestamptz default now()
);

create index if not exists farmer_alerts_user_created
  on public.farmer_alerts(user_id, created_at desc);

alter table public.farmer_alerts enable row level security;

create policy "alerts_owner_select" on public.farmer_alerts
  for select using (auth.uid() = user_id);
create policy "alerts_owner_insert" on public.farmer_alerts
  for insert with check (auth.uid() = user_id);
create policy "alerts_owner_update" on public.farmer_alerts
  for update using (auth.uid() = user_id);
create policy "alerts_owner_delete" on public.farmer_alerts
  for delete using (auth.uid() = user_id);
