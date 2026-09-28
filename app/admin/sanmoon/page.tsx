import Link from "next/link";
import { adminSanmoon } from "@/lib/sanmoon";

export const dynamic = "force-dynamic";

export default async function AdminSanmoonPage() {
  const essays = await adminSanmoon();
  return <main className="page pt-16 pb-24">
    <div className="flex max-w-[760px] items-center justify-between gap-6"><Link href="/admin" className="text-xs">← 관리</Link><Link href="/admin/sanmoon/new" className="text-xs">새 산문</Link></div>
    <h1 className="book-type mb-12 mt-8 text-xl font-normal">Sanmoon 관리</h1>
    <ul className="max-w-[760px]">
      {essays.map((essay) => <li key={essay.id}><Link href={`/admin/sanmoon/${essay.id}`} className="grid grid-cols-[1fr_auto] gap-8 py-5 no-underline hover:no-underline"><span>{essay.title}<span className="ml-3 text-xs text-neutral-400">{essay.published ? "공개" : "비공개"}</span></span><time className="text-xs text-neutral-500" dateTime={essay.date}>{essay.date}</time></Link></li>)}
    </ul>
    {essays.length === 0 && <p className="text-sm text-neutral-500">등록된 산문이 없습니다.</p>}
  </main>;
}
