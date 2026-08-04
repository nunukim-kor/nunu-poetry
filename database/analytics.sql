CREATE TABLE IF NOT EXISTS visitor_sessions (
  session_hash TEXT PRIMARY KEY,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS poem_view_counts (
  poem_id TEXT PRIMARY KEY,
  view_count BIGINT NOT NULL DEFAULT 0 CHECK (view_count >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
