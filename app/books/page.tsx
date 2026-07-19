import Link from "next/link";
import Image from "next/image";
import { publishedBooks } from "@/lib/books";
export const dynamic = "force-dynamic";
export default async function BooksPage() { const books = await publishedBooks(); return <main id="main-content" tabIndex={-1} className="page pt-28 pb-32"><h1 className="sr-only">시집</h1>{books.length ? <ul className="grid max-w-[820px] grid-cols-1 gap-x-16 gap-y-20 sm:grid-cols-2">{books.map((book) => <li key={book.id}><Link href={`/books/${book.slug}`} className="block no-underline hover:no-underline">{book.cover && <Image src={book.cover} alt={`${book.title} 표지`} width={560} height={840} className="mb-6 aspect-[2/3] w-full max-w-[280px] object-cover" />}<span className="book-type text-[19px]">{book.title}</span></Link></li>)}</ul> : <p className="book-type">아직 공개된 책이 없습니다.</p>}</main>; }
