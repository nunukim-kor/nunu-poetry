"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { poemBookmarkChangedEvent, readPoemBookmark, type PoemBookmark } from "@/app/poem-bookmark";

export default function BookmarkShortcut() {
  const pathname = usePathname();
  const router = useRouter();
  const [bookmark, setBookmark] = useState<PoemBookmark | null>(null);

  useEffect(() => {
    const refresh = () => setBookmark(readPoemBookmark());
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener(poemBookmarkChangedEvent, refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(poemBookmarkChangedEvent, refresh);
    };
  }, []);

  if (!bookmark || pathname === bookmark.path || pathname.startsWith("/admin")) return null;

  return <div className="page mt-3 flex justify-end text-[11px] text-neutral-500">
    <button type="button" onClick={() => router.push(bookmark.path)} aria-label={`책갈피로 이동: ${bookmark.title}`}>책갈피 · {bookmark.title}</button>
  </div>;
}
