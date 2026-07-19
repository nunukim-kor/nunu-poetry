import "server-only";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { shouldDeleteDetachedBookPoem } from "@/lib/poem-ownership";

export type PoemVisibility = "public" | "private";
export type Poem = { id: string; title: string; date: string; visibility: PoemVisibility; body: string[]; originBookId?: string; independentlyPublished?: boolean; published?: boolean };
type LegacyPoemVisibility = PoemVisibility | "poems_and_books" | "book_only";
type StoredPoem = Omit<Poem, "visibility"> & { visibility?: LegacyPoemVisibility };
const file = path.join(process.cwd(), "data", "poems.json");
const today = () => new Date().toISOString().slice(0, 10);
const normalize = (poem: StoredPoem): Poem => ({ ...poem, visibility: poem.visibility === "public" || poem.visibility === "poems_and_books" ? "public" : "private", independentlyPublished: poem.independentlyPublished ?? !poem.originBookId });
async function read(): Promise<Poem[]> { return (JSON.parse(await fs.readFile(file, "utf8")) as StoredPoem[]).map(normalize); }
async function write(poems: Poem[]) { const stored = poems.map((poem) => { const item = { ...poem }; delete item.published; return item; }); await fs.writeFile(file, JSON.stringify(stored, null, 2) + "\n", "utf8"); }
const ordered = (poems: Poem[]) => [...poems].sort((a, b) => b.date.localeCompare(a.date));
export async function latestPoem() { return ordered((await read()).filter((poem) => poem.visibility === "public"))[0]; }
export async function publishedPoems() { return ordered((await read()).filter((poem) => poem.visibility === "public")); }
export async function publishedPoem(id: string) { return (await read()).find((poem) => poem.id === id && poem.visibility === "public"); }
export async function bookVisiblePoems() { return (await read()).filter((poem) => poem.visibility === "public"); }
export async function previousPoem(poem: Poem) { const poems = await publishedPoems(); return poems[poems.findIndex((item) => item.id === poem.id) + 1]; }
export async function adminPoems() { return ordered(await read()); }
export async function adminPoem(id: string) { return (await read()).find((poem) => poem.id === id); }
export async function savePoem(input: Omit<Poem, "id" | "date" | "published" | "originBookId" | "independentlyPublished"> & { id?: string; date?: string }, options: { originBookId?: string; independent?: boolean } = {}) { const poems = await read(); const current = input.id ? poems.find((poem) => poem.id === input.id) : undefined; const poem: Poem = { id: input.id ?? randomUUID(), title: input.title, body: input.body, visibility: input.visibility, date: input.date ?? current?.date ?? today(), originBookId: current?.originBookId ?? options.originBookId, independentlyPublished: options.independent ?? current?.independentlyPublished ?? !options.originBookId }; if (current) Object.assign(current, poem); else poems.push(poem); await write(poems); return poem; }
export async function publishPoems(ids: string[]) { const poems = await read(); const selected = new Set(ids); for (const poem of poems) if (selected.has(poem.id)) poem.visibility = "public"; await write(poems); }
export async function removePoem(id: string) { await write((await read()).filter((poem) => poem.id !== id)); }
export async function removePoems(ids: string[]) { const poems = await read(); const selected = new Set(ids); const remaining = poems.filter((poem) => !selected.has(poem.id)); await write(remaining); return poems.length - remaining.length; }
export async function removeUnreferencedBookPoems(ids: string[], referencedIds: Set<string>) { const poems = await read(); const candidates = new Set(ids); const remaining = poems.filter((poem) => !candidates.has(poem.id) || !shouldDeleteDetachedBookPoem(poem, referencedIds)); await write(remaining); return poems.length - remaining.length; }
