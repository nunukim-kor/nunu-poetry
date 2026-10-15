import Image from "next/image";
import Link from "next/link";
import HomeScrollReset from "@/app/home-scroll-reset";
import { latestPublishedBook } from "@/lib/books";
import { latestPoem } from "@/lib/poems";
export const dynamic = "force-dynamic";

export default async function Home() {
  const [poem, book] = await Promise.all([latestPoem(), latestPublishedBook()]);
  const showBook = Boolean(book?.date && (!poem || book.date >= poem.date));
  const item = showBook && book
    ? { type: "시집", title: book.title, date: book.date ?? "", cover: book.cover, href: `/books/${book.slug}`, book: true }
    : poem
      ? { type: "시", title: poem.title, date: poem.date, cover: poem.coverImage, href: `/poems/${poem.id}`, book: false }
      : undefined;

  return <main id="main-content" tabIndex={-1} className="page pb-32 pt-20">
    <HomeScrollReset />
    {item ? <article className="home-cover-feature">
      <Link href={item.href} className="block w-fit no-underline hover:no-underline" aria-label={`${item.type} ${item.title} 읽기`}>
        <div className={item.book ? "home-cover home-book-cover" : "home-cover home-poem-cover"}>
          {item.cover
            ? <Image src={item.cover} alt={`${item.title} 표지`} fill priority sizes={item.book ? "320px" : "420px"} className="object-cover" />
            : <span className="home-cover-title book-type">{item.title}</span>}
        </div>
        <p className="mt-6 text-xs text-neutral-500">{item.type} · {item.date}</p>
        <h1 className="book-type mt-2 text-[21px] font-normal leading-relaxed">{item.title}</h1>
      </Link>
    </article> : <p className="book-type text-lg">아직 공개된 작품이 없습니다.</p>}
  </main>;
}
