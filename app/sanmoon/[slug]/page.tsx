import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SanmoonViewTracker } from "@/app/analytics-tracker";
import { publishedSanmoonEntry } from "@/lib/sanmoon";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const essay = await publishedSanmoonEntry((await params).slug);
  if (!essay) return {};
  const description = essay.description || `김누누의 산문 「${essay.title}」`;
  return {
    title: essay.title,
    description,
    alternates: { canonical: `/sanmoon/${essay.slug}` },
    openGraph: { type: "article", title: `${essay.title} — 김누누`, description, url: `/sanmoon/${essay.slug}` },
  };
}

export default async function SanmoonDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const essay = await publishedSanmoonEntry((await params).slug);
  if (!essay) notFound();
  return <main id="main-content" tabIndex={-1} className="page pt-28 pb-32">
    <SanmoonViewTracker sanmoonId={essay.id} />
    <article className="max-w-[680px]">
      <h1 className="book-type text-[23px] font-normal leading-relaxed">{essay.title}</h1>
      {essay.description && <p className="mt-5 text-sm leading-relaxed text-neutral-500">{essay.description}</p>}
      <div className="sanmoon-body mt-16">
        {essay.body.map((paragraph, index) => <p className="sanmoon-paragraph" key={index}>{paragraph}</p>)}
      </div>
    </article>
  </main>;
}
