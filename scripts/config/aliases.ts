import { fileURLToPath, URL } from "node:url";

const resolveWorkspacePath = (target: string) => fileURLToPath(new URL(target, import.meta.url));

export const workspaceAlias = [
  {
    find: "@xiaoye/pro-components/style.css",
    replacement: resolveWorkspacePath("../../packages/pro-components/style.css")
  },
  {
    find: "xiaoye-pro-components/style.css",
    replacement: resolveWorkspacePath("../../packages/xiaoye-pro-components/style.css")
  },
  {
    find: "xiaoye-components/style.css",
    replacement: resolveWorkspacePath("../../packages/xiaoye-components/style.css")
  },
  {
    find: "@xiaoye/components",
    replacement: resolveWorkspacePath("../../packages/components/index.ts")
  },
  {
    find: /^@xiaoye\/components\/(.*)$/,
    replacement: `${resolveWorkspacePath("../../packages/components/")}/$1`
  },
  {
    find: "@xiaoye/pro-components",
    replacement: resolveWorkspacePath("../../packages/pro-components/index.ts")
  },
  {
    find: /^@xiaoye\/pro-components\/(.*)$/,
    replacement: `${resolveWorkspacePath("../../packages/pro-components/")}/$1`
  },
  {
    find: "@xiaoye/frontline",
    replacement: resolveWorkspacePath("../../packages/frontline/index.ts")
  },
  {
    find: /^@xiaoye\/frontline\/(.*)$/,
    replacement: `${resolveWorkspacePath("../../packages/frontline/")}/$1`
  },
  {
    find: "@xiaoye/composables",
    replacement: resolveWorkspacePath("../../packages/composables/index.ts")
  },
  {
    find: "@xiaoye/theme",
    replacement: resolveWorkspacePath("../../packages/theme/index.css")
  },
  {
    find: "@xiaoye/utils",
    replacement: resolveWorkspacePath("../../packages/utils/index.ts")
  },
  {
    find: "@xiaoye/tokens",
    replacement: resolveWorkspacePath("../../packages/tokens/src/index.ts")
  },
  {
    find: "rrule",
    replacement: resolveWorkspacePath("../../packages/utils/compat/rrule.js")
  },
  {
    find: "xiaoye-components",
    replacement: resolveWorkspacePath("../../packages/xiaoye-components/index.ts")
  },
  {
    find: "xiaoye-pro-components",
    replacement: resolveWorkspacePath("../../packages/xiaoye-pro-components/index.ts")
  },
  {
    find: "xiaoye-frontline",
    replacement: resolveWorkspacePath("../../packages/frontline/index.ts")
  }
] as const;
