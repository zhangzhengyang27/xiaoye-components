import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitepress";

const resolvePath = (target: string) => fileURLToPath(new URL(target, import.meta.url));

export default defineConfig({
  title: "xiaoye-components",
  description: "面向中后台系统的 Vue 3 组件库",
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: "指南", link: "/guide/quick-start" },
      { text: "组件", link: "/components/overview" },
      { text: "示例", link: "/examples/admin" }
    ],
    sidebar: {
      "/guide/": [
        {
          text: "开始",
          items: [
            { text: "快速开始", link: "/guide/quick-start" },
            { text: "Why xiaoye-components", link: "/guide/why-xiaoye" }
          ]
        }
      ],
      "/components/": [
        {
          text: "组件",
          items: [
            { text: "总览", link: "/components/overview" },
            { text: "基础与表单", link: "/components/basic-form" },
            { text: "反馈与数据展示", link: "/components/feedback-data" }
          ]
        }
      ],
      "/examples/": [
        {
          text: "示例",
          items: [{ text: "Mini Admin Demo", link: "/examples/admin" }]
        }
      ]
    },
    socialLinks: [{ icon: "github", link: "https://github.com/xiaoye/xiaoye-components" }]
  },
  vite: {
    resolve: {
      alias: {
        "xiaoye-components": resolvePath("../../../packages/xiaoye-components/index.ts"),
        "xiaoye-components/style.css": resolvePath(
          "../../../packages/xiaoye-components/style.css"
        ),
        "@xiaoye/components": resolvePath("../../../packages/components/index.ts"),
        "@xiaoye/composables": resolvePath("../../../packages/composables/index.ts"),
        "@xiaoye/utils": resolvePath("../../../packages/utils/index.ts"),
        "@xiaoye/theme": resolvePath("../../../packages/theme/index.css"),
        "@xiaoye/tokens": resolvePath("../../../packages/tokens/src/index.ts")
      }
    }
  }
});

