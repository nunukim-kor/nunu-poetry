CREATE TABLE IF NOT EXISTS sanmoon_view_counts (
  sanmoon_id TEXT PRIMARY KEY,
  view_count BIGINT NOT NULL DEFAULT 0 CHECK (view_count >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
