import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RandomDiscoveryNext from "@/app/random-discovery-next";
import { PoemViewTracker } from "@/app/analytics-tracker";
import PoemReader from "@/app/poem-reader";
import { publishedBooksForPoem } from "@/lib/books";
import { publishedPoem, publishedPoems } from "@/lib/poems";
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const poem = await publishedPoem((await params).slug);
  if (!poem) return {};
  return {
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
export default async function PoemPage({ params }: { params: Promise<{ slug: string }> }) { const poem = await publishedPoem((await params).slug); if (!poem) notFound(); const [poems, books] = await Promise.all([publishedPoems(), publishedBooksForPoem(poem.id)]); const discoveryPoems = poems.map(({ id, title }) => ({ id, title })); return <main id="main-content" tabIndex={-1} className="page pt-20 pb-32"><PoemViewTracker poemId={poem.id} /><PoemReader title={poem.title} lines={poem.body} finalNavigation={<RandomDiscoveryNext currentId={poem.id} poems={discoveryPoems} label="다음 시" />} />{books.length > 0 && <nav className="mt-12 flex max-w-[680px] flex-col items-start gap-2 text-xs" aria-label="수록 시집">{books.map((book) => <Link key={book.slug} href={`/books/${book.slug}`}>수록 시집 · {book.title}</Link>)}</nav>}</main>; }
