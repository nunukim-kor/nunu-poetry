import { NextResponse } from "next/server";
import { analyticsStats } from "@/lib/analytics";
import { isAdmin } from "@/lib/auth";
import { publishedPoems } from "@/lib/poems";

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [stats, poems] = await Promise.all([analyticsStats(), publishedPoems()]);
  const poemViews = poems.map((poem) => ({ id: poem.id, title: poem.title, viewCount: stats.poemViews.get(poem.id) ?? 0 })).sort((a, b) => b.viewCount - a.viewCount || a.title.localeCompare(b.title, "ko"));
  return NextResponse.json({ enabled: stats.enabled, sessionCount: stats.sessionCount, todaySessionCount: stats.todaySessionCount, poemViews });
}
