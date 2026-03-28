import { fileURLToPath, URL } from "node:url";

const resolveWorkspacePath = (target: string) => fileURLToPath(new URL(target, import.meta.url));

export const workspaceAlias = {
  "@xiaoye/components": resolveWorkspacePath("../../packages/components/index.ts"),
  "@xiaoye/components/": resolveWorkspacePath("../../packages/components/"),
  "@xiaoye/composables": resolveWorkspacePath("../../packages/composables/index.ts"),
  "@xiaoye/theme": resolveWorkspacePath("../../packages/theme/index.css"),
  "@xiaoye/utils": resolveWorkspacePath("../../packages/utils/index.ts"),
  "@xiaoye/tokens": resolveWorkspacePath("../../packages/tokens/src/index.ts"),
  rrule: resolveWorkspacePath("../../packages/utils/compat/rrule.js"),
  "xiaoye-components": resolveWorkspacePath("../../packages/xiaoye-components/index.ts"),
  "xiaoye-components/style.css": resolveWorkspacePath("../../packages/xiaoye-components/style.css")
} as const;
