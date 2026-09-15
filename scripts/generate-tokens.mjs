#!/usr/bin/env node
/**
 * 从 tokens.css 生成 packages/tokens 的 TS 常量层。
 *
 * tokens.css 是设计令牌的唯一事实源；本脚本解析其中的基元层 / 语义层 / 刻度层
 * 自定义属性，生成带类型的 TS 常量，供需要在 JS 运行时读取令牌的场景使用。
 * 生成物不手工编辑，改动令牌后执行：`node scripts/generate-tokens.mjs`
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cssPath = resolve(root, "packages/xiaoye-primitives/src/theme/tokens.css");
const outDir = resolve(root, "packages/tokens/src");

const css = readFileSync(cssPath, "utf-8");

// 只取兼容层之前的内容，并拆分亮色块 / 暗色块
const start = css.indexOf(":root");
const beforeCompat = css.slice(start, css.indexOf("@deprecated", start));
const darkStart = beforeCompat.indexOf('[data-theme="dark"]');
const lightBlock = beforeCompat.slice(0, darkStart);
const darkBlock = beforeCompat.slice(darkStart);
const propRegex = /(--xy-[a-z0-9-]+)\s*:\s*([^;]+);/g;

const groups = {
  primitives: [],
  semantic: [],
  scales: []
};

function classify(name) {
  if (/^--xy-(gray|purple|green|amber|red|blue)-\d+$/.test(name)) return "primitives";
  if (
    /^--xy-(text-|bg-|border|fill-|brand|success|warning|danger|info|focus-|overlay-|shadow-\d|z-)/.test(
      name
    )
  ) {
    return "semantic";
  }
  return "scales";
}

const toCamel = (name) =>
  name
    .replace(/^--xy-/, "")
    .split("-")
    .map((seg, i) =>
      i === 0 ? seg : seg.charAt(0).toUpperCase() + seg.slice(1)
    )
    .join("");

let match;
while ((match = propRegex.exec(lightBlock)) !== null) {
  const [, name, rawValue] = match;
  const value = rawValue.replace(/\s+/g, " ").trim();
  groups[classify(name)].push([toCamel(name), value, name]);
}

let darkMatch;
const darkSemantic = [];
while ((darkMatch = propRegex.exec(darkBlock)) !== null) {
  const [, name, rawValue] = darkMatch;
  const value = rawValue.replace(/\s+/g, " ").trim();
  if (classify(name) === "semantic") {
    darkSemantic.push([toCamel(name), value, name]);
  }
}

function render(section, entries, comment) {
  const lines = [`/** ${comment} */`, `export const ${section} = {`];
  for (const [key, value] of entries) {
    lines.push(`  ${JSON.stringify(key)}: ${JSON.stringify(value)},`);
  }
  lines.push("} as const;", "");
  return lines.join("\n");
}

const header =
  "// 此文件由 scripts/generate-tokens.mjs 从 tokens.css 自动生成，不要手工编辑。\n\n";

const primitiveBody = render("colorPrimitives", groups.primitives, "基元层色板（Stripe 色板，双主题共享）");

const semanticBody = render(
  "semanticTokens",
  groups.semantic,
  "语义层令牌（亮色主题值；暗色见 darkSemanticTokens）"
);

const darkSemanticBody = render(
  "darkSemanticTokens",
  darkSemantic,
  "语义层令牌（暗色主题 [data-theme=dark] 的覆写值）"
);

const scaleBody = render("scaleTokens", groups.scales, "刻度层令牌（与主题无关）");

mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "primitives.ts"), header + primitiveBody);
writeFileSync(
  resolve(outDir, "semantic.ts"),
  header + semanticBody + "\n" + darkSemanticBody
);
writeFileSync(resolve(outDir, "scales.ts"), header + scaleBody);

const indexBody = `export * from "./primitives";
export * from "./semantic";
export * from "./scales";
`;
writeFileSync(resolve(outDir, "index.ts"), indexBody);

console.log(
  `生成完成: primitives ${groups.primitives.length} 项, semantic ${groups.semantic.length} 项(暗色 ${darkSemantic.length} 项), scales ${groups.scales.length} 项`
);
