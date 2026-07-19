"use client";

import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname();

  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;

  return (
    <footer className="page mt-24 flex justify-end pb-8 text-xs leading-relaxed text-neutral-500 sm:mt-32 sm:pb-10" aria-label="사이트 정보">
      <div className="max-w-[560px] text-right">
        <p>© {new Date().getFullYear()} 김누누. All rights reserved.</p>
        <p className="mt-4">
          이 홈페이지에 게시된 모든 작품의 저작권은 김누누에게 있습니다.<br />
          저작권자의 사전 허락 없이 복제, 배포, 전재, 2차적 저작물 작성 및 AI 학습 데이터로의 이용을 금합니다.
        </p>
        <p className="mt-4">
          문의<br />
          <a href="mailto:imnunukim@gmail.com" className="transition-colors hover:text-neutral-700">imnunukim@gmail.com</a>
        </p>
      </div>
    </footer>
  );
}
