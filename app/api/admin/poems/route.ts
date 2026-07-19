import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/auth";
import { removePoems, savePoem } from "@/lib/poems";
const schema = z.object({ title: z.string().trim().min(1).max(180), date: z.string().date(), body: z.array(z.string().max(20000)).min(1).refine((lines) => lines.some((line) => line.trim()), "본문을 입력해 주세요."), visibility: z.enum(["public", "private"]) });
const deleteSchema = z.object({ ids: z.array(z.string().min(1)).min(1).max(500) });
export async function POST(request: Request) { if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "제목과 본문을 확인해 주세요." }, { status: 400 }); return NextResponse.json(await savePoem(parsed.data, { independent: true }), { status: 201 }); }
export async function DELETE(request: Request) { if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); const parsed = deleteSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "삭제할 시를 확인해 주세요." }, { status: 400 }); return NextResponse.json({ deleted: await removePoems(parsed.data.ids) }); }
