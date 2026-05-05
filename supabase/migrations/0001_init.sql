-- ThailandGPT v2 — initial schema
-- Run in Supabase SQL Editor

-- ============================================================
-- ENUMS
-- ============================================================
create type tier_t as enum ('Trusted', 'Pro', 'Elite');
create type supplier_category_t as enum ('agriculture','craft','manufacturing','seafood','textile','beverage','wellness');
create type buyer_size_t as enum ('SME','Mid-Market','Enterprise');
create type deal_status_t as enum ('opened','negotiating','agreed','verifying','paid','closed','cancelled','disputed');

-- ============================================================
-- SUPPLIERS (Thai supply side)
-- ============================================================
create table if not exists suppliers (
  id text primary key,
  name text not null,
  name_th text,
  category supplier_category_t not null,
  region text not null,
  description text,
  description_th text,

  -- 4-dimension trust signals (kept SEPARATE per user request)
  tier tier_t not null default 'Trusted',
  patrick_circle boolean not null default false,
  verified boolean not null default false,
  verified_at timestamptz,
  performance_score int not null default 75 check (performance_score between 0 and 100),
  review_count int not null default 0,
  review_avg numeric(3,2) not null default 0 check (review_avg between 0 and 5),

  -- track record
  past_deals_count int not null default 0,
  past_gmv_usd numeric(14,2) not null default 0,

  certifications text[] default array[]::text[],
  tags text[] default array[]::text[],
  hero_image_prompt text,
  created_at timestamptz default now()
);

create index if not exists idx_suppliers_category on suppliers(category);
create index if not exists idx_suppliers_tier on suppliers(tier);
create index if not exists idx_suppliers_perf on suppliers(performance_score desc);

-- ============================================================
-- BUYERS (Global demand side)
-- ============================================================
create table if not exists buyers (
  id text primary key,
  name text not null,
  country text not null,
  country_code text,
  industry text not null,
  size buyer_size_t not null default 'SME',
  contact_role text,
  description text,

  -- 4-dimension trust signals (mirror of suppliers)
  verified boolean not null default false,
  verified_at timestamptz,
  performance_score int not null default 75 check (performance_score between 0 and 100),
  review_count int not null default 0,
  review_avg numeric(3,2) not null default 0,

  past_deals_count int not null default 0,
  past_spend_usd numeric(14,2) not null default 0,
  preferred_categories supplier_category_t[],
  budget_usd_typical_min numeric(12,2),
  budget_usd_typical_max numeric(12,2),
  created_at timestamptz default now()
);

create index if not exists idx_buyers_country on buyers(country);
create index if not exists idx_buyers_industry on buyers(industry);

-- ============================================================
-- DEMANDS (Specific requests posted by buyers)
-- ============================================================
create table if not exists demands (
  id text primary key,
  buyer_id text not null references buyers(id) on delete cascade,
  title text not null,
  category supplier_category_t not null,
  quantity_text text,
  budget_usd_min numeric(12,2),
  budget_usd_max numeric(12,2),
  needed_by date,
  description text,
  status text not null default 'open',
  created_at timestamptz default now()
);

create index if not exists idx_demands_buyer on demands(buyer_id);
create index if not exists idx_demands_status on demands(status);
create index if not exists idx_demands_category on demands(category);

-- ============================================================
-- DEALS (matched supplier ↔ buyer transactions)
-- ============================================================
create table if not exists deals (
  id text primary key,
  supplier_id text not null references suppliers(id),
  buyer_id text not null references buyers(id),
  demand_id text references demands(id),
  status deal_status_t not null default 'opened',
  amount_usd numeric(14,2) not null,
  commission_rate numeric(5,4) not null default 0.04,
  -- generated commission column for reporting
  commission_usd numeric(14,2) generated always as (amount_usd * commission_rate) stored,
  notes text,
  opened_at timestamptz default now(),
  agreed_at timestamptz,
  paid_at timestamptz,
  closed_at timestamptz,
  cancelled_at timestamptz
);

create index if not exists idx_deals_supplier on deals(supplier_id);
create index if not exists idx_deals_buyer on deals(buyer_id);
create index if not exists idx_deals_status on deals(status);

-- ============================================================
-- DEAL EVENTS (timeline + chat)
-- ============================================================
create table if not exists deal_events (
  id bigserial primary key,
  deal_id text not null references deals(id) on delete cascade,
  event_type text not null,
  actor text not null,
  message text,
  payload jsonb,
  occurred_at timestamptz default now()
);

create index if not exists idx_deal_events_deal on deal_events(deal_id, occurred_at);

-- ============================================================
-- ROW LEVEL SECURITY (read-public for Stage 0.5 demo)
-- For Stage 1 we'll add proper policies; for now allow read.
-- Writes will go through service-role key from Next.js API routes.
-- ============================================================
alter table suppliers enable row level security;
alter table buyers enable row level security;
alter table demands enable row level security;
alter table deals enable row level security;
alter table deal_events enable row level security;

create policy "public read suppliers"  on suppliers   for select using (true);
create policy "public read buyers"     on buyers      for select using (true);
create policy "public read demands"    on demands     for select using (true);
create policy "public read deals"      on deals       for select using (true);
create policy "public read events"     on deal_events for select using (true);
