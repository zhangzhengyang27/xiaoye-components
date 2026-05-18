---
title: 更新日志
description: xiaoye-components 版本历史和变更记录，追踪每个版本的新功能、修复和破坏性变更。
outline: deep
keywords:
  - changelog
  - release notes
  - version history
---

# 更新日志

本页面记录 xiaoye-components 的所有重要变更。

每条记录遵循 [Keep a Changelog](https://keepachangelog.com/) 规范，分类如下：

- **✨ 新功能** (New)：新增的组件、API 或功能
- **🐛 修复** (Fixed)：Bug 修复
- **💎 优化** (Changed)：功能改进或重构
- **⚠️ 破坏性变更** (Breaking)：可能导致不兼容的变更
- **🗑️ 移除** (Removed)：已移除的功能或 API

::: tip 版本号规范
项目遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范：
- **主版本号 (MAJOR)**：不兼容的 API 变更
- **次版本号 (MINOR)**：向下兼容的功能新增
- **修订号 (PATCH)**：向下兼容的问题修复
:::

---

## 即将发布

> 当前开发中的功能和改进。

### ✨ 新功能
- （待补充）

### 🐛 修复
- （待补充）

### 💎 优化
- （待补充）

---

## 历史版本

> 项目当前处于活跃开发阶段，尚未发布首个正式版本。
> 完整的变更记录将在首次发布后在此处展示。

### v0.1.0 (2024-xx-xx) - 初始版本

#### ✨ 新功能

**基础组件层 (72+ 组件)**

**基础与展示**
- `Button` 按钮：支持多种类型（primary/success/warning/danger）、尺寸变体、加载态、图标按钮、按钮组
- `Link` 文字链接：支持下划线样式、禁用状态、图标
- `Text` 文本：内联文本样式控制，支持截断、省略、强调
- `Badge` 徽标：数值提示、小红点、自定义内容
- `Avatar` 头像：图片/文字/图标头像、头像组、可点击
- `Image` 图片：懒加载、预览、错误占位、多图展示
- `Watermark` 水印：文字/图片水印、防篡改
- `Card` 卡片：基础卡片、阴影变体
- `Carousel` 走马灯：自动播放、指示器、切换动画
- `Affix` 固钉：滚动固定定位
- `Anchor` 锚点：页面内导航、高亮跟踪
- `Menu` 菜单：水平/垂直菜单、子菜单、折叠模式
- `Row / Col` 栅格：响应式布局系统
- `Scrollbar` 滚动条：自定义滚动条样式
- `Splitter` 分隔面板：可拖拽分割
- `Divider` 分割线：带文字分割线
- `Icon` 图标：基于 Iconify 的图标系统
- `Tag` 标签：可关闭、多彩色、尺寸变体
- `Space` 间距：统一间距布局
- `Tabs` 标签页：卡片式、位置变体、标签页

**表单与录入**
- `Input` 输入框：单行/多行、前后缀、密码显隐、字数统计、格式化
- `Radio` 单选框：按钮组、禁用状态
- `Checkbox` 复选框：多选组、半选状态、按钮组
- `Switch` 开关：加载态、文字描述、自定义颜色
- `InputTag` 标签输入框：动态标签管理
- `InputNumber` 数字输入框：步进控制、精度限制
- `Rate` 评分：星级评分、自定义图标
- `Slider` 滑块：范围选择、刻度标记
- `Select` 选择器：单选/多选、远程搜索、分组选项、可创建项
- `Form` 表单：校验规则、动态表单、表单联动
- `Upload` 上传：拖拽上传、图片预览、批量上传、进度显示

**时间相关**
- `DatePicker` 日期选择器：范围选择、禁用日期、格式化
- `TimePicker` 时间选择器：时分秒选择、范围
- `TimeSelect` 时间选择：固定时间选项列表
- `Scheduler` 排期日历：FullCalendar 集成、事件管理

**反馈与浮层**
- `Alert` 提示：四种类型、可关闭、图标
- `Message` 消息提示：全局调用、多种类型、手动关闭
- `Notification` 通知：全局调用、自定义位置、手动关闭
- `Collapse` 折叠面板：手风琴模式、嵌套
- `CollapseTransition` 折叠过渡：动画过渡效果
- `Empty` 空状态：自定义空态图
- `Loading` 加载：指令/服务/组件三种用法
- `Skeleton` 骨架屏：多种骨架屏变体
- `Result` 结果页：成功/失败/警告/信息
- `Backtop` 回到顶部：滚动显示、自定义位置
- `Tooltip` 文字提示：富内容、虚拟触发、延迟
- `Popover` 气泡卡片：嵌套操作、确认气泡
- `Popconfirm` 气泡确认框：确认操作前的二次确认
- `Dropdown` 下拉菜单：命令式/触发式、分组
- `Dialog` 对话框：模态/非模态、拖拽、可调整大小
- `Drawer` 抽屉：方向、层级、可调整大小

**数据展示**
- `Progress` 进度条：线性/环形、百分比
- `Steps` 步骤条：垂直/水平、简洁/详细
- `Statistic` 统计数值：数字格式化、前缀后缀
- `Countdown` 倒计时：天/时/分/秒
- `Timeline` 时间线：左侧/双侧、审计模式
- `Tree` 树形控件：勾选、懒加载、拖拽、虚线
- `Table` 表格：列定义、排序筛选、固定列、展开行、树形数据、汇总行、实例方法
- `Pagination` 分页：完整分页、简洁模式

**其他**
- `ConfigProvider` 全局配置：命名空间、国际化、尺寸、z-index
- `Breadcrumb` 面包屑
- `AutoComplete` 自动补全
- `Cascader` 级联选择器
- `Charts` 图表（ECharts 封装）
- `CheckCard` 卡片选择
- `Descriptions` 描述列表
- `Editor` 富文本编辑器（Vditor）
- `AudioPlayer` 音频播放器
- `VideoPlayer` 视频播放器（Video.js）
- `Transfer` 穿梭框
- `TreeSelect` 树形选择器

**增强组件层 (30+ 组件)**

**核心表单与筛选**
- `SearchForm` 搜索表单：统一筛选栏布局、查询动作、字段折叠
- `ProForm` 增强表单：统一表单网格、标题区、动作区
- `OverlayForm` 覆盖层表单：通用覆盖层编辑内核
- `DialogForm` 弹窗表单：对话框容器 + 表单编排
- `DrawerForm` 抽屉表单：抽屉容器 + 表单编排
- `FilterPanel` 筛选面板：高级筛选容器
- `RequestForm` 请求表单：加载态、提交态、骨架屏
- `LoginForm` 登录表单：认证场景主链路
- `StepsForm` 分步表单：多阶段录入流程

**核心列表与数据**
- `ProTable` 增强表格：工具栏 + 搜索区 + 表格 + 分页联动
- `ColumnSettingPanel` 列设置面板：列显隐配置
- `SavedViewTabs` 视图页签：视图切换与保存
- `TableFilterDrawer` 表格筛选抽屉：高级筛选
- `ImportResultTable` 导入结果表格：导入反馈摘要
- `ListPage` 列表页容器：列表页骨架
- `CrudPage` 增删改查页：列表 + 编辑 + 查看闭环

**核心详情与历史**
- `AuditTimeline` 审计时间线：历史记录与审批
- `DetailPanel` 详情面板：覆盖层详情查看
- `DetailPage` 详情页容器：完整详情页骨架

**流程与任务**
- `ApprovalFlowPanel` 审批流面板：审批进度展示
- `ImportWizard` 导入向导：导入流程步骤
- `ExportTaskPanel` 导出任务面板：导出状态展示

**页面布局**
- `PageHeader` 页面头部：标题、描述、元信息、动作区
- `PageContainer` 页面容器：头部 + 主体 + footer + loading
- `StatCard` 指标卡片：数字指标展示
- `AsyncStateContainer` 异步状态容器：加载/空态/错误/恢复
- `SplitLayoutPage` 分栏布局页：主从/侧栏布局

#### 💎 优化

- 组件库采用 **Monorepo** 架构，分层清晰：
  - `@xiaoye/primitives`：底层原语与工具函数
  - `@xiaoye/components`：基础组件层
  - `@xiaoye/pro-components`：增强业务组件层
- 全面使用 **TypeScript**，提供完整的类型定义
- 支持 **VitePress** 文档站，示例驱动文档
- 内置 **Vitest** 单元测试 + **Playwright** E2E 测试
- 使用 **Changesets** 管理版本和变更日志

#### ⚠️ 破坏性变更

无（初始版本）

---

## 如何贡献变更记录

当你在项目中添加了新功能或修复了 Bug 时，请按以下步骤更新 Changelog：

### 1. 创建 Changeset

```bash
# 安装 changeset CLI（如果还未安装）
pnpm add -D @changesets/cli

# 创建新的变更记录
pnpm changeset
```

按照提示选择：
- 变更影响范围（哪个包）
- 变更类型（major/minor/patch）
- 变更描述（中文）

这会在 `.changeset/` 目录生成一个 Markdown 文件。

### 2. 发布版本

```bash
# 更新版本号并生成 CHANGELOG
pnpm version-packages

# 发布到 npm
pnpm release
```

Changesets 会自动：
- 根据 changeset 文件计算新版本号
- 更新所有包的 package.json
- 生成或更新 CHANGELOG.md
- 创建 Git Tag
- 发布到 npm registry

### 3. 同步文档站

发布完成后，将生成的 CHANGELOG 内容同步到本页面：

```bash
# 从根目录的 CHANGELOG 提取内容
# 复制到 apps/docs/changelog.md
```

---

## 版本时间线

```
v0.1.0 ───────────────────────────────► 当前（开发中）
 │
 ├── 基础组件层：72+ 组件
 ├── 增强组件层：30+ 组件
 ├── TypeScript 全面支持
 └── VitePress 文档站
```

---

## 相关链接

- [GitHub Releases](https://github.com/xiaoye/xiaoye-components/releases)
- [npm 包页面](https://www.npmjs.com/package/xiaoye-components)
- [Issues 和 Feature Requests](https://github.com/xiaoye/xiaoye-components/issues)
- [贡献指南](https://github.com/xiaoye/xiaoye-components/blob/main/CONTRIBUTING.md)
