"use client";
import { useRouter } from "next/navigation";
export default function LogoutButton() { const router = useRouter(); return <button className="underline underline-offset-4" onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); router.replace("/admin/login"); router.refresh(); }}>로그아웃</button>; }
