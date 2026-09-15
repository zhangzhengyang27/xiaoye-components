---
title: 设计令牌
description: xiaoye-components 的完整设计令牌参考：Stripe 设计语言驱动的三层令牌架构（基元层、语义层、刻度层），含亮暗双主题全套变量。
outline: deep
---

# 设计令牌

设计令牌（Design Tokens）是 xiaoye-components 视觉体系的基础构建块。整套令牌以 **Stripe 设计语言**为蓝本（参考 design.hagicode.com 收录的 Stripe DESIGN.md 及其官方亮/暗双 token 目录），采用**三层架构**，所有组件样式都基于这些 CSS 变量，覆盖它们即可实现全局主题定制。

## 三层架构

```
基元层  --xy-{色板}-{阶}     灰/紫/绿/琥珀/红/蓝 六族色板，双主题共享
语义层  --xy-{角色}[-{状态}]  文字、背景、边框、品牌、状态、海拔、层级
刻度层  --xy-{刻度}-{档}     字号、字重、行高、间距、圆角、动效
```

- **基元层**是原料：只描述"颜色本身"，不携带用途，主题切换时不覆写。
- **语义层**是合同：组件只消费语义层，描述"这个位置用什么"。暗色主题只覆写语义层。
- **刻度层**与主题无关：字号、间距、圆角在亮暗主题间共享。

单一事实源是 [`tokens.css`](https://github.com/xiaoye/xiaoye-components/blob/main/packages/xiaoye-primitives/src/theme/tokens.css)，`packages/tokens` 的 TS 常量层由 `node scripts/generate-tokens.mjs` 从它生成。

## 颜色系统

### 品牌色

锚点取自 Stripe 官方值：主色 `#533afd`（stripe purple）、hover `#4434d4`、激活 `#2e2b8c`。

| 变量名 | 亮色值 | 用途 |
|--------|--------|------|
| `--xy-brand` | `#533afd` | 主色：按钮、链接、选中态 |
| `--xy-brand-hover` | `#4434d4` | 主色悬停 |
| `--xy-brand-active` | `#2e2b8c` | 主色按下 |
| `--xy-brand-soft` | `rgba(83,58,253,0.07)` | 主色浅底 |
| `--xy-brand-soft-hover` | `rgba(83,58,253,0.12)` | 主色浅底悬停 |
| `--xy-brand-border` | `#b9b9f9` | 主色描边（ghost 按钮、选中边框） |
| `--xy-brand-contrast` | `#ffffff` | 主色上的反衬色 |

暗色主题下品牌色整体提亮为 `#665efd` / `#7a73ff` / `#533afd`（官方暗色目录值），soft 变体改用品牌色 alpha。

### 状态色

每个状态色都是 `{base, hover, active, soft, soft-hover, text}` 六件套，命名完全一致：

| 变量名前缀 | base（亮色） | text（亮色） | 语义 |
|--------|--------|--------|------|
| `--xy-success-` | `#15be53` | `#108c3d` | 成功 |
| `--xy-warning-` | `#b8862f` | `#7a5320` | 警告（Stripe lemon） |
| `--xy-danger-` | `#ea2261` | `#c81a50` | 危险（Stripe ruby） |
| `--xy-info-` | `#2b91df` | `#2874ad` | 信息 |

`-soft` / `-soft-hover` 使用状态色 alpha（0.12 / 0.2，官方 sanctioned 区间），在任何表面上都能正确混色；`-text` 用于浅底上的状态文字。

### 基元色板

六族色板，命名 `--xy-{族}-{阶}`，阶号越大颜色越深：

| 族 | 阶范围 | 锚点（官方值） |
|--------|--------|------|
| `--xy-gray-` | 25–950 | 中性灰带海军蓝底色：200 `#e5edf5`（边框）、500 `#64748d`（正文）、700 `#273951`（标签）、950 `#061b31`（标题） |
| `--xy-purple-` | 50–950 | 品牌紫：600 `#533afd`、700 `#4434d4`、950 `#1c1e54`（brand dark） |
| `--xy-green-` | 50–800 | 成功绿：500 `#15be53`、600 `#108c3d` |
| `--xy-amber-` | 50–800 | 柠檬琥珀：400 `#d4a04a`、600 `#9b6829` |
| `--xy-red-` | 50–800 | 宝石红：500 `#ea2261` |
| `--xy-blue-` | 100–800 | 信息蓝：500 `#2b91df`、600 `#2874ad` |

### 文字色

| 变量名 | 亮色值 | 用途 |
|--------|--------|------|
| `--xy-text-heading` | `#061b31` | 标题（深海军蓝，不用纯黑） |
| `--xy-text-primary` | `#061b31` | 默认正文、控件值 |
| `--xy-text-secondary` | `#273951` | 表单标签、次级强调 |
| `--xy-text-muted` | `#64748d` | 描述、说明、占位 |
| `--xy-text-faint` | `#a3b1c2` | 最弱元数据 |
| `--xy-text-disabled` | `#d4dee9` | 禁用态 |
| `--xy-text-on-fill` | `#ffffff` | 实色块上的文字（双主题恒白） |

### 背景与边框

背景是严格的亮度阶梯：`page < subtle < muted < sunken < container`。

| 变量名 | 亮色值 | 用途 |
|--------|--------|------|
| `--xy-bg-page` | `#f3f7fb` | 页面画布 |
| `--xy-bg-subtle` | `#fbfdfe` | 最浅染色面板 |
| `--xy-bg-muted` | `#f6f9fc` | 次级面板 |
| `--xy-bg-sunken` | `#eef4f9` | 凹陷区：表头、代码块 |
| `--xy-bg-container` | `#ffffff` | 卡片、输入框、面板 |
| `--xy-bg-raised` | `#ffffff` | 抬升层（亮色靠阴影区分） |
| `--xy-bg-elevated` | `#ffffff` | 弹窗、抽屉 |
| `--xy-bg-floating` | `#ffffff` | 浮层面板 |
| `--xy-fill-light` | `#f6f9fc` | 控件浅填充 |
| `--xy-border` | `#e5edf5` | 默认边框 |
| `--xy-border-strong` | `#d4dee9` | 强边框 |
| `--xy-border-subtle` | `#eef4f9` | 弱分隔线 |

暗色主题下背景切换为靛黑阶梯（页面底 `#0e0f2e`，官方暗色值），边框切换为白色透明度阶梯（`rgba(255,255,255,0.06/0.1/0.18)`）。

### 焦点与遮罩

| 变量名 | 亮色值 | 用途 |
|--------|--------|------|
| `--xy-focus-ring-color` | `rgba(83,58,253,0.14)` | 焦点环颜色 |
| `--xy-focus-border` | `#533afd` | 聚焦边框 |
| `--xy-overlay-color` | `rgba(6,27,49,0.5)` | 模态遮罩 |

## 海拔系统（阴影）

采用 Stripe 五级海拔，`0` 最弱、`4` 最强。命名即层级，不再有 card/popup/modal 别名冗余：

| 变量名 | 亮色值 | 用途 |
|--------|--------|------|
| `--xy-shadow-0` | `0 1px 2px rgba(6,27,49,0.06)` | 发丝级：开关滑块、微型浮起 |
| `--xy-shadow-1` | `0 3px 6px rgba(23,23,23,0.06)` | 氛围：卡片静置、hover 提示 |
| `--xy-shadow-2` | `0 15px 35px rgba(23,23,23,0.08)` | 标准：内容面板、悬浮卡片 |
| `--xy-shadow-3` | 双层蓝调阴影 | 抬升：下拉、弹出层 |
| `--xy-shadow-4` | 双层深蓝阴影 | 最强：模态、浮窗 |

L3/L4 是 Stripe 标志性的**蓝调多层阴影**（`rgba(50,50,93,…)` + `rgba(0,0,0,…)`），深度带品牌氛围。暗色主题下五级全部转为黑色主导。

## 层级系统（z-index）

单调递增的层级阶梯（修复了旧体系 dropdown 高于 modal 的倒挂）。运行时浮层（dialog/drawer/message 等）由 `useOverlayStack` 从 2000 起分配，始终高于 CSS 层：

| 变量名 | 值 | 用途 |
|--------|-----|------|
| `--xy-z-normal` | `1` | 常规堆叠 |
| `--xy-z-raised` | `10` | 徽标、角标 |
| `--xy-z-sticky` | `100` | 吸顶、粘性表头、affix |
| `--xy-z-dropdown` | `1000` | 下拉面板 |
| `--xy-z-modal` | `1100` | 模态层 |
| `--xy-z-toast` | `1200` | 消息通知 |
| `--xy-z-tooltip` | `1300` | 文字提示 |
| `--xy-z-max` | `1400` | CSS 层顶 |

## 间距系统

基于 **8px 基准网格**（Stripe spacing 基准），7 级：

| 变量名 | 值 | 使用场景 |
|--------|-----|----------|
| `--xy-space-1` | 4px | 紧凑元素内边距 |
| `--xy-space-2` | 8px | 小组件间距 |
| `--xy-space-3` | 12px | 表单字段间距 |
| `--xy-space-4` | 16px | 卡片内边距（最常用） |
| `--xy-space-5` | 20px | 区块间距 |
| `--xy-space-6` | 24px | 大区块间距 |
| `--xy-space-7` | 32px | 页面级间距 |

## 字体系统

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--xy-font-family-base` | 系统栈（含 PingFang SC / Microsoft YaHei） | 基础字体族 |
| `--xy-font-family-code` | SF Mono / Source Code Pro 等宽栈 | 代码字体 |
| `--xy-font-size-2xs` | `11px` | 徽标角标 |
| `--xy-font-size-xs` | `12px` | 辅助信息 |
| `--xy-font-size-sm` | `13px` | 说明文字 |
| `--xy-font-size-md` | `14px` | 默认正文 |
| `--xy-font-size-lg` | `16px` | 大号正文 |
| `--xy-font-size-xl` | `20px` | 组件标题 |
| `--xy-font-size-2xl` | `26px` | 页面标题 |
| `--xy-font-size-3xl` | `32px` | 展示标题 |
| `--xy-font-size-4xl` | `48px` | 营销级大标题 |
| `--xy-font-weight-light` | `300` | 展示型文字（Stripe 双轨制） |
| `--xy-font-weight-regular` | `400` | 控件默认 |
| `--xy-font-weight-medium` | `500` | 强调 |
| `--xy-font-weight-semibold` | `600` | 标题 |
| `--xy-line-height-tight` | `1.2` | 标题行高 |
| `--xy-line-height` | `1.5` | 全局行高 |

## 圆角系统

Stripe 刻度：标准 4px 是绝对主力（按钮、输入框、徽标），克制不花哨，整族无坍缩：

| 变量名 | 值 | 使用场景 |
|--------|-----|----------|
| `--xy-radius-xs` | 2px | 微圆角（标签、分页项、面包屑） |
| `--xy-radius-sm` | 3px | 小型元素（菜单项、页签） |
| `--xy-radius-md` | 4px | 标准（按钮、输入框、徽标——Stripe 主力档） |
| `--xy-radius-lg` | 6px | 大交互区（卡片、导航、弹出面板） |
| `--xy-radius-xl` | 8px | 重点容器（对话框） |
| `--xy-radius-pill` | 999px | 胶囊（标签、头像，表单控件按需选用） |

## 动效

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--xy-transition-duration-fast` | `0.15s` | 快速过渡（hover、颜色） |
| `--xy-transition-duration-normal` | `0.25s` | 标准过渡 |
| `--xy-transition-duration-slow` | `0.4s` | 慢速过渡（大型浮层） |
| `--xy-transition-timing` | `cubic-bezier(0.4,0,0.2,1)` | 标准缓动 |
| `--xy-transition-timing-in` / `-out` | — | 进场 / 出场缓动 |

## 旧命名兼容层

v1 的旧变量名（`--xy-color-primary`、`--xy-text-color-*`、`--xy-bg-color-*`、`--xy-surface-*`、`--xy-shadow-xs/sm/md/lg` 等）在 `tokens.css` 末尾以 `@deprecated` 兼容层映射到新令牌，存量自定义主题不受影响。兼容层将在下个 major 移除，新代码请使用本页的规范命名。

完整变量定义见源码：[tokens.css](https://github.com/xiaoye/xiaoye-components/blob/main/packages/xiaoye-primitives/src/theme/tokens.css)

> 主题定制实践（全局覆盖、作用域覆盖、品牌色替换案例）请参考 [主题定制指南](./guide/theming)。
