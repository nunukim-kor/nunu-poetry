import type { MetadataRoute } from "next";
import { publishedBooks } from "@/lib/books";
import { publishedPoems } from "@/lib/poems";

const origin = "https://nunukim.kr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [poems, books] = await Promise.all([publishedPoems(), publishedBooks()]);
  const latestPoemDate = poems[0]?.date ? new Date(`${poems[0].date}T00:00:00Z`) : new Date();

  return [
    { url: origin, lastModified: latestPoemDate, changeFrequency: "weekly", priority: 1 },
    { url: `${origin}/poems`, lastModified: latestPoemDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${origin}/books`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${origin}/about`, changeFrequency: "yearly", priority: 0.6 },
    ...poems.map((poem) => ({
      url: `${origin}/poems/${poem.id}`,
      lastModified: new Date(`${poem.date}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...books.map((book) => ({
      url: `${origin}/books/${book.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
