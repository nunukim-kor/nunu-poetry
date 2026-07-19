"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AboutEditor({ initialBody }: { initialBody: string }) {
  const router = useRouter();
  const [body, setBody] = useState(initialBody);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const response = await fetch("/api/admin/about", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });

    setSaving(false);
    if (!response.ok) {
      const result = await response.json();
      setError(result.error ?? "저장할 수 없습니다.");
      return;
    }

    setMessage("저장했습니다.");
    router.refresh();
  }

  return (
    <form onSubmit={save} className="max-w-[680px]">
      <label className="block text-xs" htmlFor="about-body">About 본문</label>
      <textarea
        id="about-body"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        className="book-type mt-3 min-h-[390px] w-full resize-y border-0 bg-transparent px-0 py-2 text-[18px] leading-[2] outline-none"
        required
        maxLength={20000}
      />
      <div className="mt-10 flex items-center gap-7">
        <button disabled={saving} className="underline underline-offset-4 disabled:text-neutral-400">
          {saving ? "저장 중" : "저장"}
        </button>
        <p className="text-xs text-neutral-500" aria-live="polite">{message}</p>
      </div>
      {error && <p className="mt-5 text-xs text-red-700" role="alert">{error}</p>}
    </form>
  );
}
