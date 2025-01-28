// @ts-check
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm"; // 체크박스, 테이블 지원
import remarkDirective from "remark-directive"; // `[!note]` 같은 Callouts 변환
import remarkMath from "remark-math"; // `$LaTeX$` 지원
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex"; // KaTeX로 수식 변환
import rehypeRaw from "rehype-raw"; // HTML 지원
import rehypeStringify from "rehype-stringify";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  markdown: {
    remarkPlugins: [
      remarkDirective,
      remarkGfm,
      remarkMath,
      remarkRehype,
      remarkParse,
    ],
    rehypePlugins: [rehypeKatex, rehypeRaw, rehypeStringify],
  },
});
