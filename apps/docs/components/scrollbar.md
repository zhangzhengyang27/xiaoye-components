---
title: Scrollbar 滚动条
description: 自定义滚动容器、滚动条样式与滚动控制组件。
outline: deep
---

# Scrollbar 滚动条

`xy-scrollbar` 用于在固定区域里承载列表、说明块、卡片带和横向泳道。它保留原生滚动行为，同时提供更稳定的滚动条样式、方法控制和滚动事件。

## 基础用法

:::demo 适合固定高度的说明区、可滚动卡片列和侧边详情块。
scrollbar/basic
:::

## 最大高度与常显滚动条

:::demo `max-height` 适合内容高度不确定的区块，`always` 适合始终提示“这里可以滚动”的场景。
scrollbar/max-height
:::

## 横向滚动

:::demo `xy-scrollbar` 也支持横向内容，适合时间轴、卡片带和泳道布局。
scrollbar/horizontal
:::

## 方法与事件

:::demo 通过组件暴露的方法可以主动控制滚动位置，`scroll` 与 `endReached` 适合做滚动联动和触底加载。
scrollbar/methods
:::

## 宽表格容器

:::demo 后台表格经常会遇到列很多、宽度超过容器的情况。把 `xy-table` 放进 `xy-scrollbar` 里，可以让横向滚动区域更可控。
scrollbar/table-combo
:::

## 长筛选面板

:::demo 侧边筛选、规则面板和高级条件配置区也很适合配合 Scrollbar，把“长内容的滚动”局部化。
scrollbar/filter-panel
:::

## 何时使用

- 需要在固定高度区域中承载较长列表或说明文案。
- 需要统一滚动条视觉，避免原生滚动条在不同系统下差异过大。
- 需要通过方法控制滚动位置，或监听滚动与触底行为。

## Scrollbar API

### Scrollbar Attributes

| 属性               | 说明                                  | 类型                                        | 默认值  |
| ------------------ | ------------------------------------- | ------------------------------------------- | ------- |
| `distance`         | 触发 `endReached` 的距离阈值，单位 px | `number`                                    | `0`     |
| `height`           | 固定高度                              | `number \| string`                          | `''`    |
| `max-height`       | 最大高度                              | `number \| string`                          | `''`    |
| `native`           | 是否使用原生滚动条                    | `boolean`                                   | `false` |
| `wrap-style`       | 滚动容器样式                          | `StyleValue`                                | `''`    |
| `wrap-class`       | 滚动容器类名                          | `string \| string[]`                        | `''`    |
| `view-style`       | 视图容器样式                          | `StyleValue`                                | `''`    |
| `view-class`       | 视图容器类名                          | `string \| string[]`                        | `''`    |
| `noresize`         | 是否跳过尺寸监听                      | `boolean`                                   | `false` |
| `tag`              | 视图容器标签                          | `string`                                    | `'div'` |
| `always`           | 是否始终显示自定义滚动条              | `boolean`                                   | `false` |
| `min-size`         | 滚动条 thumb 最小尺寸                 | `number`                                    | `20`    |
| `tabindex`         | 滚动容器 tabindex                     | `number \| string`                          | —       |
| `id`               | 视图容器 id                           | `string`                                    | —       |
| `role`             | 视图容器 role                         | `string`                                    | —       |
| `aria-label`       | 视图容器 aria-label                   | `string`                                    | —       |
| `aria-orientation` | 视图容器 aria-orientation             | `'horizontal' \| 'vertical' \| 'undefined'` | —       |

### Scrollbar Events

| 事件         | 说明               | 参数                                        |
| ------------ | ------------------ | ------------------------------------------- |
| `scroll`     | 滚动时触发         | `{ scrollTop: number; scrollLeft: number }` |
| `endReached` | 滚动接近边界时触发 | `'top' \| 'bottom' \| 'left' \| 'right'`    |

### Scrollbar Slots

| 插槽      | 说明     |
| --------- | -------- |
| `default` | 滚动内容 |

### Scrollbar Exposes

| 暴露项          | 说明               | 类型                                    |
| --------------- | ------------------ | --------------------------------------- |
| `wrapRef`       | 滚动容器引用       | `Ref<HTMLDivElement \| null>`           |
| `update`        | 手动更新滚动条状态 | `() => void`                            |
| `scrollTo`      | 滚动到指定位置     | `(x, y) => void` 或 `(options) => void` |
| `setScrollTop`  | 设置纵向滚动位置   | `(value: number) => void`               |
| `setScrollLeft` | 设置横向滚动位置   | `(value: number) => void`               |
| `handleScroll`  | 手动触发滚动同步   | `() => void`                            |

## 行为约定

- `native=false` 时会隐藏原生滚动条并渲染自定义 thumb。
- `native=true` 时只保留滚动容器本身，不渲染自定义滚动条。
- `trailing` / `leading` 这类复杂滚动吸附不在当前组件职责内，更适合由业务层处理。
