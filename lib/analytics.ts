import "server-only";
import { neon } from "@neondatabase/serverless";

export type BookSessionStats = { visits: number; readingStarts: number };
export type AnalyticsStats = { enabled: boolean; sessionCount: number; todaySessionCount: number; poemViews: Map<string, number>; sanmoonViews: Map<string, number>; bookSessions: Map<string, BookSessionStats> };

function sql() {
  return process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : undefined;
}

export async function recordVisitorSession(sessionHash: string) {
  const query = sql();
  if (!query) return;
  try {
    await query`INSERT INTO visitor_sessions (session_hash) VALUES (${sessionHash}) ON CONFLICT (session_hash) DO NOTHING`;
  } catch {
    // Analytics must never interrupt reading.
  }
}

export async function recordPoemView(poemId: string) {
  const query = sql();
  if (!query) return;
  try {
    await query`INSERT INTO poem_view_counts (poem_id, view_count, updated_at) VALUES (${poemId}, 1, now()) ON CONFLICT (poem_id) DO UPDATE SET view_count = poem_view_counts.view_count + 1, updated_at = now()`;
  } catch {
    // Analytics must never interrupt reading.
  }
}

export async function recordSanmoonView(sanmoonId: string) {
  const query = sql();
  if (!query) return;
  try {
    await query`INSERT INTO sanmoon_view_counts (sanmoon_id, view_count, updated_at) VALUES (${sanmoonId}, 1, now()) ON CONFLICT (sanmoon_id) DO UPDATE SET view_count = sanmoon_view_counts.view_count + 1, updated_at = now()`;
  } catch {
    // Analytics must never interrupt reading.
  }
}

export async function recordBookSession(bookSlug: string, sessionHash: string, startedReading: boolean) {
  const query = sql();
  if (!query) return;
  try {
    await query`INSERT INTO book_session_counts (book_slug, session_hash, reading_started_at) VALUES (${bookSlug}, ${sessionHash}, ${startedReading ? new Date() : null}) ON CONFLICT (book_slug, session_hash) DO UPDATE SET reading_started_at = COALESCE(book_session_counts.reading_started_at, EXCLUDED.reading_started_at)`;
  } catch {
    // Analytics must never interrupt reading.
  }
}

export async function analyticsStats(): Promise<AnalyticsStats> {
  const query = sql();
  if (!query) return { enabled: false, sessionCount: 0, todaySessionCount: 0, poemViews: new Map(), sanmoonViews: new Map(), bookSessions: new Map() };
  try {
    const [sessions, todaySessions, counts] = await Promise.all([
      query`SELECT COUNT(*)::text AS count FROM visitor_sessions`,
      query`SELECT COUNT(*)::text AS count FROM visitor_sessions WHERE started_at >= (date_trunc('day', now() AT TIME ZONE 'Asia/Seoul') AT TIME ZONE 'Asia/Seoul')`,
      query`SELECT poem_id, view_count::text AS view_count FROM poem_view_counts`,
    ]);
    let bookSessions = new Map<string, BookSessionStats>();
    let sanmoonViews = new Map<string, number>();
    try {
      const bookCounts = await query`SELECT book_slug, COUNT(*)::text AS visits, COUNT(reading_started_at)::text AS reading_starts FROM book_session_counts GROUP BY book_slug`;
      bookSessions = new Map(bookCounts.map((row) => [String(row.book_slug), { visits: Number(row.visits), readingStarts: Number(row.reading_starts) }]));
    } catch {
      // Existing analytics remain available until the book table is initialized.
    }
    try {
      const sanmoonCounts = await query`SELECT sanmoon_id, view_count::text AS view_count FROM sanmoon_view_counts`;
      sanmoonViews = new Map(sanmoonCounts.map((row) => [String(row.sanmoon_id), Number(row.view_count)]));
    } catch {
      // Existing analytics remain available until the Sanmoon table is initialized.
    }
    return { enabled: true, sessionCount: Number(sessions[0]?.count ?? 0), todaySessionCount: Number(todaySessions[0]?.count ?? 0), poemViews: new Map(counts.map((row) => [String(row.poem_id), Number(row.view_count)])), sanmoonViews, bookSessions };
  } catch {
    return { enabled: false, sessionCount: 0, todaySessionCount: 0, poemViews: new Map(), sanmoonViews: new Map(), bookSessions: new Map() };
  }
}
