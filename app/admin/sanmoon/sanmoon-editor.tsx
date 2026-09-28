"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type EditorSanmoon = { id?: string; title: string; slug: string; date: string; body: string[]; description: string; published: boolean };
const today = new Date().toISOString().slice(0, 10);

export default function SanmoonEditor({ essay }: { essay?: EditorSanmoon }) {
  const router = useRouter();
  const [title, setTitle] = useState(essay?.title ?? "");
  const [slug, setSlug] = useState(essay?.slug ?? "");
  const [date, setDate] = useState(essay?.date ?? today);
  const [body, setBody] = useState(essay?.body.join("\n\n") ?? "");
  const [description, setDescription] = useState(essay?.description ?? "");
  const [published, setPublished] = useState(essay?.published ?? false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const paragraphs = body.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
    const response = await fetch(essay?.id ? `/api/admin/sanmoon/${essay.id}` : "/api/admin/sanmoon", {
      method: essay?.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, date, body: paragraphs, description, published }),
    });
    setSaving(false);
    if (!response.ok) return setError((await response.json()).error ?? "저장할 수 없습니다.");
    router.replace("/admin/sanmoon");
    router.refresh();
  }

  async function remove() {
    if (!essay?.id || !confirm("이 산문을 삭제할까요?")) return;
    const response = await fetch(`/api/admin/sanmoon/${essay.id}`, { method: "DELETE" });
    if (!response.ok) return setError("삭제할 수 없습니다.");
    router.replace("/admin/sanmoon");
    router.refresh();
  }

  return <form onSubmit={save} className="max-w-[680px]">
    <label className="block text-xs" htmlFor="title">제목</label>
    <input id="title" value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 w-full border-b border-neutral-300 bg-transparent py-2 text-lg outline-none focus:border-black" required maxLength={180} />
    <label className="mt-8 block text-xs" htmlFor="slug">슬러그</label>
    <input id="slug" value={slug} onChange={(event) => setSlug(event.target.value)} className="mt-2 w-full border-b border-neutral-300 bg-transparent py-2 outline-none focus:border-black" required maxLength={180} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="english-slug" />
    <label className="mt-8 block text-xs" htmlFor="date">작성일</label>
    <input id="date" type="date" value={date} onChange={(event) => setDate(event.target.value)} className="mt-2 border-b border-neutral-300 bg-transparent py-2 outline-none focus:border-black" required />
    <label className="mt-10 block text-xs" htmlFor="description">짧은 부가 설명 <span className="text-neutral-400">(선택)</span></label>
    <input id="description" value={description} onChange={(event) => setDescription(event.target.value)} className="mt-2 w-full border-b border-neutral-300 bg-transparent py-2 outline-none focus:border-black" maxLength={500} />
    <label className="mt-12 block text-xs" htmlFor="body">본문 <span className="text-neutral-400">(문단 사이는 빈 줄)</span></label>
    <textarea id="body" value={body} onChange={(event) => setBody(event.target.value)} className="book-type mt-3 min-h-[520px] w-full resize-y border-0 bg-transparent px-0 py-2 text-[17px] leading-[2] outline-none" required maxLength={100000} />
    <label className="mt-8 flex items-center gap-3 text-xs"><input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} />공개</label>
    <div className="mt-10 flex items-center gap-7"><button disabled={saving} className="underline underline-offset-4 disabled:text-neutral-400">{saving ? "저장 중" : "저장"}</button>{essay?.id && <button type="button" onClick={remove} className="text-xs text-neutral-500 underline underline-offset-4">삭제</button>}</div>
    {error && <p className="mt-5 text-xs text-red-700">{error}</p>}
  </form>;
}
