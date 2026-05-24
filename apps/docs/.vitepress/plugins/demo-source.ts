import type { Plugin } from "vite";
import { getDemoSource } from "../utils/demo-source";

const VIRTUAL_PREFIX = "virtual:xy-demo-source:";
const RESOLVED_VIRTUAL_PREFIX = `\0${VIRTUAL_PREFIX}`;

// 缓存引用，用于热更新时清空
let registryRef: Map<string, unknown> | null = null;

export function demoSourcePlugin(): Plugin {
  return {
    name: "xiaoye-docs-demo-source",
    configureServer(server) {
      // 获取 registry 引用
      const { getDemoSourceRegistry } = require("../utils/demo-source") as {
        getDemoSourceRegistry: () => Map<string, unknown>;
      };
      registryRef = getDemoSourceRegistry();
    },
    handleHotUpdate({ file, server }) {
      if (file.endsWith(".vue") && registryRef) {
        registryRef.clear();
        server.ws.send({ type: "full-reload" });
      }
    },
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
