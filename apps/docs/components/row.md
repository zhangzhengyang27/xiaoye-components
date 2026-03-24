---
title: Row / Col 栅格
description: 24 栅格布局容器与列组件。
outline: deep
---

# Row / Col 栅格

`xy-row` 和 `xy-col` 用于搭 24 栅格布局，适合筛选栏、统计卡片区、表单分栏和控制台首页这类需要稳定横向编排的中后台页面。 如果你想单独查列宽、偏移和断点规则，可以直接看 [Col 栅格列](/components/col) 页面。

## 基础栅格

默认一行分成 24 份，`span` 表示当前列占几份。

:::demo 先用 `span` 切出稳定的列宽，再决定卡片内容和视觉节奏。
row/basic
:::

## 列间距

`gutter` 由 `xy-row` 统一控制，内部 `xy-col` 会自动拿到等分内边距，不需要每列自己补左右 padding。

:::demo `gutter` 适合统一控制卡片、表单分栏和统计模块之间的呼吸感。
row/gutter
:::

## 对齐方式

`justify` 控制主轴分布，`align` 控制交叉轴对齐。它们只作用在 `xy-row` 上。

:::demo 对齐能力适合做顶部摘要区、工具栏尾部聚合和高低卡片混排。
row/alignment
:::

## 响应式列宽

`xy-col` 支持 `xs / sm / md / lg / xl` 五个断点。你可以直接传数字，也可以传对象形式配置 `span / offset / pull / push`。

:::demo 数字写法适合只改列宽，对象写法适合在不同断点顺便处理偏移和位移。
row/responsive
:::

## 何时使用

- 需要把一整行内容拆成固定比例区域，例如筛选栏、统计面板、设置页双栏。
- 需要在多个断点下保持相对稳定的版心节奏，而不是依赖纯粹的内容自适应。
- 需要统一控制列间距，让卡片与卡片之间的留白跟随页面布局整体变化。

## 断点说明

| 断点 | 范围        |
| ---- | ----------- |
| `xs` | `< 768px`   |
| `sm` | `>= 768px`  |
| `md` | `>= 992px`  |
| `lg` | `>= 1200px` |
| `xl` | `>= 1920px` |

## Row API

### Row Attributes

| 属性      | 说明                | 类型                                                                                  | 默认值    |
| --------- | ------------------- | ------------------------------------------------------------------------------------- | --------- |
| `tag`     | 渲染的根标签        | `string`                                                                              | `'div'`   |
| `gutter`  | 栅格间距，单位为 px | `number`                                                                              | `0`       |
| `justify` | 主轴对齐方式        | `'start' \| 'center' \| 'end' \| 'space-around' \| 'space-between' \| 'space-evenly'` | `'start'` |
| `align`   | 交叉轴对齐方式      | `'top' \| 'middle' \| 'bottom'`                                                       | —         |

### Row Slots

| 插槽      | 说明                             |
| --------- | -------------------------------- |
| `default` | 行内容，一般由多个 `xy-col` 组成 |

## Col API

### Col Attributes

| 属性     | 说明                       | 类型                                                                         | 默认值  |
| -------- | -------------------------- | ---------------------------------------------------------------------------- | ------- |
| `tag`    | 渲染的根标签               | `string`                                                                     | `'div'` |
| `span`   | 当前列占据的栅格数         | `number`                                                                     | `24`    |
| `offset` | 左侧偏移的栅格数           | `number`                                                                     | `0`     |
| `pull`   | 向左位移的栅格数           | `number`                                                                     | `0`     |
| `push`   | 向右位移的栅格数           | `number`                                                                     | `0`     |
| `xs`     | `< 768px` 的响应式列配置   | `number \| { span?: number; offset?: number; pull?: number; push?: number }` | —       |
| `sm`     | `>= 768px` 的响应式列配置  | `number \| { span?: number; offset?: number; pull?: number; push?: number }` | —       |
| `md`     | `>= 992px` 的响应式列配置  | `number \| { span?: number; offset?: number; pull?: number; push?: number }` | —       |
| `lg`     | `>= 1200px` 的响应式列配置 | `number \| { span?: number; offset?: number; pull?: number; push?: number }` | —       |
| `xl`     | `>= 1920px` 的响应式列配置 | `number \| { span?: number; offset?: number; pull?: number; push?: number }` | —       |

### Col Slots

| 插槽      | 说明                                   |
| --------- | -------------------------------------- |
| `default` | 列内容，通常承载卡片、表单块或工具区域 |

## 行为约定

- `gutter` 由 `xy-row` 统一下发，`xy-col` 会自动计算左右内边距。
- `xy-col` 可以单独使用；如果外层没有 `xy-row`，它会退回到无间距模式。
- 响应式能力基于断点样式切换，而不是运行时监听窗口宽度。
- 当 `span` 或某个断点下的 `span` 为 `0` 时，该列会在对应范围内隐藏。
