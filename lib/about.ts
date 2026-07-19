import "server-only";
import { promises as fs } from "fs";
import path from "path";

export type About = { body: string };

const file = path.join(process.cwd(), "data", "about.json");

export async function readAbout(): Promise<About> {
  return JSON.parse(await fs.readFile(file, "utf8")) as About;
}

export async function saveAbout(body: string): Promise<About> {
  const about = { body };
  await fs.writeFile(file, JSON.stringify(about, null, 2) + "\n", "utf8");
  return about;
}
