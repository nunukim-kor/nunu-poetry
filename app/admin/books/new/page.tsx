import Link from "next/link";
import { adminPoems } from "@/lib/poems";
import BookEditor from "../book-editor";
export const dynamic = "force-dynamic";
export default async function NewBookPage() { const poems = await adminPoems(); return <main className="page pt-16 pb-24"><Link href="/admin/books" className="text-xs">← Books</Link><h1 className="book-type mb-12 mt-8 text-xl font-normal">새 책</h1><BookEditor poems={poems} /></main>; }
