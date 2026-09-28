import Link from "next/link";
import { publishedSanmoon } from "@/lib/sanmoon";

export const dynamic = "force-dynamic";

export default async function SanmoonPage() {
  const essays = await publishedSanmoon();
  return <main id="main-content" tabIndex={-1} className="page pt-32 pb-32">
    <h1 className="sr-only">산문 목록</h1>
    <ul className="max-w-[680px]">
      {essays.map((essay) => <li key={essay.id}><Link href={`/sanmoon/${essay.slug}`} className="grid grid-cols-[1fr_auto] gap-8 py-7 no-underline hover:no-underline"><span className="book-type text-[19px] leading-relaxed">{essay.title}</span><time className="pt-1.5 text-[12px] text-neutral-500" dateTime={essay.date}>{essay.date}</time></Link></li>)}
    </ul>
    {essays.length === 0 && <p className="book-type">아직 공개된 산문이 없습니다.</p>}
  </main>;
}
