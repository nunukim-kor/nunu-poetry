import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/auth";
import { removePoem, savePoem } from "@/lib/poems";
const coverImage = z.string().trim().max(500).refine((value) => !value || /^\/poem-covers\/[^/]+\.jpg$/i.test(value), "커버 이미지 경로를 확인해 주세요.");
const schema = z.object({ title: z.string().trim().min(1).max(180), date: z.string().date(), body: z.array(z.string().max(20000)).min(1).refine((lines) => lines.some((line) => line.trim()), "본문을 입력해 주세요."), coverImage: coverImage.optional(), visibility: z.enum(["public", "private", "book_only"]) });
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) { if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "제목과 본문을 확인해 주세요." }, { status: 400 }); return NextResponse.json(await savePoem({ ...parsed.data, id: (await params).id }, { independent: true })); }
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) { if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); await removePoem((await params).id); return new NextResponse(null, { status: 204 }); }
