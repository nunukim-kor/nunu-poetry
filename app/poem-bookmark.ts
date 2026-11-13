export type PoemBookmark = {
  path: string;
  title: string;
  pageIndex: number;
};

export const poemBookmarkChangedEvent = "nunu-poem-bookmark-changed";
const storageKey = "nunu_poem_bookmark";

function isPoemPath(path: unknown): path is string {
  return typeof path === "string" && (path.startsWith("/poems/") || path.startsWith("/books/"));
}

export function readPoemBookmark(): PoemBookmark | null {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) ?? "null") as Partial<PoemBookmark> | null;
    if (!value || !isPoemPath(value.path) || typeof value.title !== "string" || !Number.isInteger(value.pageIndex) || Number(value.pageIndex) < 0) return null;
    return { path: value.path, title: value.title, pageIndex: Number(value.pageIndex) };
  } catch {
    return null;
  }
}

export function savePoemBookmark(bookmark: PoemBookmark) {
  localStorage.setItem(storageKey, JSON.stringify(bookmark));
  window.dispatchEvent(new Event(poemBookmarkChangedEvent));
}

export function clearPoemBookmark() {
  localStorage.removeItem(storageKey);
  window.dispatchEvent(new Event(poemBookmarkChangedEvent));
}
