---
title: 设计令牌
description: xiaoye-components 的完整设计系统变量参考，包含颜色、间距、字体、圆角和阴影。
outline: deep
---

# 设计令牌

设计令牌（Design Tokens）是 xiaoye-components 视觉体系的基础构建块。所有组件的样式都基于这些 CSS 变量，通过覆盖它们即可实现全局主题定制。

## 颜色系统

### 主色调

| 变量名 | 默认值 | 用途 |
|--------|--------|------|
| `--xy-color-primary` | `#3b82f6` | 主色调，用于按钮、链接、选中态等主要交互元素 |
| `--xy-color-primary-light-3` | 浅主色 | hover 状态 |
| `--xy-color-primary-light-5` | 更浅主色 | 背景填充 |
| `--xy-color-primary-dark-2` | 深主色 | active 状态 |

### 功能色

| 变量名 | 默认值 | 用途 |
|--------|--------|------|
| `--xy-color-success` | `#22c55e` | 成功状态 |
| `--xy-color-warning` | `#f59e0b` | 警告状态 |
| `--xy-color-danger` | `#ef4444` | 错误/危险状态 |
| `--xy-color-info` | `#6b7280` | 信息提示 |

### 中性色

| 变量名 | 用途 |
|--------|------|
| `--xy-text-color-*` | 文本颜色（primary/secondary/tertiary/disabled） |
| `--xy-border-color-*` | 边框颜色（strong/base/subtle/faint） |
| `--xy-bg-color-*` | 背景色（page/elevated/overlay/muted） |

### 语义色

| 变量名 | 默认值 | 用途 |
|--------|--------|------|
| `--xy-color-link` | 继承主色 | 链接文字 |
| `--xy-color-link-hover` | 主色深色 | 链接悬停 |

## 间距系统

基于 **4px** 基础网格：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--xy-spacing-xs` | `4px` | 特小间距 |
| `--xy-spacing-sm` | `8px` | 小间距 |
| `--xy-spacing-md` | `16px` | 中间距（基础单位） |
| `--xy-spacing-lg` | `24px` | 大间距 |
| `--xy-spacing-xl` | `32px` | 特大间距 |

## 字体系统

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--xy-font-family-base` | 系统默认 | 基础字体族 |
| `--xy-font-size-xs` | `12px` | 特小字号 |
| `--xy-font-size-sm` | `13px` | 小字号 |
| `--xy-font-size-md` | `14px` | 中号（默认正文） |
| `--xy-font-size-lg` | `16px` | 大号 |
| `--xy-font-size-xl` | `18px` | 特大号 |
| `--xy-line-height-relaxed` | `1.6` | 宽松行高 |
| `--xy-font-weight-medium` | `500` | 中等字重 |
| `--xy-font-weight-semibold` | `600` | 半粗字重 |

## 圆角系统

| 变量名 | 默认值 | 用途 |
|--------|--------|------|
| `--xy-radius-xs` | `2px` | 小圆角（标签、徽章） |
| `--xy-radius-sm` | `4px` | 小圆角（输入框、按钮） |
| `--xy-radius-md` | `8px` | 中圆角（卡片） |
| `--xy-radius-lg` | `12px` | 大圆角（弹窗） |
| `--xy-radius-xl` | `16px` | 特大圆角（面板） |

## 阴影系统

| 变量名 | 说明 |
|--------|------|
| `--xy-shadow-sm` | 小阴影（悬浮元素） |
| `--xy-shadow-md` | 中阴影（下拉菜单、浮层） |
| `--xy-shadow-lg` | 大阴影（弹窗、抽屉） |

## 浮层收口建议

当业务页面需要统一后台主题时，优先通过组件实例上的 token 收口，而不是继续 deep 到内部类名。

### 推荐优先级

1. `dialog / drawer / tooltip / popconfirm / popover / select / dropdown / date-picker / time-select / time-picker / cascader / tree-select / auto-complete`
2. `message / notification`
3. `table` 的 `overview` 与 wrapper token

### 典型迁移方式

| 旧覆盖写法 | 优先替代方式 | 适用场景 |
| --- | --- | --- |
| `.xy-dialog__header { padding: ... }` | `panel-class` / `body-class` / `footer-class` + `--xy-dialog-*` 变量 | 弹窗整体视觉收口 |
| `.xy-drawer__body { padding: ... }` | `body-class` / `header-class` / `footer-class` + `--xy-drawer-*` 变量 | 抽屉整体视觉收口 |
| `.xy-popover__panel / .xy-tooltip__content / .xy-popconfirm__panel` | `popper-class` + 对应 `--xy-*` 变量 | 通用浮层统一面板基线 |
| `.xy-select__dropdown / .xy-dropdown__panel` | `popper-class` + 对应 `--xy-*` 变量 | 下拉类面板统一背景/边框/阴影 |
| `.xy-message` / `.xy-notification` | 组件级 `type`、`plain`、`custom-class`（service 对应 `customClass`） | 通知层强度微调 |
| `.xy-loading` | directive 层 `xy-loading-custom-class / xy-loading-background / xy-loading-text`；service / options 层 `customClass` | 遮罩视觉收口 |
| `.xy-table__cell { padding: ... }` | `--xy-table-body-cell-padding-y/x` | 普通列表页正文节奏 |
| `.xy-table__header-cell { padding: ... }` | `--xy-table-header-cell-padding-y/x` | 普通列表页表头节奏 |
| `.xy-table__header-cell { background: ... }` | `--xy-table-header-background` | 表头主题接轨 |
| `.xy-table__row:hover > .xy-table__cell { background: ... }` | `--xy-table-row-hover-background` | hover 态主题化 |
| `.xy-table__expanded-cell / __append-wrapper / __empty-block` | `overview` 或 overview token | dashboard / 摘要表格 |

### Dashboard 概览

`overview` 适合 dashboard 首屏、经营看板和摘要卡片区。它不会改变 `size="md"` 的默认合同，但会统一收紧：

- 表头与正文节奏
- 空态与 loading 的留白
- append 与展开区的 padding

示例请查看 [Table 表格](./components/table) 页面中的“Dashboard 概览模式”和“列表页表格壳层”。

### 后台迁移 checklist

当你在后台项目里收口样式时，通常按下面顺序删页面级补丁：

1. 先删 `dialog / drawer / tooltip / popconfirm / popover / select / dropdown / date-picker / time-select / time-picker / cascader / tree-select / auto-complete` 上对内部面板类名的 `background / border / shadow / padding` 覆盖，改成组件实例上的 `popper-class`、`panel-class`、`body-class`、`header-class`、`footer-class` 或对应 `--xy-*` 变量。
2. 再看 `message / notification / loading`，只保留真正的业务强度差异，不要再把它们当作普通卡片或遮罩去写页面样式。
3. 最后处理 `table`，普通列表页优先用 wrapper token；dashboard / 摘要表格优先用 `overview`，不要继续 deep 到 `.xy-table__cell`、`.xy-table__header-cell`、`.xy-table__append-wrapper`。

如果你需要快速判断一段页面级样式是否应该删除，优先问自己两件事：

- 它是在修“组件默认视觉”，还是在修“业务布局”？
- 它能不能被组件实例级 token 或 `overview` 直接替代？

前者优先回收到组件库，后者才留在页面层。

### 先排除 contract 误用，再谈 token 是否生效

有些后台页面看起来像“浮层没弹出来”或“卡片 header 样式没挂上”，但根因并不是 token，而是组件公开 contract 用错了。

- `XyPopconfirm`
  - 旧页面如果没有 `reference`，且也没有传 `content`，当前版本会把 `default` 插槽兼容成 trigger。
  - 但只要页面既想把 `default` 当 trigger、又想把正文也塞进默认插槽，就仍然应显式改回 `#reference + content/default body`。
- `XyCard`
  - 当前公开 header contract 是 `header` 和 `#extra`，不是 `title` 和 `#header-extra`。
  - 如果 header 根本没渲染出来，先修正公开入口，再判断 `header-class / body-class` 或对应 token 是否需要微调。

这条判断顺序很重要：先确认结构真实存在，再看 token；不要把“节点没渲染”误判成“主题变量没生效”。

## 过渡动画

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--xy-transition-duration-fast` | `150ms` | 快速过渡 |
| `--xy-transition-duration-normal` | `250ms` | 标准过渡 |
| `--xy-transition-duration-slow` | `350ms` | 慢速过渡 |
| `--xy-transition-ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | 标准缓动函数 |

## 使用示例

### 自定义品牌色

```css
:root {
  --xy-color-primary: #6366f1;
  --xy-color-primary-light-3: #818cf8;
  --xy-color-primary-light-5: #c7d2fe;
  --xy-color-primary-dark-2: #4f46e5;
}
```

### 调整间距节奏

```css
:root {
  --xy-spacing-sm: 12px;
  --xy-spacing-md: 20px;
  --xy-spacing-lg: 28px;
}
```

完整的 CSS 变量定义请查看源码：[tokens.css](https://github.com/xiaoye/xiaoye-components/blob/main/packages/xiaoye-primitives/src/theme/tokens.css)

> 更多主题定制实践请参考 [主题定制指南](./guide/theming)。
