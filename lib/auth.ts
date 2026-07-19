import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const cookieName = "nunu_admin";
const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET || "development-secret-change-before-deploy");
export async function createSession() { return new SignJWT({ role: "admin" }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("8h").sign(secret()); }
export async function isAdmin() { const token = (await cookies()).get(cookieName)?.value; if (!token) return false; try { const { payload } = await jwtVerify(token, secret()); return payload.role === "admin"; } catch { return false; } }
export const adminCookie = (value: string) => ({ name: cookieName, value, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 8 });
export const clearAdminCookie = { name: cookieName, value: "", path: "/", maxAge: 0 };
