import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/auth";
import { saveSanmoon } from "@/lib/sanmoon";

const schema = z.object({
  title: z.string().trim().min(1).max(180),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  date: z.string().date(),
  body: z.array(z.string().trim().min(1).max(30000)).min(1),
  description: z.string().trim().max(500),
  published: z.boolean(),
});

export async function POST(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "제목, 슬러그, 작성일과 본문을 확인해 주세요." }, { status: 400 });
  try {
    return NextResponse.json(await saveSanmoon(parsed.data), { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "DUPLICATE_SLUG") return NextResponse.json({ error: "이미 사용 중인 슬러그입니다." }, { status: 409 });
    throw error;
  }
}
