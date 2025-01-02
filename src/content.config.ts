import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const notes = defineCollection({
  loader: glob({ pattern: "*.{md,mdx}", base: "./src/notes" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      category: z.string(),
      imageAlt: z.string().optional(),
      image: image().refine((img) => img.width >= 500, {
        message: "Cover image must be at least 500 pixels wide!",
      }),
      slug: z.string(),
    }),
});

export const collections = { notes };
