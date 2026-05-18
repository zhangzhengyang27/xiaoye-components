import { fileURLToPath, URL } from "node:url";

const resolveWorkspacePath = (target: string) => fileURLToPath(new URL(target, import.meta.url));

export const workspaceAlias = [
  // CSS files (must come before the general @xiaoye/primitives alias)
  {
    find: "@xiaoye/primitives/style.css",
    replacement: resolveWorkspacePath("../../packages/xiaoye-primitives/style.css")
  },
  {
    find: "xiaoye-primitives/style.css",
    replacement: resolveWorkspacePath("../../packages/xiaoye-primitives/style.css")
  },
  // @xiaoye/pro-components
  {
    find: "@xiaoye/pro-components/style.css",
    replacement: resolveWorkspacePath("../../packages/pro-components/style.css")
  },
  {
    find: "xiaoye-pro-components/style.css",
    replacement: resolveWorkspacePath("../../packages/pro-components/style.css")
  },
  {
    find: "xiaoye-components/style.css",
    replacement: resolveWorkspacePath("../../packages/components/style.css")
  },
  // @xiaoye/components (exact matches before regex)
  {
    find: "@xiaoye/components/icon",
    replacement: resolveWorkspacePath("../../packages/components/icon/index.ts")
  },
  {
    find: "@xiaoye/components/badge",
    replacement: resolveWorkspacePath("../../packages/components/badge/index.ts")
  },
  {
    find: "@xiaoye/components/image",
    replacement: resolveWorkspacePath("../../packages/components/image/index.ts")
  },
  {
    find: "@xiaoye/components/input",
    replacement: resolveWorkspacePath("../../packages/components/input/index.ts")
  },
  {
    find: "@xiaoye/components/image/src/image-viewer.vue",
    replacement: resolveWorkspacePath("../../packages/components/image/src/image-viewer.vue")
  },
  {
    find: "@xiaoye/components",
    replacement: resolveWorkspacePath("../../packages/components/index.ts")
  },
  {
    find: "@xiaoye/components/config-provider",
    replacement: resolveWorkspacePath("../../packages/components/config-provider/index.ts")
  },
  {
    find: "@xiaoye/components/src/composables",
    replacement: resolveWorkspacePath("../../packages/components/src/composables/index.ts")
  },
  {
    find: /^@xiaoye\/components\/(.*)$/,
    replacement: `${resolveWorkspacePath("../../packages/components/")}/$1`
  },
  // @xiaoye/pro-components
  {
    find: "@xiaoye/pro-components",
    replacement: resolveWorkspacePath("../../packages/pro-components/index.ts")
  },
  {
    find: /^@xiaoye\/pro-components\/(.*)$/,
    replacement: `${resolveWorkspacePath("../../packages/pro-components/")}/$1`
  },
  // @xiaoye/primitives (general, comes AFTER css-specific aliases)
  {
    find: "@xiaoye/primitives",
    replacement: resolveWorkspacePath("../../packages/xiaoye-primitives/index.ts")
  },
  {
    find: /^@xiaoye\/primitives\/(.*)$/,
    replacement: `${resolveWorkspacePath("../../packages/xiaoye-primitives/")}/$1`
  },
  // @xiaoye/theme
  {
    find: "@xiaoye/theme",
    replacement: resolveWorkspacePath("../../packages/theme/index.css")
  },
  // xiaoye-primitives (bare import)
  {
    find: "xiaoye-primitives",
    replacement: resolveWorkspacePath("../../packages/xiaoye-primitives/index.ts")
  },
  // @xiaoye/utils
  {
    find: "@xiaoye/utils",
    replacement: resolveWorkspacePath("../../packages/xiaoye-primitives/src/utils/index.ts")
  },
  // @xiaoye/tokens
  {
    find: "@xiaoye/tokens",
    replacement: resolveWorkspacePath("../../packages/tokens/src/index.ts")
  },
  // rrule compat
  {
    find: "rrule",
    replacement: resolveWorkspacePath("../../packages/xiaoye-primitives/src/utils/compat/rrule.js")
  },
  // xiaoye-components (bare import)
  {
    find: "xiaoye-components",
    replacement: resolveWorkspacePath("../../packages/components/index.ts")
  },
  {
    find: /^xiaoye-components\/(.*)$/,
    replacement: `${resolveWorkspacePath("../../packages/components/")}/$1`
  },
  {
    find: "xiaoye-pro-components",
    replacement: resolveWorkspacePath("../../packages/pro-components/index.ts")
  }
] as const;
