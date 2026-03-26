---
title: Divider 分割线
description: 用于切分内容区块、弱化分组边界和串联横向操作。
outline: deep
---

# Divider 分割线

`xy-divider` 参考了 Element Plus 的 `Divider`，保留 `direction / content-position / border-style` 这组三件套，同时补了当前组件库更常用的 `size` 和 `status`。它适合做轻量分段，而不是代替卡片、折叠面板这类更重的容器结构。

## 基础用法

:::demo 最常见的场景是把两段正文、两组说明或者卡片内的不同小节切开，让页面阅读节奏更清楚。
divider/basic
:::

## 内容位置

:::demo 带默认插槽时可以把说明放在左、中、右，适合用来表达阶段名、字段组标题或当前语义标签。
divider/positions
:::

## 线型样式

:::demo `border-style` 直接透传 CSS 的边框线型，除了 `solid`，常用的 `dashed / dotted / double` 也都能直接用。
divider/styles
:::

## 状态语义

:::demo 如果当前分割线需要参与页面语义表达，可以通过 `status` 让线条和文字一起带上强调色。
divider/status
:::

## 尺寸体系

:::demo `xy-divider` 会跟随全局 `size`，也可以局部覆盖为 `sm / md / lg`。尺寸主要影响间距、文字字号和竖向分割的留白。
divider/size
:::

## 竖向分割

:::demo `direction='vertical'` 适合切分操作栏、面包屑附加信息和行内状态。竖向模式下不会渲染默认插槽内容。
divider/vertical
:::

## 真实场景

:::demo 这里的重点不是“加一根线”，而是用 Divider 把发布摘要拆成几个更容易扫读的段落。横向分割更适合章节式分段，竖向分割更适合切开元信息和轻操作；如果你已经需要明显容器边界，优先考虑 Card、Collapse 或 Drawer，而不是继续堆更多 Divider。
divider/scene
:::

## 何时使用

- 需要把一块连续内容拆成几个更容易扫读的小节时。
- 需要在一排轻操作、状态信息之间建立视觉边界，但又不希望容器感太重时。
- 需要在表单说明、卡片摘要或抽屉内容里做“轻量分组”，而不是再套一层卡片或折叠面板时。

## 行为约定

- 默认插槽只在 `direction='horizontal'` 时展示，竖向分割线只承担“切开内容”的作用。
- 横向 Divider 更适合章节标题、说明区块和动作区收尾；竖向 Divider 更适合一行内的元信息、状态和轻操作切割。
- `size` 会影响留白节奏和文字大小，不会改变 API 语义。
- `status` 更适合表达当前区块的语义重点；如果只是普通分组，推荐保留默认 `neutral`。
- Divider 适合轻量分组，不替代 Card、Collapse、Drawer 这类本身就承担结构层级的重容器。

## Divider API

### Divider Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `direction` | 分割线方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `content-position` | 默认插槽内容的位置 | `'left' \| 'center' \| 'right'` | `'center'` |
| `border-style` | 分割线样式，兼容 CSS `border-style` | `CSSStyleDeclaration['borderStyle']` | `'solid'` |
| `size` | 组件尺寸，未传时跟随全局配置 | `'sm' \| 'md' \| 'lg'` | `全局 size / 'md'` |
| `status` | 分割线语义色 | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` |

### Divider Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 分割线上的自定义内容，仅在横向模式下渲染 |

### Divider CSS Variables

| 变量名 | 说明 | 默认值 |
| --- | --- | --- |
| `--xy-divider-border-style` | 分割线样式 | `solid` |
| `--xy-divider-thickness` | 线条粗细 | `1px` |
| `--xy-divider-spacing` | 横向分割的上下留白 | `24px` |
| `--xy-divider-color` | 分割线颜色 | `color-mix(in srgb, var(--xy-border-color-strong) 72%, white)` |
| `--xy-divider-text-color` | 插槽文字颜色 | `var(--xy-text-color-secondary)` |
| `--xy-divider-font-size` | 插槽文字字号 | `var(--xy-font-size-md)` |
| `--xy-divider-text-padding` | 插槽文字两侧留白 | `18px` |
| `--xy-divider-content-offset` | 左右定位时的边距 | `24px` |
| `--xy-divider-vertical-gap` | 竖向分割与两侧内容的间距 | `12px` |
| `--xy-divider-vertical-height` | 竖向分割线高度 | `1em` |
