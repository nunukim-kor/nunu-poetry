import Link from "next/link";
import { analyticsStats } from "@/lib/analytics";
import { publishedPoems } from "@/lib/poems";

export const dynamic = "force-dynamic";

const pageSize = 20;

export default async function AdminAnalyticsPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q = "", page = "1" } = await searchParams;
  const query = q.trim();
  const [stats, poems] = await Promise.all([analyticsStats(), publishedPoems()]);
  const allRows = poems
    .map((poem) => ({ id: poem.id, title: poem.title, viewCount: stats.poemViews.get(poem.id) ?? 0 }))
    .sort((a, b) => b.viewCount - a.viewCount || a.title.localeCompare(b.title, "ko"));
  const filteredRows = query ? allRows.filter((poem) => poem.title.toLocaleLowerCase("ko").includes(query.toLocaleLowerCase("ko"))) : allRows;
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const requestedPage = Number.parseInt(page, 10);
  const currentPage = Math.min(Math.max(Number.isFinite(requestedPage) ? requestedPage : 1, 1), pageCount);
  const rows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const href = (targetPage: number) => `/admin/analytics?${new URLSearchParams({ ...(query ? { q: query } : {}), page: String(targetPage) })}`;

  return <main className="page pt-16 pb-28"><Link href="/admin" className="text-xs">← 관리</Link><h1 className="book-type mb-10 mt-8 text-xl font-normal">전체 통계</h1>{stats.enabled ? <section className="max-w-[760px]"><form action="/admin/analytics" method="get" className="mb-10"><label className="block text-xs text-neutral-500" htmlFor="analytics-search">작품 제목 검색</label><div className="mt-2 flex max-w-[420px] items-end gap-5"><input id="analytics-search" name="q" defaultValue={query} className="min-w-0 flex-1 border-b border-neutral-300 bg-transparent py-2 outline-none focus:border-black" /><button className="text-xs underline underline-offset-4">검색</button></div></form>{rows.length ? <ul className="space-y-3 text-sm">{rows.map((poem) => <li key={poem.id} className="flex items-baseline justify-between gap-8"><span>{poem.title}</span><span className="tabular-nums text-neutral-500">{poem.viewCount}</span></li>)}</ul> : <p className="text-sm text-neutral-500">검색 결과가 없습니다.</p>}<nav className="mt-12 flex gap-8 text-xs" aria-label="통계 페이지 이동">{currentPage > 1 ? <Link href={href(currentPage - 1)}>Previous</Link> : <span className="text-neutral-300">Previous</span>}<span className="tabular-nums text-neutral-500">{currentPage} / {pageCount}</span>{currentPage < pageCount ? <Link href={href(currentPage + 1)}>Next</Link> : <span className="text-neutral-300">Next</span>}</nav></section> : <p className="text-sm text-neutral-500">통계 데이터베이스가 연결되지 않았습니다.</p>}</main>;
}
