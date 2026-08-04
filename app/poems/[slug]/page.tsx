import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RandomDiscoveryNext from "@/app/random-discovery-next";
import PoemLines from "@/app/poem-lines";
import { publishedBooksForPoem } from "@/lib/books";
import { publishedPoem, publishedPoems } from "@/lib/poems";
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const poem = await publishedPoem((await params).slug);
  if (!poem) return {};
  return {
    title: poem.title,
    description: `김누누의 시 「${poem.title}」`,
    alternates: { canonical: `/poems/${poem.id}` },
    openGraph: {
      type: "article",
      title: `${poem.title} — 김누누`,
      description: `김누누의 시 「${poem.title}」`,
      url: `/poems/${poem.id}`,
    },
  };
}
export default async function PoemPage({ params }: { params: Promise<{ slug: string }> }) { const poem = await publishedPoem((await params).slug); if (!poem) notFound(); const [poems, books] = await Promise.all([publishedPoems(), publishedBooksForPoem(poem.id)]); const discoveryPoems = poems.map(({ id, title }) => ({ id, title })); return <main id="main-content" tabIndex={-1} className="page pt-28 pb-32"><article className="max-w-[580px]"><h1 className="poem-title book-type mb-16 text-[23px] font-normal leading-relaxed">{poem.title}</h1><div className="poem-body"><PoemLines lines={poem.body} /></div>{books.length > 0 && <nav className="mt-12 flex flex-col items-start gap-2 text-xs" aria-label="수록 시집">{books.map((book) => <Link key={book.slug} href={`/books/${book.slug}`}>수록 시집 · {book.title}</Link>)}</nav>}</article><nav className="mt-40 flex max-w-[580px] justify-center gap-9 text-[14px]" aria-label="시 이동"><RandomDiscoveryNext currentId={poem.id} poems={discoveryPoems} showPrevious /></nav></main>; }
