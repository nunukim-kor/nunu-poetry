import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/app/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nunukim.kr"),
  title: { default: "김누누 시인 — 공식 홈페이지", template: "%s — 김누누 시인" },
  description: "김누누 시인 공식 홈페이지. 시인 김누누의 시와 시집을 발표합니다.",
  keywords: ["김누누", "김누누 시인", "시인 김누누", "김누누 시", "한국 시인", "현대시"],
  authors: [{ name: "김누누", url: "https://nunukim.kr" }],
  creator: "김누누",
  publisher: "김누누",
  verification: {
    other: {
      "naver-site-verification": "7e8a68c508cade01c86f01d8584cd2f94c3a38bf",
    },
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://nunukim.kr",
    siteName: "김누누",
    title: "김누누 시인 — 공식 홈페이지",
    description: "김누누 시인 공식 홈페이지. 시인 김누누의 시와 시집을 발표합니다.",
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ko"><body><a href="#main-content" className="skip-link">본문으로 바로가기</a><header className="page flex items-center justify-between pt-12 text-[14px]"><Link href="/" className="no-underline hover:no-underline">김누누</Link><nav className="flex gap-8" aria-label="주요 메뉴"><Link href="/books">Books</Link><Link href="/poems">Poems</Link><Link href="/about">About</Link></nav></header>{children}<SiteFooter /></body></html>; }
