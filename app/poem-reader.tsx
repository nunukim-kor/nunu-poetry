"use client";

import { type ReactNode, type TouchEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import PoemLines from "@/app/poem-lines";

type PageRange = { start: number; end: number };

function calculatePages(lines: string[], heights: number[], capacity: number): PageRange[] {
  if (!lines.length || !heights.length || capacity <= 0) return [{ start: 0, end: lines.length }];

  const pages: PageRange[] = [];
  let pageStart = 0;
  let used = 0;
  let index = 0;

  while (index < lines.length) {
    let groupEnd = index + 1;
    while (groupEnd < lines.length && lines[groupEnd - 1].trim() !== "") groupEnd += 1;
    while (groupEnd < lines.length && lines[groupEnd].trim() === "") groupEnd += 1;
    const groupHeight = heights.slice(index, groupEnd).reduce((sum, height) => sum + height, 0);

    if (used > 0 && used + groupHeight > capacity) {
      pages.push({ start: pageStart, end: index });
      pageStart = index;
      used = 0;
    }

    if (groupHeight <= capacity) {
      used += groupHeight;
      index = groupEnd;
      continue;
    }

    while (index < groupEnd) {
      const lineHeight = heights[index] || 1;
      if (used > 0 && used + lineHeight > capacity) {
        pages.push({ start: pageStart, end: index });
        pageStart = index;
        used = 0;
      }
      used += lineHeight;
      index += 1;
    }
  }

  if (pageStart < lines.length || pages.length === 0) pages.push({ start: pageStart, end: lines.length });
  return pages.filter((page) => page.end > page.start);
}

export default function PoemReader({ title, lines, finalNavigation }: { title: string; lines: string[]; finalNavigation: ReactNode }) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);
  const [pages, setPages] = useState<PageRange[]>([{ start: 0, end: lines.length }]);
  const [pageIndex, setPageIndex] = useState(0);

  useLayoutEffect(() => {
    const sheet = sheetRef.current;
    const measure = measureRef.current;
    if (!sheet || !measure) return;

    const repaginate = () => {
      const lineElements = Array.from(measure.querySelectorAll<HTMLElement>(".poem-line"));
      const heights = lineElements.map((element) => element.getBoundingClientRect().height);
      const nextPages = calculatePages(lines, heights, sheet.clientHeight);
      setPages(nextPages);
      setPageIndex((current) => Math.min(current, Math.max(nextPages.length - 1, 0)));
    };

    repaginate();
    const observer = new ResizeObserver(repaginate);
    observer.observe(sheet);
    observer.observe(measure);
    return () => observer.disconnect();
  }, [lines]);

  useEffect(() => setPageIndex(0), [title]);

  const currentPage = pages[pageIndex] ?? pages[0];
  const isLastPage = pageIndex === pages.length - 1;
  const goPrevious = () => setPageIndex((current) => Math.max(0, current - 1));
  const goNext = () => setPageIndex((current) => Math.min(pages.length - 1, current + 1));

  function finishSwipe(event: TouchEvent<HTMLElement>) {
    if (touchStart.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (distance > 55 && pageIndex > 0) goPrevious();
    if (distance < -55 && !isLastPage) goNext();
  }

  return <article className="poem-reader max-w-[680px]" onKeyDown={(event) => {
    if (event.key === "ArrowLeft" && pageIndex > 0) goPrevious();
    if (event.key === "ArrowRight" && !isLastPage) goNext();
  }} onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={finishSwipe}>
    <h1 className="poem-title book-type mb-10 text-[22px] font-normal leading-relaxed">{title}</h1>
    <div ref={sheetRef} className="poem-reader-sheet" tabIndex={0} aria-label={`${title}, ${pageIndex + 1}페이지`}> 
      <div key={pageIndex} className="poem-reader-page poem-body">
        <PoemLines lines={lines.slice(currentPage.start, currentPage.end)} />
      </div>
    </div>
    <div ref={measureRef} className="poem-reader-measure poem-body" aria-hidden="true"><PoemLines lines={lines} /></div>
    <p className="mt-3 text-center text-[11px] text-neutral-400" aria-live="polite">{pageIndex + 1} / {pages.length}</p>
    <nav className="mt-3 flex min-h-8 items-center justify-center gap-9 text-[14px]" aria-label="시 페이지 이동">
      {pageIndex > 0 && <button type="button" onClick={goPrevious} aria-label="이전 페이지" className="text-[18px] leading-none text-black">◀</button>}
      {!isLastPage && <button type="button" onClick={goNext} aria-label="다음 페이지" className="text-[18px] leading-none text-black">▶</button>}
      {isLastPage && finalNavigation}
    </nav>
  </article>;
}
