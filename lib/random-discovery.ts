type DiscoveryPoem = { id: string };

export function chooseRandomUnviewedPoem<T extends DiscoveryPoem>(poems: T[], currentId: string, viewedIds: Set<string>, random = Math.random) {
  viewedIds.add(currentId);
  let candidates = poems.filter((poem) => poem.id !== currentId && !viewedIds.has(poem.id));

  if (candidates.length === 0) {
    viewedIds.clear();
    viewedIds.add(currentId);
    candidates = poems.filter((poem) => poem.id !== currentId);
  }

  if (candidates.length === 0) return undefined;
  const next = candidates[Math.floor(random() * candidates.length)];
  viewedIds.add(next.id);
  return next;
}
