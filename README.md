# xiaoye-components

[![CI](https://github.com/zhangzhengyang27/xiaoye-components/actions/workflows/ci.yml/badge.svg)](https://github.com/zhangzhengyang27/xiaoye-components/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/xiaoye-components)](https://www.npmjs.com/package/xiaoye-components)
[![npm](https://img.shields.io/npm/v/xiaoye-pro-components)](https://www.npmjs.com/package/xiaoye-pro-components)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

`xiaoye-components` 是一个面向中后台系统的 Vue 3 组件库，主打低心智负担的 API、一致的类型体验和可直接落地的文档案例。

## 当前状态

- 已发布 npm：基础层 `xiaoye-components`（72 个组件）、增强层 `xiaoye-pro-components`（31 个组件）、基础设施 `xiaoye-primitives`、MCP Server `xiaoye-mcp-server`
- 在线文档：<https://xiaoye-components.zhangzhengyang.com/>
- 技术栈：`Vue 3 + TypeScript + Vite + pnpm`
- 版本与发布走 Changesets（push main 自动开 Version Packages PR，合并后自动发布）

## 场景选型

- 基础层：`packages/components` 对外提供通用基础组件，适合前台项目和后台项目共同复用。
- 增强层：`packages/pro-components` / `xiaoye-pro-components` 对外提供中后台业务增强组件，适合管理台、运营台、审核台、配置台这类高频业务页面。
- 前台项目：默认优先接入基础层；只有在需要后台式页面编排时，再谨慎引入增强层。
- 后台项目：默认同时接入基础层和增强层；如果页面关键词是“筛选、列表、批量、审批、审计、导入导出”，优先从增强层选型。

### 前台项目推荐优先接入

- 基础交互与展示：`button`、`icon`、`link`、`text`、`tag`、`badge`、`avatar`、`image`、`card`、`tabs`
- 导航与布局：`breadcrumb`、`anchor`、`row`、`col`、`space`
- 浮层与反馈：`dialog`、`drawer`、`tooltip`、`popover`、`dropdown`、`alert`、`message`、`notification`
- 常见输入：`input`、`select`、`radio`、`checkbox`、`switch`、`input-number`、`form`
- 内容与媒体：`upload`、`editor`、`audio-player`、`video-player`、`carousel`
- 状态与结果：`progress`、`result`、`empty`、`skeleton`

### 后台项目推荐优先接入

- 页面骨架：`PageContainer`、`PageHeader`、`PageToolbar`
- 列表主干：`SearchForm`、`ProTable`、`table`、`pagination`
- 编辑与详情：`OverlayForm`、`DetailPanel`、`DetailPage`
- 页面闭环：`ListPage`、`CrudPage`、`SplitLayoutPage`
- 筛选与视图：`FilterPanel`、`TableFilterDrawer`、`ColumnSettingPanel`、`SavedViewTabs`
- 流程与任务：`ApprovalFlowPanel`、`ImportWizard`、`ImportResultTable`、`ExportTaskPanel`
- 辅助能力：`AuditTimeline`、`NoticeCenter`、`StatCard`、`notification`、`drawer`

### 页面类型与推荐组件组合

#### 前台项目

| 页面类型 | 推荐组件组合 |
| --- | --- |
| 官网首页 / 品牌展示页 | `button`、`link`、`image`、`card`、`carousel`、`tabs`、`row`、`col` |
| 活动专题页 / 营销落地页 | `button`、`image`、`tag`、`badge`、`countdown`、`dialog`、`notification` |
| 内容详情页 / 帮助中心页 | `text`、`breadcrumb`、`anchor`、`image`、`divider`、`backtop` |
| 用户中心 / 个人资料页 | `avatar`、`form`、`input`、`select`、`upload`、`button`、`result` |
| 登录 / 注册页 | `form`、`input`、`checkbox`、`button`、`alert` |
| 商品详情页 / 购买页 | `image`、`carousel`、`tag`、`input-number`、`button`、`tabs`、`descriptions` |
| 创作发布页 / 富文本编辑页 | `editor`、`form`、`input`、`select`、`upload`、`button` |
| 媒体播放页 / 课程页 | `video-player`、`audio-player`、`image`、`tabs`、`card` |
| 轻量数据展示页 / 用户侧订单页 | `table`、`pagination`、`tag`、`tooltip`、`empty`、`skeleton` |
| FAQ / 设置页 / 协议页 | `collapse`、`anchor`、`divider`、`text`、`switch`、`checkbox`、`button` |

#### 后台项目

| 页面类型 | 推荐组件组合 |
| --- | --- |
| 标准列表页 / 管理台列表页 | `PageContainer`、`PageHeader`、`SearchForm`、`ProTable`、`PageToolbar` |
| 增删改查页面 | `CrudPage`、`SearchForm`、`ProTable`、`OverlayForm`、`DetailPanel` |
| 详情页 / 侧栏详情页 | `DetailPage`、`DetailPanel`、`descriptions`、`tabs`、`AuditTimeline` |
| 后台筛选列表闭环页 | `SearchForm`、`FilterPanel`、`ProTable`、`TableFilterDrawer`、`SavedViewTabs` |
| 配置页 / 表单编排页 | `ProForm`、`RequestForm`、`StepsForm`、`form`、`input`、`select` |
| 弹层编辑页 / 覆盖层编辑页 | `OverlayForm`、`dialog`、`drawer`、`form`、`upload` |
| 审批流 / 审核流页面 | `ApprovalFlowPanel`、`StepsForm`、`AuditTimeline`、`DetailPanel` |
| 导入导出任务页 | `ImportWizard`、`ImportResultTable`、`ExportTaskPanel`、`upload`、`notification` |
| 后台工作台 / 看板页 | `PageContainer`、`PageHeader`、`StatCard`、`statistic`、`progress`、`NoticeCenter`、`charts` |
| 分栏工作区 / 主从联动页 | `SplitLayoutPage`、`ProTable`、`DetailPanel`、`tabs`、`splitter`、`scrollbar` |

### 不建议前台默认直接使用的后台增强组件

- 表单编排类：`SearchForm`、`ProForm`、`OverlayForm`、`StepsForm`、`FilterPanel`、`RequestForm`
- 页面骨架类：`PageToolbar`、`PageHeader`、`PageContainer`、`HeaderTabs`
- 数据与视图类：`ProTable`、`ColumnSettingPanel`、`SavedViewTabs`、`TableFilterDrawer`、`ImportResultTable`
- 详情与闭环类：`AuditTimeline`、`DetailPanel`、`DetailPage`、`ListPage`、`CrudPage`、`SplitLayoutPage`
- 流程任务类：`ApprovalFlowPanel`、`ImportWizard`、`ExportTaskPanel`
- 边界型组件：`LoginForm`、`StatCard`、`NoticeCenter` 可按场景使用，但当前仓库语境仍以后台为主

## 本地开发

```bash
pnpm install
pnpm dev:docs
```

常用命令：

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## 仓库结构

- `apps/docs`：VitePress 文档站
- `apps/playground`：本地联调 playground
- `packages/components`：基础组件源码（npm 包名 `xiaoye-components`）
- `packages/pro-components`：中后台增强组件源码（npm 包名 `xiaoye-pro-components`）
- `packages/xiaoye-primitives`：基础设施包（composables / utils / 设计令牌事实源）
- `packages/theme`：组件样式入口与 CSS 实现
- `packages/tokens`：设计令牌 TS 常量层（由 tokens.css 生成）
- `packages/mcp-server`：面向 AI 工具的 MCP Server
- `tests/types`：类型测试夹具

## 路线

- 近期：按需加载方案（unplugin 自动导入）、MCP Server 面向 AI 工具的推广、更多中后台场景组件
- 长期：持续对齐中后台高频场景的最小可用闭环，保持低心智负担的 API 与完整类型体验
