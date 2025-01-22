import { z, defineCollection } from "astro:content";

const biology = defineCollection({
  schema: z.object({
    title: z.string(),
  }),
});

// `collections` 내보내기를 통해 정의된 컬렉션을 Astro에 노출합니다.
export const collections = { biology };
