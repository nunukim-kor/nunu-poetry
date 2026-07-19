"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { chooseRandomUnviewedPoem } from "@/lib/random-discovery";

type DiscoveryPoem = { id: string; title: string };

const viewedPoemIds = new Set<string>();

export default function RandomDiscoveryNext({ currentId, poems, resetOnMount = false }: { currentId: string; poems: DiscoveryPoem[]; resetOnMount?: boolean }) {
  const router = useRouter();
  const disabled = poems.filter((poem) => poem.id !== currentId).length === 0;

  useEffect(() => {
    if (resetOnMount) viewedPoemIds.clear();
    viewedPoemIds.add(currentId);
  }, [currentId, resetOnMount]);

  function goToNextPoem() {
    const next = chooseRandomUnviewedPoem(poems, currentId, viewedPoemIds);
    if (!next) return;
    router.push(`/poems/${next.id}`);
  }

  return disabled
    ? <span className="text-neutral-300" aria-hidden="true">Next</span>
    : <button type="button" onClick={goToNextPoem} aria-label="아직 읽지 않은 시 중 무작위 다음 시">Next</button>;
}
