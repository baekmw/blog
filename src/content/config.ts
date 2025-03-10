import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const content = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content" }),
  schema: z.object({
    sticker: z.string().optional(),
    title: z.string(),
    slug: z.string().optional(),
    pubDate: z.string().optional(),
  }),
});

// `collections` 내보내기를 통해 정의된 컬렉션을 Astro에 노출합니다.
export const collections = { content };
