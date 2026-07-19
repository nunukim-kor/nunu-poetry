import Link from "next/link";
import { adminPoems } from "@/lib/poems";
import { poemBookMemberships } from "@/lib/books";
import LogoutButton from "./logout-button";
import PoemList from "./poem-list";
export const dynamic = "force-dynamic";
export default async function AdminPage() { const [poems, memberships] = await Promise.all([adminPoems(), poemBookMemberships()]); return <main className="page pt-20 pb-28"><header className="flex items-center justify-between pb-8"><h1 className="book-type text-xl font-normal">관리</h1><div className="flex gap-6 text-xs"><Link href="/admin/new">새 시</Link><Link href="/admin/books">Books 관리</Link><Link href="/admin/about">소개 수정</Link><LogoutButton /></div></header><PoemList poems={poems.map((poem) => ({ ...poem, bookTitles: memberships.get(poem.id) ?? [] }))} /></main>; }
