import path from "node:path";
import type { Plugin } from "vite";
import { extractDemoPaths, getDemoComponentName } from "../utils/demo";

function injectImports(code: string, id: string, demoPaths: string[]) {
  const imports = demoPaths.map((demoPath) => {
    const componentName = getDemoComponentName(demoPath);
    const examplePath = path.resolve(path.dirname(id), "../examples", `${demoPath}.vue`);
    let relativePath = path.relative(path.dirname(id), examplePath).replaceAll(path.sep, "/");

    if (!relativePath.startsWith(".")) {
      relativePath = `./${relativePath}`;
    }

    return `import ${componentName} from "${relativePath}";`;
  });

  const existingScriptSetup = code.match(/<script\s+setup\b[^>]*>/);

  if (existingScriptSetup?.index !== undefined) {
    const insertAt = existingScriptSetup.index + existingScriptSetup[0].length;

    return `${code.slice(0, insertAt)}\n${imports.join("\n")}${code.slice(insertAt)}`;
  }

  const script = `
<script setup lang="ts">
${imports.join("\n")}
</script>
`;

  const frontmatterEnds = code.indexOf("---\n", 3);

  if (frontmatterEnds >= 0) {
    return `${code.slice(0, frontmatterEnds + 4)}\n${script}${code.slice(frontmatterEnds + 4)}`;
  }

  return `${script}\n${code}`;
}

export function markdownTransform(): Plugin {
  return {
    name: "xiaoye-docs-md-transform",
    enforce: "pre",
    transform(code, id) {
      if (!id.endsWith(".md")) {
        return;
      }

      const docsRoot = `${path.sep}apps${path.sep}docs${path.sep}`;
      const isComponentDoc = id.includes(`${docsRoot}components${path.sep}`);
      const isExampleDoc = id.includes(`${docsRoot}examples${path.sep}`);

      if (!isComponentDoc && !isExampleDoc) {
        return;
      }

      const demoPaths = extractDemoPaths(code);

      if (!demoPaths.length) {
        return;
      }

      return injectImports(code, id, demoPaths);
    }
  };
}
