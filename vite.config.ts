import { fileURLToPath, URL } from "node:url";
import path from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { workspaceAlias } from "./scripts/config/aliases";

const resolvePath = (target: string) => fileURLToPath(new URL(target, import.meta.url));

export default defineConfig({
  plugins: [
    vue(),
    dts({
      root: path.resolve("."),
      entryRoot: path.resolve("packages"),
      tsconfigPath: path.resolve("tsconfig.build.json"),
      include: ["packages/**/*.ts", "packages/**/*.vue"],
      exclude: [
        "packages/**/__tests__/**",
        "packages/**/*.spec.ts",
        "packages/**/*.test.ts",
        "tests/**",
        "apps/**"
      ],
      outDir: path.resolve("packages/xiaoye-components/dist/types"),
      insertTypesEntry: true,
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
      entry: resolvePath("./packages/xiaoye-components/index.ts"),
      name: "XiaoyeComponents",
      fileName: "index",
      formats: ["es"]
    },
    outDir: resolvePath("./packages/xiaoye-components/dist"),
    emptyOutDir: true,
    rollupOptions: {
      external: [
        "vue",
        "@iconify/vue",
        "@floating-ui/dom",
        "async-validator",
        "@fullcalendar/core",
        "@fullcalendar/core/locales/zh-cn",
        "@fullcalendar/daygrid",
        "@fullcalendar/interaction",
        "@fullcalendar/timegrid",
        "@fullcalendar/vue3"
      ],
      output: {
        globals: {
          vue: "Vue"
        }
      }
    }
  }
});
