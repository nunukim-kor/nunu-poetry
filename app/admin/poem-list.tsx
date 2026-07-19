"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ListPoem = {
  id: string;
  title: string;
  date: string;
  visibility: "public" | "private";
  bookTitles: string[];
};

export default function PoemList({ poems }: { poems: ListPoem[] }) {
  const router = useRouter();
  const selectAllRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const allSelected = poems.length > 0 && selected.size === poems.length;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = selected.size > 0 && !allSelected;
    }
  }, [allSelected, selected.size]);

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(poems.map((poem) => poem.id)));
    setMessage("");
    setError("");
  }

  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setMessage("");
    setError("");
  }

  async function removeSelected() {
    const count = selected.size;
    if (count === 0 || !confirm(`선택한 시 ${count}편을 삭제할까요?`)) return;

    setDeleting(true);
    setMessage("");
    setError("");
    const response = await fetch("/api/admin/poems", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [...selected] }),
    });
    setDeleting(false);

    if (!response.ok) {
      setError("선택한 시를 삭제할 수 없습니다.");
      return;
    }

    const result = await response.json() as { deleted: number };
    setSelected(new Set());
    setMessage(`${result.deleted}편을 삭제했습니다.`);
    router.refresh();
  }

  return (
    <section className="max-w-[760px]" aria-label="시 관리 목록">
      {poems.length > 0 && (
        <div className="flex min-h-10 items-center justify-between gap-6 text-xs">
          <label className="flex items-center gap-3">
            <input ref={selectAllRef} type="checkbox" checked={allSelected} onChange={toggleAll} />
            전체 선택
          </label>
          {selected.size > 0 && (
            <div className="flex items-center gap-5">
              <span>선택 {selected.size}편</span>
              <button type="button" onClick={removeSelected} disabled={deleting} className="text-neutral-600 underline underline-offset-4 disabled:text-neutral-300">
                {deleting ? "삭제 중" : "선택 삭제"}
              </button>
            </div>
          )}
        </div>
      )}

      <p className="min-h-6 pt-2 text-xs text-neutral-500" aria-live="polite">{message}</p>
      {error && <p className="pb-2 text-xs text-red-700" role="alert">{error}</p>}

      <ul>
        {poems.map((poem) => (
          <li key={poem.id} className="grid grid-cols-[auto_1fr] items-center gap-4">
            <input
              type="checkbox"
              checked={selected.has(poem.id)}
              onChange={() => toggle(poem.id)}
              aria-label={`${poem.title} 선택`}
            />
            <Link href={`/admin/${poem.id}`} className="grid grid-cols-[1fr_auto] gap-8 py-5 no-underline hover:no-underline">
              <span>{poem.title}<span className="ml-3 text-xs text-neutral-400">{poem.visibility === "public" ? "공개" : "비공개"}</span></span>
              <time className="text-xs text-neutral-500" dateTime={poem.date}>{poem.date}</time>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
