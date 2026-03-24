import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

const resolvePath = (target: string) => fileURLToPath(new URL(target, import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@xiaoye/components": resolvePath("./packages/components/index.ts"),
      "@xiaoye/components/": resolvePath("./packages/components/"),
      "@xiaoye/composables": resolvePath("./packages/composables/index.ts"),
      "@xiaoye/theme": resolvePath("./packages/theme/index.css"),
      "@xiaoye/utils": resolvePath("./packages/utils/index.ts"),
      "@xiaoye/tokens": resolvePath("./packages/tokens/src/index.ts"),
      rrule: resolvePath("./packages/utils/compat/rrule.js"),
      "xiaoye-components": resolvePath("./packages/xiaoye-components/index.ts"),
      "xiaoye-components/style.css": resolvePath("./packages/xiaoye-components/style.css")
    }
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: []
  }
});
