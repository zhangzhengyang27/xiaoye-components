import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitepress";
import { demoMdPlugin } from "./plugins/demo";
import { markdownTransform } from "./plugins/markdown-transform";

const resolvePath = (target: string) => fileURLToPath(new URL(target, import.meta.url));

export default defineConfig({
  title: "xiaoye-components",
  description: "中后台优先的 Vue 3 组件库",
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    search: {
      provider: "local"
    },
    outlineTitle: "本页导航",
    lastUpdatedText: "最近更新",
    repo: "xiaoye/xiaoye-components",
    docsBranch: "main",
    docsDir: "apps/docs",
    docFooter: {
      prev: "上一页",
      next: "下一页"
    },
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
            { text: "设计理念", link: "/guide/why-xiaoye" }
          ]
        }
      ],
      "/components/": [
        {
          text: "总览",
          items: [{ text: "组件总览", link: "/components/overview" }]
        },
        {
          text: "按场景查看",
          items: [
            { text: "基础与表单组件", link: "/components/basic-form" },
            { text: "反馈与数据展示", link: "/components/feedback-data" }
          ]
        },
        {
          text: "API 与行为约定",
          items: [
            { text: "Button 按钮", link: "/components/button" },
            { text: "Row / Col 栅格", link: "/components/row" },
            { text: "DatePicker 日期选择器", link: "/components/date-picker" },
            { text: "Select 选择器", link: "/components/select" },
            { text: "Upload 上传", link: "/components/upload" },
            { text: "Table 表格", link: "/components/table" },
            { text: "Modal 弹窗", link: "/components/modal" },
            { text: "Tabs 标签页", link: "/components/tabs" },
            { text: "Tooltip 文字提示", link: "/components/tooltip" }
          ]
        }
      ],
      "/examples/": [
        {
          text: "页面示例",
          items: [{ text: "管理后台闭环示例", link: "/examples/admin" }]
        }
      ]
    },
    socialLinks: [{ icon: "github", link: "https://github.com/xiaoye/xiaoye-components" }]
  },
  markdown: {
    config(md) {
      demoMdPlugin(md);
    }
  },
  vite: {
    plugins: [markdownTransform()],
    resolve: {
      alias: {
        "xiaoye-components": resolvePath("../../../packages/xiaoye-components/index.ts"),
        "xiaoye-components/style.css": resolvePath("../../../packages/xiaoye-components/style.css"),
        "@xiaoye/components": resolvePath("../../../packages/components/index.ts"),
        "@xiaoye/composables": resolvePath("../../../packages/composables/index.ts"),
        "@xiaoye/utils": resolvePath("../../../packages/utils/index.ts"),
        "@xiaoye/theme": resolvePath("../../../packages/theme/index.css"),
        "@xiaoye/tokens": resolvePath("../../../packages/tokens/src/index.ts")
      }
    }
  }
});
