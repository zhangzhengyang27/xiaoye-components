import { fileURLToPath, URL } from "node:url";
import { createLibraryConfig } from "./scripts/config/library-build";

const resolvePath = (target: string) => fileURLToPath(new URL(target, import.meta.url));

export default createLibraryConfig({
  entry: resolvePath("./packages/xiaoye-components/index.ts"),
  name: "XiaoyeComponents",
  outDir: resolvePath("./packages/xiaoye-components/dist"),
  dtsInclude: [
    "packages/components/**/*.ts",
    "packages/components/**/*.vue",
    "packages/composables/**/*.ts",
    "packages/utils/**/*.ts",
    "packages/tokens/**/*.ts",
    "packages/xiaoye-components/**/*.ts"
  ]
});
