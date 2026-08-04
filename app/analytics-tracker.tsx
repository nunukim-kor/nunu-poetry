"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const storageKey = "nunu_visitor_session";

function sessionId() {
  const existing = sessionStorage.getItem(storageKey);
  if (existing) return existing;
  const id = crypto.randomUUID();
  sessionStorage.setItem(storageKey, id);
  return id;
}

export function VisitorSessionTracker() {
  const pathname = usePathname();
  const sentPath = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (pathname.startsWith("/admin") || sentPath.current === pathname) return;
    sentPath.current = pathname;
    void fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId: sessionId() }), keepalive: true });
  }, [pathname]);

  return null;
}

export function PoemViewTracker({ poemId }: { poemId: string }) {
  const sentPoemId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (sentPoemId.current === poemId) return;
    sentPoemId.current = poemId;
    void fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId: sessionId(), poemId }), keepalive: true });
  }, [poemId]);

  return null;
}
