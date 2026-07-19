import Link from "next/link";
import { readAbout } from "@/lib/about";
import AboutEditor from "./about-editor";

export const dynamic = "force-dynamic";

export default async function EditAboutPage() {
  const about = await readAbout();

  return (
    <main className="page pt-16 pb-24">
      <Link href="/admin" className="text-xs">← 목록</Link>
      <h1 className="book-type mb-12 mt-8 text-xl font-normal">소개 수정</h1>
      <AboutEditor initialBody={about.body} />
    </main>
  );
}
