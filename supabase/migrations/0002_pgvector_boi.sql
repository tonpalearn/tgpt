-- Enable pgvector extension (must be done by superuser in Supabase dashboard first)
-- Dashboard → Database → Extensions → Search "vector" → Enable
create extension if not exists vector;

-- ─── BOI Documents Table ─────────────────────────────────────────────────────
create table if not exists boi_documents (
  id              text primary key,
  source          text not null,           -- BOI, กรมศุลกากร, DITP, etc.
  title           text not null,
  snippet         text not null,
  url             text not null,
  hs_code         text,
  year            int,
  relevant_for    text[] default '{}',
  embedding       vector(768),             -- Google text-embedding-004 (768 dims)
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Index for fast cosine similarity search
create index if not exists boi_documents_embedding_idx
  on boi_documents
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 50);

-- ─── Supplier Embeddings Table ────────────────────────────────────────────────
-- Store embeddings for supplier descriptions (used in semantic matching)
create table if not exists supplier_embeddings (
  supplier_id     text primary key references suppliers(id) on delete cascade,
  embedding       vector(768),
  embedded_text   text not null,           -- The text that was embedded (for debugging)
  updated_at      timestamptz default now()
);

create index if not exists supplier_embeddings_idx
  on supplier_embeddings
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 20);

-- ─── RPC: match_boi_documents ─────────────────────────────────────────────────
create or replace function match_boi_documents(
  query_embedding   vector(768),
  match_threshold   float    default 0.4,
  match_count       int      default 3
)
returns table (
  id            text,
  source        text,
  title         text,
  snippet       text,
  url           text,
  hs_code       text,
  year          int,
  relevant_for  text[],
  similarity    float
)
language sql stable
as $$
  select
    id, source, title, snippet, url, hs_code, year, relevant_for,
    1 - (embedding <=> query_embedding) as similarity
  from boi_documents
  where embedding is not null
    and 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;

-- ─── RPC: match_suppliers ────────────────────────────────────────────────────
create or replace function match_suppliers(
  query_embedding   vector(768),
  match_threshold   float    default 0.3,
  match_count       int      default 5
)
returns table (
  supplier_id   text,
  similarity    float
)
language sql stable
as $$
  select
    se.supplier_id,
    1 - (se.embedding <=> query_embedding) as similarity
  from supplier_embeddings se
  where se.embedding is not null
    and 1 - (se.embedding <=> query_embedding) > match_threshold
  order by se.embedding <=> query_embedding
  limit match_count;
$$;

-- ─── Updated-at trigger ───────────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger boi_documents_updated_at
  before update on boi_documents
  for each row execute procedure update_updated_at();

create trigger supplier_embeddings_updated_at
  before update on supplier_embeddings
  for each row execute procedure update_updated_at();

-- ─── RLS ─────────────────────────────────────────────────────────────────────
alter table boi_documents enable row level security;
alter table supplier_embeddings enable row level security;

-- Public read for demo (anon key)
create policy "public read boi_documents"
  on boi_documents for select using (true);

create policy "public read supplier_embeddings"
  on supplier_embeddings for select using (true);
