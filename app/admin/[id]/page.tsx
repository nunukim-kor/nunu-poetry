import Link from "next/link";
import { notFound } from "next/navigation";
import { adminPoem } from "@/lib/poems";
import PoemEditor from "../poem-editor";
export const dynamic = "force-dynamic";
export default async function EditPoemPage({ params }: { params: Promise<{ id: string }> }) { const poem = await adminPoem((await params).id); if (!poem) notFound(); return <main className="page pt-16 pb-24"><div className="flex max-w-[680px] items-center justify-between gap-6 text-xs"><Link href="/admin">← 목록</Link>{poem.visibility === "public" && <Link href={`/poems/${poem.id}`} target="_blank" rel="noopener noreferrer">공개 페이지 보기</Link>}</div><h1 className="book-type mb-12 mt-8 text-xl font-normal">시 수정</h1><PoemEditor poem={poem} /></main>; }
