import { NextResponse } from "next/server";
import { z } from "zod";
import { adminCookie, createSession } from "@/lib/auth";
export async function POST(request: Request) { const parsed = z.object({ password: z.string().min(1) }).safeParse(await request.json()); if (!parsed.success || !process.env.ADMIN_PASSWORD || parsed.data.password !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 }); const response = NextResponse.json({ ok: true }); response.cookies.set(adminCookie(await createSession())); return response; }
