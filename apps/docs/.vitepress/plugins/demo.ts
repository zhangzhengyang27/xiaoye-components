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
        const renderCode = (code: string) =>
          md.render(`\`\`\`vue\n${code}${code.endsWith("\n") ? "" : "\n"}\`\`\``);
        const sources = encodeURIComponent(
          JSON.stringify([
            { label: "TS", raw: source, rendered: renderCode(source) },
            { label: "JS", raw: jsSource, rendered: renderCode(jsSource) }
          ])
        );
        const encodedDescription = encodeURIComponent(md.render(description));

        return `<Demo sources="${sources}" path="${sourceFile}" description="${encodedDescription}">
  <template #source><${componentName} /></template>`;
      }

      return "</Demo>\n";
    }
  };
}

export function demoMdPlugin(md: MarkdownRenderer) {
  md.use(mdContainer, "demo", createDemoContainer(md));
}
