import Link from "next/link";
import { analyticsStats } from "@/lib/analytics";
import { adminBooks, poemBookMemberships } from "@/lib/books";
import { adminPoems } from "@/lib/poems";
import { adminSanmoon } from "@/lib/sanmoon";
import LogoutButton from "./logout-button";
import PoemList from "./poem-list";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [poems, books, sanmoon, memberships, stats] = await Promise.all([adminPoems(), adminBooks(), adminSanmoon(), poemBookMemberships(), analyticsStats()]);
  const publicPoemViews = poems.filter((poem) => poem.visibility === "public").map((poem) => ({ id: poem.id, title: poem.title, viewCount: stats.poemViews.get(poem.id) ?? 0 })).sort((a, b) => b.viewCount - a.viewCount || a.title.localeCompare(b.title, "ko"));
  const publicBookSessions = books.filter((book) => book.published).map((book) => ({ id: book.id, title: book.title, ...(stats.bookSessions.get(book.slug) ?? { visits: 0, readingStarts: 0 }) })).sort((a, b) => b.visits - a.visits || a.title.localeCompare(b.title, "ko"));
  const totalPoemViews = [...stats.poemViews.values()].reduce((total, count) => total + count, 0);
  const publicSanmoonViews = sanmoon.filter((essay) => essay.published).map((essay) => ({ id: essay.id, title: essay.title, viewCount: stats.sanmoonViews.get(essay.id) ?? 0 })).sort((a, b) => b.viewCount - a.viewCount || a.title.localeCompare(b.title, "ko"));
  const totalSanmoonViews = [...stats.sanmoonViews.values()].reduce((total, count) => total + count, 0);

  return <main className="page pt-20 pb-28">
    <header className="flex items-center justify-between pb-8">
      <h1 className="book-type text-xl font-normal">관리</h1>
      <div className="flex gap-6 text-xs"><Link href="/admin/new">새 시</Link><Link href="/admin/books">Books 관리</Link><Link href="/admin/sanmoon">Sanmoon 관리</Link><Link href="/admin/about">소개 수정</Link><LogoutButton /></div>
    </header>
    <section className="mb-16 max-w-[760px]" aria-labelledby="analytics-heading">
      <h2 id="analytics-heading" className="text-xs font-normal text-neutral-500">방문 통계</h2>
      {stats.enabled ? <>
        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-[15px]"><p>오늘 방문자 <span className="ml-2 tabular-nums">{stats.todaySessionCount}</span></p><p>전체 방문자 <span className="ml-2 tabular-nums">{stats.sessionCount}</span></p><p>전체 작품 조회수 <span className="ml-2 tabular-nums">{totalPoemViews}</span></p><p>전체 산문 조회수 <span className="ml-2 tabular-nums">{totalSanmoonViews}</span></p></div>
        {publicBookSessions.length > 0 && <div className="mt-10"><h3 className="text-xs font-normal text-neutral-500">시집별 세션</h3><div className="mt-3 grid grid-cols-[1fr_auto_auto] gap-x-6 text-xs text-neutral-400"><span>시집</span><span>방문</span><span>읽기 시작</span></div><ul className="mt-2 space-y-3 text-sm">{publicBookSessions.slice(0, 5).map((book) => <li key={book.id} className="grid grid-cols-[1fr_auto_auto] gap-x-6"><span>{book.title}</span><span className="tabular-nums text-neutral-500">{book.visits}</span><span className="tabular-nums text-neutral-500">{book.readingStarts}</span></li>)}</ul></div>}
        <h3 className="mt-10 text-xs font-normal text-neutral-500">작품 조회 상위</h3><ul className="mt-3 space-y-3 text-sm">{publicPoemViews.slice(0, 5).map((poem) => <li key={poem.id} className="flex items-baseline justify-between gap-8"><span>{poem.title}</span><span className="tabular-nums text-neutral-500">{poem.viewCount}</span></li>)}</ul>
        <h3 className="mt-10 text-xs font-normal text-neutral-500">산문별 조회수</h3><ul className="mt-3 space-y-3 text-sm">{publicSanmoonViews.map((essay) => <li key={essay.id} className="flex items-baseline justify-between gap-8"><span>{essay.title}</span><span className="tabular-nums text-neutral-500">{essay.viewCount}</span></li>)}</ul>
        <Link href="/admin/analytics" className="mt-7 inline-block text-xs">전체 통계 보기</Link>
      </> : <p className="mt-4 text-sm text-neutral-500">통계 데이터베이스가 연결되지 않았습니다.</p>}
    </section>
    <PoemList poems={poems.map((poem) => ({ ...poem, bookTitles: memberships.get(poem.id) ?? [] }))} />
  </main>;
}
