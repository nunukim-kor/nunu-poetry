import Link from "next/link";
import SanmoonEditor from "../sanmoon-editor";

export default function NewSanmoonPage() {
  return <main className="page pt-16 pb-24"><Link href="/admin/sanmoon" className="text-xs">← 목록</Link><h1 className="book-type mb-12 mt-8 text-xl font-normal">새 산문</h1><SanmoonEditor /></main>;
}
