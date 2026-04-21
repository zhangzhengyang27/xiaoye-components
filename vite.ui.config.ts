import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { defineConfig } from "vite";
import { workspaceAlias } from "./scripts/config/aliases";

const resolvePath = (target: string) => fileURLToPath(new URL(target, import.meta.url));

export default defineConfig({
  plugins: [
    vue(),
    dts({
      root: resolvePath("."),
      entryRoot: resolvePath("packages/xiaoye-ui"),
      tsconfigPath: resolvePath("tsconfig.build.json"),
      include: [
        "packages/xiaoye-ui/src/**/*.ts",
        "packages/xiaoye-ui/src/**/*.vue"
      ],
      exclude: [
        "packages/**/__tests__/**",
        "packages/**/dist/**",
        "packages/**/*.spec.ts",
        "packages/**/*.test.ts",
        "tests/**",
        "apps/**"
      ],
      outDir: resolvePath("packages/xiaoye-ui/dist/types"),
      insertTypesEntry: true,
      staticImport: true,
      copyDtsFiles: false,
      strictOutput: true,
      pathsToAliases: false
    })
  ],
  resolve: {
    alias: workspaceAlias
  },
  build: {
    lib: {
      entry: resolvePath("./packages/xiaoye-ui/src/index.ts"),
      name: "XiaoyeUi",
      fileName: "index",
      formats: ["es"]
    },
    outDir: resolvePath("./packages/xiaoye-ui/dist"),
    emptyOutDir: true,
    rollupOptions: {
      external: ["vue", "xiaoye-primitives", "xiaoye-components"],
      output: {
        globals: {
          vue: "Vue",
          "xiaoye-primitives": "XiaoyePrimitives",
          "xiaoye-components": "XiaoyeComponents"
        }
      }
    }
  }
});
