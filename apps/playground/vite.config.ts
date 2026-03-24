import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const resolvePath = (target: string) => fileURLToPath(new URL(target, import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "xiaoye-components": resolvePath("../../packages/xiaoye-components/index.ts"),
      "xiaoye-components/style.css": resolvePath("../../packages/xiaoye-components/style.css"),
      "@xiaoye/components": resolvePath("../../packages/components/index.ts"),
      "@xiaoye/composables": resolvePath("../../packages/composables/index.ts"),
      "@xiaoye/utils": resolvePath("../../packages/utils/index.ts"),
      "@xiaoye/theme": resolvePath("../../packages/theme/index.css"),
      "@xiaoye/tokens": resolvePath("../../packages/tokens/src/index.ts"),
      rrule: resolvePath("../../packages/utils/compat/rrule.js")
    }
  }
});
