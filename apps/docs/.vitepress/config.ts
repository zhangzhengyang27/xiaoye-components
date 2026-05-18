import { defineConfig } from "vitepress";
import { componentDocsSidebarGroups } from "../../../packages/components/component-manifest";
import {
  proComponentDocsSidebarGroups,
  proComponentExampleSidebarGroups
} from "../../../packages/pro-components/component-manifest";
import { workspaceAlias } from "../../../scripts/config/aliases";
import { demoMdPlugin } from "./plugins/demo";
import { demoSourcePlugin } from "./plugins/demo-source";
import { markdownTransform } from "./plugins/markdown-transform";
import { tableWrapperMdPlugin } from "./plugins/table-wrapper";

export default defineConfig({
  title: "xiaoye-components",
  description: "通用基础组件库 + 中后台业务增强组件库",
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    ["meta", { property: "og:title", content: "xiaoye-components" }],
    ["meta", { property: "og:description", content: "企业级 Vue 3 组件库 — 基础组件 + 中后台增强组件 + 完整 TypeScript 支持" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { name: "keywords", content: "vue3, component library, typescript, xiaoye-components, 企业级组件库" }]
  ],
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    search: {
      provider: "local",
      options: {
        detailedView: false,
        locales: {
          root: {
            translations: {
              button: {
                buttonText: "搜索",
                buttonAriaLabel: "搜索文档"
              },
              modal: {
                noResultsText: "无法找到相关结果",
                resetButtonTitle: "清除查询条件",
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
                  closeText: "关闭"
                }
              }
            }
          }
        }
      }
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
    editLink: {
      pattern: "https://github.com/xiaoye/xiaoye-components/issues/new?title=文档反馈：:path&body=页面链接：https://xiaoye.github.io/xiaoye-components/:path",
      text: "发现文档问题？反馈给我们"
    },
    nav: [
      { text: "指南", link: "/guide/quick-start" },
      { text: "组件", link: "/components/overview" },
      { text: "增强", link: "/pro-components/overview" },
      { text: "示例", link: "/examples/admin" },
      { text: "设计令牌", link: "/design-tokens" },
      { text: "更新日志", link: "/changelog" }
    ],
    sidebar: {
      "/guide/": [
        {
          text: "入门",
          items: [
            { text: "快速开始", link: "/guide/quick-start" },
            { text: "设计理念", link: "/guide/why-xiaoye" }
          ]
        },
        {
          text: "定制",
          items: [
            { text: "主题定制", link: "/guide/theming" }
          ]
        },
        {
          text: "规范",
          items: [
            { text: "可访问性约定", link: "/guide/accessibility" },
            { text: "常见问题", link: "/guide/faq" }
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
    plugins: [markdownTransform(), demoSourcePlugin()],
    resolve: {
      alias: workspaceAlias
    },
    build: {
      cssCodeSplit: true,
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules/echarts")) {
              return "vendor-echarts";
            }

            if (
              id.includes("node_modules/video.js") ||
              id.includes("node_modules/vditor") ||
              id.includes("node_modules/howler")
            ) {
              return "vendor-media";
            }

            if (
              id.includes("node_modules/@fullcalendar") ||
              id.includes("node_modules/sortablejs") ||
              id.includes("node_modules/rrule")
            ) {
              return "vendor-scheduler";
            }
          }
        }
      }
    }
  }
});
