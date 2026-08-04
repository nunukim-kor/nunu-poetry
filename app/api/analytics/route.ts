import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { recordPoemView, recordVisitorSession } from "@/lib/analytics";
import { isAdmin } from "@/lib/auth";
import { publishedPoem } from "@/lib/poems";

const schema = z.object({ sessionId: z.string().uuid(), poemId: z.string().min(1).max(200).optional() });

export async function POST(request: Request) {
  if (await isAdmin()) return NextResponse.json({ ok: true });
  const parsed = schema.safeParse(await request.json().catch(() => undefined));
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });

  const sessionHash = createHash("sha256").update(parsed.data.sessionId).digest("hex");
  await recordVisitorSession(sessionHash);

  if (parsed.data.poemId && await publishedPoem(parsed.data.poemId)) await recordPoemView(parsed.data.poemId);
  return NextResponse.json({ ok: true });
}
