import type { CollectionEntry } from "astro:content";

export function sortByDate(artworks: CollectionEntry<"artworks">[]) {
  return [...artworks].sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );
}
