---
layout: home
title: xiaoye-components
titleTemplate: false
hero:
  name: xiaoye-components
  text: 企业级 Vue 3 组件库
  tagline: 基础组件 + 中后台增强组件 + 完整 TypeScript 支持
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quick-start
    - theme: alt
      text: 组件总览
      link: /components/overview
    - theme: alt
      text: 增强组件
      link: /pro-components/overview
    - theme: alt
      text: 后台迁移指南
      link: /guide/backend-migration
    - theme: alt
      text: 在线试用
      link: https://stackblitz.com/github/xiaoye/xiaoye-components
      target: _blank
features:
  - title: 🎨 主题定制
    details: CSS 变量驱动，支持企业品牌色一键替换，可自行扩展暗黑模式。
  - title: 📦 双层架构
    details: 基础层承接通用组件，增强层面向中后台闭环场景，按需引入，Tree Shaking 友好。
  - title: 🔧 TypeScript 优先
    details: 完整类型定义，智能提示友好，编译时类型检查，运行时零性能损耗。
  - title: ♿ 无障碍访问
    details: 遵循 WAI-ARIA 规范，原生键盘导航支持，屏幕阅读器兼容。
  - title: 🌍 国际化支持
    details: 内置中文/英文语言包，支持扩展自定义翻译，适配多语言业务场景。
  - title: ⚡ 开箱即用
    details: 页面级容器、请求表单、列表编排等开箱即用，减少重复样板代码。
---

## 为什么选择 xiaoye-components？

### 基础层：通用且中性

基础层提供 **72+** 个高质量组件，覆盖按钮、表单、数据展示、反馈提示、导航布局等常见场景。所有组件保持设计中性，不绑定特定业务风格，适合各类中后台系统。

### 增强层：面向中后台闭环

增强层在基础层之上，提供 **30+** 个业务增强组件：
- **表单增强**：SearchForm、ProForm、DialogForm、DrawerForm、StepsForm
- **列表增强**：ProTable、ListPage、CrudPage、ColumnSettingPanel
- **详情增强**：DetailPage、DetailPanel、AuditTimeline
- **页面增强**：PageContainer、PageHeader、StatCard、SplitLayoutPage

### 设计理念

:::tip 核心原则
文档优先采用"示例在前，解释在后，API 摘要放最后"的结构。你可以先判断组件能不能解决当前问题，再决定要不要细看属性表。
:::

## 推荐阅读顺序

1. 从 [快速开始](/guide/quick-start) 了解基础层与增强层的接入方式
2. 在 [组件总览](/components/overview) 里建立基础层能力地图
3. 如果你在做中后台页面闭环，直接进入 [增强组件总览](/pro-components/overview)
4. 再进入具体组件页查 API 和示例
5. 最后看 [管理后台闭环示例](/examples/admin)，确认真实组合方式

## 技术栈兼容性

| 技术 | 版本要求 |
|------|----------|
| Vue | ^3.5.0 |
| TypeScript | ^5.0.0 |
| 构建工具 | Vite / Webpack / esbuild |

## 许可证

[MIT License](https://opensource.org/licenses/MIT)
