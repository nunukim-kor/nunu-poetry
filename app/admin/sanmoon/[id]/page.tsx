import Link from "next/link";
import { notFound } from "next/navigation";
import { adminSanmoonEntry } from "@/lib/sanmoon";
import SanmoonEditor from "../sanmoon-editor";

export const dynamic = "force-dynamic";

export default async function EditSanmoonPage({ params }: { params: Promise<{ id: string }> }) {
  const essay = await adminSanmoonEntry((await params).id);
  if (!essay) notFound();
  return <main className="page pt-16 pb-24"><div className="flex max-w-[680px] items-center justify-between gap-6 text-xs"><Link href="/admin/sanmoon">← 목록</Link>{essay.published && <Link href={`/sanmoon/${essay.slug}`} target="_blank" rel="noopener noreferrer">공개 페이지 보기</Link>}</div><h1 className="book-type mb-12 mt-8 text-xl font-normal">산문 수정</h1><SanmoonEditor essay={essay} /></main>;
}
