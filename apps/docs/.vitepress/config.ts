import { defineConfig } from "vitepress";
import { componentDocsSidebarGroups } from "../../../packages/components/component-manifest";
import {
  proComponentDocsSidebarGroups,
  proComponentExampleSidebarGroups
} from "../../../packages/pro-components/component-manifest";
import { uiComponentDocsSidebarGroups } from "../../../packages/xiaoye-ui/component-manifest";
import { workspaceAlias } from "../../../scripts/config/aliases";
import { demoMdPlugin } from "./plugins/demo";
import { demoSourcePlugin } from "./plugins/demo-source";
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
      { text: "前台组件", link: "/front/overview" },
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
      "/front/": [
        ...uiComponentDocsSidebarGroups
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
          .filter((group) => group.items.length > 0),
        {
          text: "前台组件示例",
          collapsed: false,
          items: [
            { text: "ProductCard 商品卡片", link: "/examples/front/product-card" },
            { text: "MarketingModal 营销弹层", link: "/examples/front/marketing-modal" },
            { text: "ImageGallery 图片画廊", link: "/examples/front/image-gallery" },
            { text: "SkuSelector SKU选择器", link: "/examples/front/sku-selector" },
            { text: "AddressPicker 地址选择器", link: "/examples/front/address-picker" }
          ]
        }
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
