import Link from "next/link";
import RandomDiscoveryNext from "@/app/random-discovery-next";
import { publishedPoems } from "@/lib/poems";
export const dynamic = "force-dynamic";
export default async function Home() { const poems = await publishedPoems(); const poem = poems[0]; const discoveryPoems = poems.map(({ id, title }) => ({ id, title })); return <main id="main-content" tabIndex={-1} className="page pt-28 pb-32"><article className="max-w-[580px]">{poem ? <><h1 className="poem-title book-type mb-16 text-[23px] font-normal leading-relaxed"><Link href={`/poems/${poem.id}`} className="no-underline hover:no-underline">{poem.title}</Link></h1><div className="poem-body">{poem.body.join("\n")}</div></> : <p className="book-type text-lg">아직 발표된 시가 없습니다.</p>}</article>{poem && <nav className="mt-40 flex max-w-[580px] justify-center text-[14px]" aria-label="시 이동"><RandomDiscoveryNext currentId={poem.id} poems={discoveryPoems} resetOnMount /></nav>}</main>; }
