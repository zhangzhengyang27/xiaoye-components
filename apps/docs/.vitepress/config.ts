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
        {
          text: "基础组件",
          items: [
            { text: "Button 按钮", link: "/components/button" },
            { text: "Link 文字链接", link: "/components/link" },
            { text: "Breadcrumb 面包屑", link: "/components/breadcrumb" },
            { text: "Text 文本", link: "/components/text" },
            { text: "Badge 徽章", link: "/components/badge" },
            { text: "Avatar 头像", link: "/components/avatar" },
            { text: "Image 图片", link: "/components/image" },
            { text: "Card 卡片", link: "/components/card" },
            { text: "Carousel 走马灯", link: "/components/carousel" },
            { text: "Affix 固钉", link: "/components/affix" },
            { text: "Anchor 锚点", link: "/components/anchor" },
            { text: "Menu 菜单", link: "/components/menu" },
            { text: "Row 栅格行", link: "/components/row" },
            { text: "Col 栅格列", link: "/components/col" },
            { text: "Scrollbar 滚动条", link: "/components/scrollbar" },
            { text: "Splitter 分隔面板", link: "/components/splitter" },
            { text: "Divider 分割线", link: "/components/divider" },
            { text: "Icon 图标", link: "/components/icon" },
            { text: "Tag 标签", link: "/components/tag" },
            { text: "Space 间距", link: "/components/space" },
            { text: "Tabs 标签页", link: "/components/tabs" }
          ]
        },
        {
          text: "表单与录入",
          items: [
            { text: "Config Provider 全局配置", link: "/components/config-provider" },
            { text: "Input 输入框", link: "/components/input" },
            { text: "Radio 单选框", link: "/components/radio" },
            { text: "Checkbox 复选框", link: "/components/checkbox" },
            { text: "Switch 开关", link: "/components/switch" },
            { text: "InputTag 标签输入框", link: "/components/input-tag" },
            { text: "Input Number 数字输入框", link: "/components/input-number" },
            { text: "Rate 评分", link: "/components/rate" },
            { text: "Slider 滑块", link: "/components/slider" },
            { text: "DatePicker 日期选择器", link: "/components/date-picker" },
            { text: "TimePicker 时间选择器", link: "/components/time-picker" },
            { text: "TimeSelect 时间选择", link: "/components/time-select" },
            { text: "Select 选择器", link: "/components/select" },
            { text: "Form 表单", link: "/components/form" },
            { text: "Upload 上传", link: "/components/upload" }
          ]
        },
        {
          text: "反馈与浮层",
          items: [
            { text: "Alert 提示", link: "/components/alert" },
            { text: "Message 消息提示", link: "/components/message" },
            { text: "Notification 通知", link: "/components/notification" },
            { text: "Backtop 回到顶部", link: "/components/backtop" },
            { text: "Collapse 折叠面板", link: "/components/collapse" },
            { text: "Empty 空状态", link: "/components/empty" },
            { text: "Loading 加载", link: "/components/loading" },
            { text: "Skeleton 骨架屏", link: "/components/skeleton" },
            { text: "Result 结果", link: "/components/result" },
            { text: "Tooltip 文字提示", link: "/components/tooltip" },
            { text: "Popover 气泡卡片", link: "/components/popover" },
            { text: "Popconfirm 气泡确认框", link: "/components/popconfirm" },
            { text: "Dropdown 下拉菜单", link: "/components/dropdown" },
            { text: "Dialog 对话框", link: "/components/dialog" },
            { text: "Drawer 抽屉", link: "/components/drawer" }
          ]
        },
        {
          text: "数据展示",
          items: [
            { text: "Statistic 统计数值", link: "/components/statistic" },
            { text: "Countdown 倒计时", link: "/components/countdown" },
            { text: "Progress 进度条", link: "/components/progress" },
            { text: "Steps 步骤条", link: "/components/steps" },
            { text: "Timeline 时间线", link: "/components/timeline" },
            { text: "Scheduler 排期日历", link: "/components/scheduler" },
            { text: "Tree 树形控件", link: "/components/tree" },
            { text: "Table 表格", link: "/components/table" },
            { text: "Pagination 分页", link: "/components/pagination" }
          ]
        }
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
        "@xiaoye/tokens": resolvePath("../../../packages/tokens/src/index.ts"),
        rrule: resolvePath("../../../packages/utils/compat/rrule.js")
      }
    }
  }
});
