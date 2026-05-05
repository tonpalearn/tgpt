-- Search query log — tracks every search for acquisition intelligence
-- Patrick uses this to identify high-demand categories where supply is missing

create table if not exists search_queries (
  id                  uuid primary key default gen_random_uuid(),
  query_text          text not null,
  side                text not null default 'demand',  -- 'demand' (buyer searching supply) or 'supply' (supplier searching buyer)
  parsed_category     text,
  parsed_product      text,
  parsed_destination  text,
  parsed_quantity     text,
  language            text,
  matched_count       int default 0,
  top_confidence      numeric,
  no_match            boolean default false,
  meta                jsonb default '{}'::jsonb,
  created_at          timestamptz default now()
);

create index if not exists search_queries_no_match_idx on search_queries (no_match, created_at desc);
create index if not exists search_queries_category_idx on search_queries (parsed_category, no_match);

-- Aggregated view: acquisition targets for Patrick
-- Shows which (category, product, destination) combinations are searched but unfilled
create or replace view acquisition_targets as
select
  parsed_category,
  parsed_product,
  parsed_destination,
  count(*)                            as search_count,
  count(*) filter (where no_match)    as no_match_count,
  round(avg(top_confidence)::numeric, 2) as avg_top_confidence,
  max(created_at)                     as last_searched,
  array_agg(distinct query_text order by query_text)[1:5] as sample_queries
from search_queries
where parsed_category is not null
group by parsed_category, parsed_product, parsed_destination
having count(*) filter (where no_match) > 0
order by no_match_count desc, search_count desc;

-- RLS — public can insert + read aggregates
alter table search_queries enable row level security;

create policy "public insert search_queries"
  on search_queries for insert with check (true);

create policy "public read search_queries"
  on search_queries for select using (true);
