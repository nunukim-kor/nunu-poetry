import "server-only";
import { neon } from "@neondatabase/serverless";

export type AnalyticsStats = { enabled: boolean; sessionCount: number; poemViews: Map<string, number> };

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

export async function analyticsStats(): Promise<AnalyticsStats> {
  const query = sql();
  if (!query) return { enabled: false, sessionCount: 0, poemViews: new Map() };
  try {
    const [sessions, counts] = await Promise.all([
      query`SELECT COUNT(*)::text AS count FROM visitor_sessions`,
      query`SELECT poem_id, view_count::text AS view_count FROM poem_view_counts`,
    ]);
    return { enabled: true, sessionCount: Number(sessions[0]?.count ?? 0), poemViews: new Map(counts.map((row) => [String(row.poem_id), Number(row.view_count)])) };
  } catch {
    return { enabled: false, sessionCount: 0, poemViews: new Map() };
  }
}
