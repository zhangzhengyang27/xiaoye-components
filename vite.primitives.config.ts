import { fileURLToPath } from "node:url";
import { createLibraryConfig } from "./scripts/config/library-build";

const resolvePath = (target: string) => fileURLToPath(new URL(target, import.meta.url));

export default createLibraryConfig({
  entry: resolvePath("./packages/xiaoye-primitives/index.ts"),
  name: "XiaoyePrimitives",
  outDir: resolvePath("./packages/xiaoye-primitives/dist"),
  dtsInclude: [
    "packages/xiaoye-primitives/src/**/*.ts",
    "packages/tokens/**/*.ts"
  ]
});
