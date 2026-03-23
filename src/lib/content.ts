import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

type Entry = CollectionEntry<"blog"> | CollectionEntry<"notes">;

function byDateDesc<T extends Entry>(a: T, b: T) {
  return b.data.pubDate.getTime() - a.data.pubDate.getTime();
}

export async function getBlogPosts(options?: { includeDrafts?: boolean }) {
  const posts = await getCollection("blog");
  return posts.filter((post) => options?.includeDrafts || !post.data.draft).sort(byDateDesc);
}

export async function getNotes(options?: { includeDrafts?: boolean }) {
  const notes = await getCollection("notes");
  return notes.filter((note) => options?.includeDrafts || !note.data.draft).sort(byDateDesc);
}
