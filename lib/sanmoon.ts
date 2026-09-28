import "server-only";

import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

export type Sanmoon = {
  id: string;
  title: string;
  slug: string;
  date: string;
  body: string[];
  description: string;
  published: boolean;
};

const file = path.join(process.cwd(), "data", "sanmoon.json");
const ordered = (items: Sanmoon[]) => [...items].sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, "ko"));

async function read(): Promise<Sanmoon[]> {
  return JSON.parse(await fs.readFile(file, "utf8")) as Sanmoon[];
}

async function write(items: Sanmoon[]) {
  await fs.writeFile(file, JSON.stringify(items, null, 2) + "\n", "utf8");
}

export async function publishedSanmoon() {
  return ordered((await read()).filter((item) => item.published));
}

export async function publishedSanmoonEntry(slug: string) {
  return (await read()).find((item) => item.slug === slug && item.published);
}

export async function adminSanmoon() {
  return ordered(await read());
}

export async function adminSanmoonEntry(id: string) {
  return (await read()).find((item) => item.id === id);
}

export async function saveSanmoon(input: Omit<Sanmoon, "id"> & { id?: string }) {
  const items = await read();
  if (items.some((item) => item.slug === input.slug && item.id !== input.id)) throw new Error("DUPLICATE_SLUG");
  const current = input.id ? items.find((item) => item.id === input.id) : undefined;
  if (input.id && !current) throw new Error("NOT_FOUND");
  const item: Sanmoon = { ...input, id: current?.id ?? randomUUID() };
  if (current) Object.assign(current, item);
  else items.push(item);
  await write(items);
  return item;
}

export async function removeSanmoon(id: string) {
  await write((await read()).filter((item) => item.id !== id));
}
