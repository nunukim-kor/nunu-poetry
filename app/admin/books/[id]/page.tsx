import Link from "next/link";
import { notFound } from "next/navigation";
import { adminBook } from "@/lib/books";
import { adminPoems } from "@/lib/poems";
import BookEditor from "../book-editor";
export const dynamic = "force-dynamic";
export default async function EditBookPage({ params }: { params: Promise<{ id: string }> }) { const [book, poems] = await Promise.all([adminBook((await params).id), adminPoems()]); if (!book) notFound(); return <main className="page pt-16 pb-24"><div className="flex max-w-[680px] items-center justify-between text-xs"><Link href="/admin/books">← Books</Link>{book.published && <Link href={`/books/${book.slug}`} target="_blank" rel="noopener noreferrer">공개 페이지 보기</Link>}</div><h1 className="book-type mb-12 mt-8 text-xl font-normal">책 수정</h1><BookEditor book={book} poems={poems} /></main>; }
