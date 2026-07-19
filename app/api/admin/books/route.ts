import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/auth";
import { saveBookWithPoems } from "@/lib/books";
const newPoemSchema = z.object({ title: z.string().trim().min(1).max(180), body: z.array(z.string().max(20000)).min(1).refine((lines) => lines.some((line) => line.trim())) });
const schema = z.object({ title: z.string().trim().min(1).max(180), slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), description: z.string().max(4000).optional(), cover: z.string().max(1000).optional(), published: z.boolean(), poemIds: z.array(z.string()).max(500), newPoems: z.array(newPoemSchema).max(100).default([]) });
export async function POST(request: Request) { if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "책과 새 시 내용을 확인해 주세요." }, { status: 400 }); const { newPoems, ...book } = parsed.data; try { return NextResponse.json(await saveBookWithPoems(book, newPoems), { status: 201 }); } catch (error) { if (error instanceof Error && error.message === "DUPLICATE_SLUG") return NextResponse.json({ error: "이미 사용 중인 slug입니다." }, { status: 409 }); throw error; } }
