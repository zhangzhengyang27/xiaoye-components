import { defineConfig } from "vitepress";
import { componentDocsSidebarGroups } from "../../../packages/components/component-manifest";
import {
  proComponentDocsSidebarGroups,
  proComponentExampleSidebarGroups
} from "../../../packages/pro-components/component-manifest";
import { workspaceAlias } from "../../../scripts/config/aliases";
import { demoMdPlugin } from "./plugins/demo";
import { markdownTransform } from "./plugins/markdown-transform";
import { tableWrapperMdPlugin } from "./plugins/table-wrapper";

export default defineConfig({
  title: "xiaoye-components",
  description: "通用基础组件库 + 中后台业务增强组件库",
  head: [["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }]],
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
      { text: "增强", link: "/pro-components/overview" },
      { text: "示例", link: "/examples/admin" }
    ],
    sidebar: {
      "/guide/": [
        {
          text: "开始",
          items: [
            { text: "快速开始", link: "/guide/quick-start" },
            { text: "设计理念", link: "/guide/why-xiaoye" },
            { text: "可访问性约定", link: "/guide/accessibility" }
          ]
        }
      ],
      "/components/": [
        {
          text: "总览",
          items: [{ text: "组件总览", link: "/components/overview" }]
        },
        ...componentDocsSidebarGroups
      ],
      "/pro-components/": [
        {
          text: "总览",
          items: [{ text: "增强组件总览", link: "/pro-components/overview" }]
        },
        ...proComponentDocsSidebarGroups
      ],
      "/examples/": [
        {
          text: "页面示例",
          items: [
            { text: "管理后台闭环示例", link: "/examples/admin" },
            { text: "Skeleton 场景示例", link: "/examples/skeleton" },
            { text: "Timeline 场景示例", link: "/examples/timeline" },
            { text: "Scheduler 场景示例", link: "/examples/scheduler" },
            { text: "Scheduler 业务接入模板", link: "/examples/scheduler-template" }
          ]
        },
        {
          text: "增强组件示例",
          items: [{ text: "增强组件总览", link: "/examples/pro/overview" }]
        },
        ...proComponentExampleSidebarGroups
          .map((group) => ({
            text: group.text,
            items: group.items
          }))
          .filter((group) => group.items.length > 0)
      ]
    },
    socialLinks: [{ icon: "github", link: "https://github.com/xiaoye/xiaoye-components" }]
  },
  markdown: {
    config(md) {
      demoMdPlugin(md);
      tableWrapperMdPlugin(md);
    }
  },
  vite: {
    plugins: [markdownTransform()],
    resolve: {
      alias: workspaceAlias
    }
  }
});
