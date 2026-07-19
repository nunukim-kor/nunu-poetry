import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/app/site-footer";
import "./globals.css";

export const metadata: Metadata = { title: { default: "김누누", template: "%s — 김누누" }, description: "김누누의 시" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ko"><body><a href="#main-content" className="skip-link">본문으로 바로가기</a><header className="page flex items-center justify-between pt-12 text-[14px]"><Link href="/" className="no-underline hover:no-underline">김누누</Link><nav className="flex gap-8" aria-label="주요 메뉴"><Link href="/books">Books</Link><Link href="/poems">Poems</Link><Link href="/about">About</Link></nav></header>{children}<SiteFooter /></body></html>; }
