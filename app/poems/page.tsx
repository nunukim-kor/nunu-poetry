import Link from "next/link";
import { publishedPoems } from "@/lib/poems";
import { PoemCover } from "./poem-cover";

export const metadata = { title: "nunupoetry - poems" };
export const dynamic = "force-dynamic";

const pageSize = 4;

export default async function PoemsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const poems = await publishedPoems();
  const requestedPage = Number.parseInt((await searchParams).page ?? "1", 10);
  const pageCount = Math.max(1, Math.ceil(poems.length / pageSize));
  const currentPage = Math.min(Math.max(Number.isFinite(requestedPage) ? requestedPage : 1, 1), pageCount);
  const visiblePoems = poems.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const href = (page: number) => page === 1 ? "/poems" : `/poems?page=${page}`;

  return <main id="main-content" tabIndex={-1} className="page pt-32 pb-32">
    <h1 className="sr-only">시 목록</h1>
    <ul className="grid grid-cols-2 gap-x-6 gap-y-14 sm:grid-cols-4 sm:gap-x-8">
      {visiblePoems.map((poem) => <li key={poem.id}>
        <Link href={`/poems/${poem.id}`} className="block no-underline hover:no-underline">
          <PoemCover src={poem.coverImage} title={poem.title} />
        </Link>
        <h2 className="book-type mt-5 text-[17px] font-normal leading-relaxed"><Link href={`/poems/${poem.id}`}>{poem.title}</Link></h2>
        <time className="mt-1 block text-[12px] text-neutral-500" dateTime={poem.date}>{poem.date}</time>
      </li>)}
    </ul>
    {poems.length === 0 && <p className="book-type">아직 발표된 시가 없습니다.</p>}
    {pageCount > 1 && <nav className="mt-16 flex justify-center gap-9 text-[14px]" aria-label="시 목록 페이지 이동">
      {currentPage > 1 && <Link href={href(currentPage - 1)}>Previous</Link>}
      {currentPage < pageCount && <Link href={href(currentPage + 1)}>Next</Link>}
    </nav>}
  </main>;
}
