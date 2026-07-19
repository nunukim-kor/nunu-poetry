type OwnedPoem = { id: string; independentlyPublished?: boolean };

export function shouldDeleteDetachedBookPoem(poem: OwnedPoem, referencedIds: Set<string>) {
  return poem.independentlyPublished === false && !referencedIds.has(poem.id);
}
