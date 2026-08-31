CREATE TABLE IF NOT EXISTS visitor_sessions (
  session_hash TEXT PRIMARY KEY,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS poem_view_counts (
  poem_id TEXT PRIMARY KEY,
  view_count BIGINT NOT NULL DEFAULT 0 CHECK (view_count >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS book_session_counts (
  book_slug TEXT NOT NULL,
  session_hash TEXT NOT NULL,
  visited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reading_started_at TIMESTAMPTZ,
  PRIMARY KEY (book_slug, session_hash)
);
