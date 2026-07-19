import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "development-secret-change-before-deploy");
export async function middleware(request: NextRequest) { if (request.nextUrl.pathname === "/admin/login") return NextResponse.next(); const token = request.cookies.get("nunu_admin")?.value; if (!token) return NextResponse.redirect(new URL("/admin/login", request.url)); try { const { payload } = await jwtVerify(token, secret); if (payload.role !== "admin") throw new Error(); return NextResponse.next(); } catch { const response = NextResponse.redirect(new URL("/admin/login", request.url)); response.cookies.delete("nunu_admin"); return response; } }
export const config = { matcher: ["/admin/:path*"] };
