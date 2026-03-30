import { fileURLToPath, URL } from "node:url";
import { createLibraryConfig } from "./scripts/config/library-build";

const resolvePath = (target: string) => fileURLToPath(new URL(target, import.meta.url));

export default createLibraryConfig({
  entry: resolvePath("./packages/xiaoye-pro-components/index.ts"),
  name: "XiaoyeProComponents",
  outDir: resolvePath("./packages/xiaoye-pro-components/dist"),
  dtsInclude: [
    "packages/pro-components/**/*.ts",
    "packages/pro-components/**/*.vue",
    "packages/xiaoye-pro-components/**/*.ts"
  ]
});
