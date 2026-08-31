import { NextResponse } from "next/server";
import { analyticsStats } from "@/lib/analytics";
import { isAdmin } from "@/lib/auth";
import { publishedBooks } from "@/lib/books";
import { publishedPoems } from "@/lib/poems";

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [stats, poems, books] = await Promise.all([analyticsStats(), publishedPoems(), publishedBooks()]);
  const poemViews = poems.map((poem) => ({ id: poem.id, title: poem.title, viewCount: stats.poemViews.get(poem.id) ?? 0 })).sort((a, b) => b.viewCount - a.viewCount || a.title.localeCompare(b.title, "ko"));
  const bookSessions = books.map((book) => ({ slug: book.slug, title: book.title, ...(stats.bookSessions.get(book.slug) ?? { visits: 0, readingStarts: 0 }) })).sort((a, b) => b.visits - a.visits || a.title.localeCompare(b.title, "ko"));
  return NextResponse.json({ enabled: stats.enabled, sessionCount: stats.sessionCount, todaySessionCount: stats.todaySessionCount, poemViews, bookSessions });
}
