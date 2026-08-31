import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { recordBookSession, recordPoemView, recordVisitorSession } from "@/lib/analytics";
import { isAdmin } from "@/lib/auth";
import { publishedBook } from "@/lib/books";
import { publishedPoem } from "@/lib/poems";

const schema = z.object({ sessionId: z.string().uuid(), poemId: z.string().min(1).max(200).optional(), bookSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(), bookEvent: z.enum(["visit", "read"]).optional() });

export async function POST(request: Request) {
  if (await isAdmin()) return NextResponse.json({ ok: true });
  const parsed = schema.safeParse(await request.json().catch(() => undefined));
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });

  const sessionHash = createHash("sha256").update(parsed.data.sessionId).digest("hex");
  await recordVisitorSession(sessionHash);

  if (parsed.data.poemId && await publishedPoem(parsed.data.poemId)) await recordPoemView(parsed.data.poemId);
  if (parsed.data.bookSlug && parsed.data.bookEvent && await publishedBook(parsed.data.bookSlug)) await recordBookSession(parsed.data.bookSlug, sessionHash, parsed.data.bookEvent === "read");
  return NextResponse.json({ ok: true });
}
