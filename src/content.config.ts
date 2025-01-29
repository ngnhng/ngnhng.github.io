import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const notes = defineCollection({
  loader: glob({ pattern: "*.{md,mdx}", base: "./src/notes" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      imageAlt: z.string().optional(),
      image: z.string().nonempty(),
      slug: z.string(),
      tags: z.array(z.string()).optional(),
    }),
});

export const collections = { notes };
