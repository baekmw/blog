import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm"; // 체크박스, 테이블 지원
import remarkDirective from "remark-directive"; // `[!note]` 같은 Callouts 변환
import remarkMath from "remark-math"; // `$LaTeX$` 지원
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex"; // KaTeX로 수식 변환
import rehypeRaw from "rehype-raw"; // HTML 지원
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";

function highlightPlugin() {
  return (tree: any) => {
    visit(tree, "text", (node, index, parent) => {
      const regex = /==(.+?)==/g;
      let match;
      const children = [];
      let lastIndex = 0;

      while ((match = regex.exec(node.value)) !== null) {
        if (match.index > lastIndex) {
          children.push({
            type: "text",
            value: node.value.slice(lastIndex, match.index),
          });
        }

        // ✅ `mark` 태그 적용 (rehype 변환을 위해 `element` 노드 사용)
        children.push({
          type: "element",
          tagName: "mark",
          properties: {},
          children: [{ type: "text", value: match[1] }],
        });

        lastIndex = regex.lastIndex;
      }

      if (lastIndex < node.value.length) {
        children.push({ type: "text", value: node.value.slice(lastIndex) });
      }

      if (children.length > 0) {
        parent.children.splice(index, 1, ...children);
      }
    });
  };
}

// ✅ 마크다운 변환 함수
export async function parseMarkdown(content: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDirective) // 옵시디언의 `[!note]` 등 지원
    .use(remarkMath) // `$LaTeX$` 지원
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(highlightPlugin) // `==하이라이트==` 지원
    .use(rehypeKatex) // LaTeX 변환
    .use(rehypeRaw) // HTML 지원
    .use(rehypeStringify)
    .process(content);

  return result.toString();
}
