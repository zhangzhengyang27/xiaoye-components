import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mdContainer from "markdown-it-container";
import type { MarkdownRenderer } from "vitepress";
import { getDemoComponentName } from "../utils/demo";
import { setDemoSource } from "../utils/demo-source";
import { sfcTs2js } from "../utils/ts2js";

interface ContainerOpts {
  marker?: string | undefined;
  validate?(params: string): boolean;
  render?: MarkdownRenderer["renderer"]["rules"]["container"];
}

const docsRoot = fileURLToPath(new URL("../../", import.meta.url));
const examplesRoot = path.resolve(docsRoot, "examples");
const frontExamplesRoot = path.resolve(examplesRoot, "front");
/**
 * Sandbox 判断逻辑（简化版）
 *
 * 参考 Element Plus 的处理方式：不做复杂的 AST 分析，依赖组件自包含样式。
 * 仅对原生 table 系列标签启用 sandbox，因为 VitePress prose 样式对 table 有全局定义。
 *
 * 显式控制：
 * - <!-- demo-sandbox:on --> 强制开启
 * - <!-- demo-sandbox:off --> 强制关闭
 */
const tableTags = new Set(["table", "thead", "tbody", "tfoot", "tr", "th", "td"]);
const sandboxOnPattern = /<!--\s*@demo-sandbox\s*-->|<!--\s*demo-sandbox:on\s*-->/i;
const sandboxOffPattern = /<!--\s*demo-sandbox:off\s*-->/i;

function shouldEnableSandbox(source: string): boolean {
  // 显式关闭
  if (sandboxOffPattern.test(source)) {
    return false;
  }

  // 显式开启
  if (sandboxOnPattern.test(source)) {
    return true;
  }

  // 检查是否包含原生 table 标签（通过简单正则，避免复杂 AST 分析）
  const templateMatch = source.match(/<template[^>]*>([\s\S]*?)<\/template>/i);
  if (!templateMatch) {
    return false;
  }

  const templateContent = templateMatch[1];
  for (const tag of tableTags) {
    // 匹配原生标签（不带命名空间前缀，不是 xy-table 等）
    const pattern = new RegExp(`<${tag}(?:\\s|>|\\/)`, "i");
    if (pattern.test(templateContent)) {
      return true;
    }
  }

  return false;
}

function createDemoContainer(md: MarkdownRenderer): ContainerOpts {
  return {
    validate(params) {
      return /^demo\s*(.*)$/.test(params.trim());
    },

    render(tokens, idx) {
      const matched = tokens[idx].info.trim().match(/^demo\s*(.*)$/);

      if (tokens[idx].nesting === 1) {
        // 路径来源有两种语法：
        // 1. 单行: :::demo path/to/example  → 路径在 matched[1]，无描述
        // 2. 两行: :::demo description\npath/to/example\n:::  → 描述在 matched[1]，路径在后续 token 中
        // 通过路径模式（纯 ASCII 字母数字 + 连字符/斜杠/点）判断 matched[1] 是否为路径
        let sourceFile = "";
        let description = "";
        const matchedPath = matched?.[1] ?? "";
        const isPathLike = /^[a-zA-Z0-9_/.-]+$/.test(matchedPath);
        if (isPathLike) {
          sourceFile = matchedPath;
        } else {
          description = matchedPath;
          for (let i = idx + 2; i < tokens.length; i++) {
            const token = tokens[i];
            if (token.type === "container_demo_close") break;
            const content = token.children?.[0]?.content?.trim() ?? "";
            if (content && content !== ":::" && /^#[^]/.test(content) === false) {
              sourceFile = content;
              break;
            }
          }
        }

        // 前台组件示例在 examples/front/ 下，普通组件在 examples/ 下
        // 支持 /front/ 和 /components/front/ 两种文档路径
        // 先尝试普通路径，再尝试前台路径
        let sourcePath = path.resolve(examplesRoot, `${sourceFile}.vue`);
        let isFrontExample = false;
        if (!fs.existsSync(sourcePath)) {
          sourcePath = path.resolve(frontExamplesRoot, `${sourceFile}.vue`);
          if (fs.existsSync(sourcePath)) {
            isFrontExample = true;
          }
        }

        if (!sourceFile || !fs.existsSync(sourcePath)) {
          throw new Error(`Incorrect source file: ${sourceFile}`);
        }

        // 前台组件示例需要加上 front/ 前缀，以便 Demo.vue 生成正确的 GitHub 链接
        const demoPath = isFrontExample ? `front/${sourceFile}` : sourceFile;

        const source = fs.readFileSync(sourcePath, "utf-8");
        const jsSource = sfcTs2js(source);
        // 使用原始 sourceFile 生成组件名，与 markdown-transform.ts 保持一致
        const componentName = getDemoComponentName(sourceFile);
        const needsSandbox = shouldEnableSandbox(source);
        const renderCode = (code: string) =>
          md.render(`\`\`\`vue\n${code}${code.endsWith("\n") ? "" : "\n"}\`\`\``);
        const encodedDescription = encodeURIComponent(md.render(description));
        const sourceItems = [
          { label: "TS", raw: source, rendered: renderCode(source) },
          { label: "JS", raw: jsSource, rendered: renderCode(jsSource) }
        ];

        setDemoSource(demoPath, sourceItems);

        return `<Demo :source-loader="${componentName}SourceLoader" path="${demoPath}" description="${encodedDescription}"${needsSandbox ? " sandbox" : ""}>
  <template #source><${componentName} /></template>`;
      }

      return "</Demo>\n";
    }
  };
}

export function demoMdPlugin(md: MarkdownRenderer) {
  md.use(mdContainer, "demo", createDemoContainer(md));
}
