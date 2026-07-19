import Link from "next/link";
import { publishedPoems } from "@/lib/poems";
export const dynamic = "force-dynamic";
export default async function PoemsPage() { const poems = await publishedPoems(); return <main id="main-content" tabIndex={-1} className="page pt-32 pb-32"><h1 className="sr-only">시 목록</h1><ul className="max-w-[680px]">{poems.map((poem) => <li key={poem.id}><Link href={`/poems/${poem.id}`} className="grid grid-cols-[1fr_auto] gap-8 py-7 no-underline hover:no-underline"><span className="book-type text-[19px] leading-relaxed">{poem.title}</span><time className="pt-1.5 text-[12px] text-neutral-500" dateTime={poem.date}>{poem.date}</time></Link></li>)}</ul>{poems.length === 0 && <p className="book-type">아직 발표된 시가 없습니다.</p>}</main>; }
