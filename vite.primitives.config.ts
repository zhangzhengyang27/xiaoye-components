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
      entryRoot: resolvePath("packages/xiaoye-primitives"),
      tsconfigPath: resolvePath("tsconfig.build.json"),
      include: [
        "packages/xiaoye-primitives/src/**/*.ts",
        "packages/xiaoye-primitives/src/**/*.css"
      ],
      exclude: [
        "packages/**/__tests__/**",
        "packages/**/dist/**",
        "packages/**/*.spec.ts",
        "packages/**/*.test.ts",
        "tests/**",
        "apps/**"
      ],
      outDir: resolvePath("packages/xiaoye-primitives/dist/types"),
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
      entry: resolvePath("./packages/xiaoye-primitives/index.ts"),
      name: "XiaoyePrimitives",
      fileName: "index",
      formats: ["es"]
    },
    outDir: resolvePath("./packages/xiaoye-primitives/dist"),
    emptyOutDir: true,
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue"
        }
      }
    }
  }
});
