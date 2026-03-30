import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mdContainer from "markdown-it-container";
import type { MarkdownRenderer } from "vitepress";
import { getDemoComponentName } from "../utils/demo";
import { sfcTs2js } from "../utils/ts2js";

interface ContainerOpts {
  marker?: string | undefined;
  validate?(params: string): boolean;
  render?: MarkdownRenderer["renderer"]["rules"]["container"];
}

const docsRoot = fileURLToPath(new URL("../../", import.meta.url));
const examplesRoot = path.resolve(docsRoot, "examples");
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
        const description = matched?.[1] ?? "";
        const sourceFileToken = tokens[idx + 2];
        const sourceFile = sourceFileToken.children?.[0]?.content?.trim() ?? "";
        const sourcePath = path.resolve(examplesRoot, `${sourceFile}.vue`);

        if (!sourceFile || !fs.existsSync(sourcePath)) {
          throw new Error(`Incorrect source file: ${sourceFile}`);
        }

        const source = fs.readFileSync(sourcePath, "utf-8");
        const jsSource = sfcTs2js(source);
        const componentName = getDemoComponentName(sourceFile);
        const needsSandbox = shouldEnableSandbox(source);
        const renderCode = (code: string) =>
          md.render(`\`\`\`vue\n${code}${code.endsWith("\n") ? "" : "\n"}\`\`\``);
        const sources = encodeURIComponent(
          JSON.stringify([
            { label: "TS", raw: source, rendered: renderCode(source) },
            { label: "JS", raw: jsSource, rendered: renderCode(jsSource) }
          ])
        );
        const encodedDescription = encodeURIComponent(md.render(description));

        return `<Demo sources="${sources}" path="${sourceFile}" description="${encodedDescription}"${needsSandbox ? " sandbox" : ""}>
  <template #source><${componentName} /></template>`;
      }

      return "</Demo>\n";
    }
  };
}

export function demoMdPlugin(md: MarkdownRenderer) {
  md.use(mdContainer, "demo", createDemoContainer(md));
}
