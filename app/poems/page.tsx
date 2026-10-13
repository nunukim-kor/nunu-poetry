import Link from "next/link";
import { publishedPoems } from "@/lib/poems";

export const metadata = { title: "nunupoetry - poems" };
export const dynamic = "force-dynamic";

const pageSize = 5;

export default async function PoemsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const poems = await publishedPoems();
  const requestedPage = Number.parseInt((await searchParams).page ?? "1", 10);
  const pageCount = Math.max(1, Math.ceil(poems.length / pageSize));
  const currentPage = Math.min(Math.max(Number.isFinite(requestedPage) ? requestedPage : 1, 1), pageCount);
  const visiblePoems = poems.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const href = (page: number) => page === 1 ? "/poems" : `/poems?page=${page}`;

  return <main id="main-content" tabIndex={-1} className="page pt-32 pb-32">
    <h1 className="sr-only">시 목록</h1>
    <ul className="max-w-[680px]">
      {visiblePoems.map((poem) => <li key={poem.id}><Link href={`/poems/${poem.id}`} className="grid grid-cols-[1fr_auto] gap-8 py-7 no-underline hover:no-underline"><span className="book-type text-[19px] leading-relaxed">{poem.title}</span><time className="pt-1.5 text-[12px] text-neutral-500" dateTime={poem.date}>{poem.date}</time></Link></li>)}
    </ul>
    {poems.length === 0 && <p className="book-type">아직 발표된 시가 없습니다.</p>}
    {pageCount > 1 && <nav className="mt-12 flex max-w-[680px] justify-center gap-9 text-[14px]" aria-label="시 목록 페이지 이동">
      {currentPage > 1 && <Link href={href(currentPage - 1)}>Previous</Link>}
      {currentPage < pageCount && <Link href={href(currentPage + 1)}>Next</Link>}
    </nav>}
  </main>;
}
