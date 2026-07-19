import Link from "next/link";
import PoemEditor from "../poem-editor";
export default function NewPoemPage() { return <main className="page pt-16 pb-24"><Link href="/admin" className="text-xs">← 목록</Link><h1 className="book-type mb-12 mt-8 text-xl font-normal">새 시</h1><PoemEditor /></main>; }
