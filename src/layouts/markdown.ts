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
    visit(tree, (node) => {
      if (node.children !== undefined) {
        for (let i = 0; i < node.children.length; i++) {
          const child = node.children[i];

          if (child.type === "text" && /==(.+?)==/g.test(child.value)) {
            const regex = /==(.+?)==/g;
            let match;
            const children = [];
            let lastIndex = 0;

            while ((match = regex.exec(child.value)) !== null) {
              if (match.index > lastIndex) {
                children.push({
                  type: "text",
                  value: child.value.slice(lastIndex, match.index),
                });
              }

              children.push({
                type: "element",
                tagName: "mark",
                properties: {},
                children: [{ type: "text", value: match[1] }],
              });

              lastIndex = regex.lastIndex;
            }

            if (lastIndex < child.value.length) {
              children.push({
                type: "text",
                value: child.value.slice(lastIndex),
              });
            }

            if (children.length > 0) {
              node.children.splice(i, 1, ...children);
            }
          }
        }
      }
    });
  };
}

export async function parseMarkdown(content: string) {
  const result = await unified()
    // .use(() => (remarkTree) => console.log(JSON.stringify(remarkTree)))
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDirective)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(highlightPlugin) // ✅ `rehype`에서 실행
    .use(rehypeKatex)
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(content);
  return result.toString();
}
