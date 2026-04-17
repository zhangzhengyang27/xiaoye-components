import type { Plugin } from "vite";
import { getDemoSource } from "../utils/demo-source";

const VIRTUAL_PREFIX = "virtual:xy-demo-source:";
const RESOLVED_VIRTUAL_PREFIX = `\0${VIRTUAL_PREFIX}`;

export function demoSourcePlugin(): Plugin {
  return {
    name: "xiaoye-docs-demo-source",
    resolveId(id) {
      if (!id.startsWith(VIRTUAL_PREFIX)) {
        return;
      }

      return `${RESOLVED_VIRTUAL_PREFIX}${id.slice(VIRTUAL_PREFIX.length)}`;
    },
    load(id) {
      if (!id.startsWith(RESOLVED_VIRTUAL_PREFIX)) {
        return;
      }

      const demoPath = id.slice(RESOLVED_VIRTUAL_PREFIX.length);
      const sources = getDemoSource(demoPath);

      if (!sources) {
        throw new Error(`Missing registered demo sources: ${demoPath}`);
      }

      return `export default ${JSON.stringify(sources)};`;
    }
  };
}
