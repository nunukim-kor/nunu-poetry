import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/auth";
import { saveAbout } from "@/lib/about";

const schema = z.object({ body: z.string().trim().min(1).max(20000) });

export async function PATCH(request: Request) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "소개 내용을 확인해 주세요." }, { status: 400 });
  }

  return NextResponse.json(await saveAbout(parsed.data.body));
}
