import Link from "next/link";
import { notFound } from "next/navigation";
import { PoemViewTracker } from "@/app/analytics-tracker";
import PoemReader from "@/app/poem-reader";
import { publishedBook } from "@/lib/books";

export const dynamic = "force-dynamic";

export default async function BookPoemPage({ params }: { params: Promise<{ slug: string; poemId: string }> }) {
  const { slug, poemId } = await params;
  const book = await publishedBook(slug);
  if (!book) notFound();
  const index = book.poems.findIndex((poem) => poem.id === poemId);
  if (index < 0) notFound();
  const poem = book.poems[index];
  const next = book.poems[index + 1];
  return <main id="main-content" tabIndex={-1} className="page pt-20 pb-32">
    <PoemViewTracker poemId={poem.id} bookSlug={book.slug} />
    <p className="mb-8 text-xs text-neutral-500"><Link href={`/books/${book.slug}`}>수록 시집 · {book.title}</Link></p>
    <PoemReader title={poem.title} lines={poem.body} finalNavigation={next
      ? <Link href={`/books/${book.slug}/${next.id}`} aria-label={`다음 시: ${next.title}`}>다음 시</Link>
      : <Link href={`/books/${book.slug}`}>시집으로 돌아가기</Link>} />
  </main>;
}
