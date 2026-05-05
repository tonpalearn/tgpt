-- Fix: Change embedding dimensions from 768 → 3072 (gemini-embedding-001)
-- Table is empty so safe to alter column directly

-- boi_documents
DROP INDEX IF EXISTS boi_documents_embedding_idx;
ALTER TABLE boi_documents DROP COLUMN IF EXISTS embedding;
ALTER TABLE boi_documents ADD COLUMN embedding vector(3072);
CREATE INDEX boi_documents_embedding_idx
  ON boi_documents
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 50);

-- supplier_embeddings
DROP INDEX IF EXISTS supplier_embeddings_idx;
ALTER TABLE supplier_embeddings DROP COLUMN IF EXISTS embedding;
ALTER TABLE supplier_embeddings ADD COLUMN embedding vector(3072);
CREATE INDEX supplier_embeddings_idx
  ON supplier_embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 20);

-- Update RPC: match_boi_documents
DROP FUNCTION IF EXISTS match_boi_documents(vector, float, int);
CREATE FUNCTION match_boi_documents(
  query_embedding   vector(3072),
  match_threshold   float    default 0.4,
  match_count       int      default 3
)
RETURNS TABLE (
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
LANGUAGE sql STABLE AS $$
  SELECT
    id, source, title, snippet, url, hs_code, year, relevant_for,
    1 - (embedding <=> query_embedding) AS similarity
  FROM boi_documents
  WHERE embedding IS NOT NULL
    AND 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Update RPC: match_suppliers
DROP FUNCTION IF EXISTS match_suppliers(vector, float, int);
CREATE FUNCTION match_suppliers(
  query_embedding   vector(3072),
  match_threshold   float    default 0.3,
  match_count       int      default 5
)
RETURNS TABLE (
  supplier_id   text,
  similarity    float
)
LANGUAGE sql STABLE AS $$
  SELECT
    se.supplier_id,
    1 - (se.embedding <=> query_embedding) AS similarity
  FROM supplier_embeddings se
  WHERE se.embedding IS NOT NULL
    AND 1 - (se.embedding <=> query_embedding) > match_threshold
  ORDER BY se.embedding <=> query_embedding
  LIMIT match_count;
$$;
