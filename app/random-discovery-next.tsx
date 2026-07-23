"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { chooseRandomUnviewedPoem } from "@/lib/random-discovery";

type DiscoveryPoem = { id: string; title: string };

const viewedPoemIds = new Set<string>();
const readingHistory: string[] = [];

export default function RandomDiscoveryNext({ currentId, poems, resetOnMount = false, showPrevious = false }: { currentId: string; poems: DiscoveryPoem[]; resetOnMount?: boolean; showPrevious?: boolean }) {
  const router = useRouter();
  const [, refreshNavigation] = useState(0);

  useEffect(() => {
    if (resetOnMount) {
      viewedPoemIds.clear();
      readingHistory.length = 0;
    }
    viewedPoemIds.add(currentId);
    if (readingHistory.at(-1) !== currentId) readingHistory.push(currentId);
    refreshNavigation((value) => value + 1);
  }, [currentId, resetOnMount]);

  function goToNextPoem() {
    const next = chooseRandomUnviewedPoem(poems, currentId, viewedPoemIds);
    if (!next) return;
    readingHistory.push(next.id);
    router.push(`/poems/${next.id}`);
  }

  function goToPreviousPoem() {
    if (readingHistory.length < 2) return;
    readingHistory.pop();
    router.push(`/poems/${readingHistory.at(-1)}`);
  }

  const hasNext = poems.some((poem) => poem.id !== currentId && !viewedPoemIds.has(poem.id));

  return <>
    {showPrevious && (readingHistory.length > 1
      ? <button type="button" onClick={goToPreviousPoem} aria-label="이번 감상에서 직전에 읽은 시">Previous</button>
      : <span className="text-neutral-300" aria-hidden="true">Previous</span>)}
    {hasNext
      ? <button type="button" onClick={goToNextPoem} aria-label="이번 감상 동안 아직 읽지 않은 시 중 무작위 다음 시">Next</button>
      : <span className="text-neutral-300" aria-hidden="true">Next</span>}
  </>;
}
