---
title: Col 栅格列
description: 配合 Row 使用的 24 栅格列组件。
outline: deep
---

# Col 栅格列

`xy-col` 负责描述一列占据多少栅格，以及它在不同断点下如何偏移、位移和隐藏。它通常和 `xy-row` 一起使用，但也可以单独承载栅格宽度规则。

## 基础列宽

:::demo 先用 `span` 切出列宽，再决定卡片和表单块如何填充内容。
row/basic
:::

## 偏移与位移

:::demo `offset` 更适合做留白占位，`push / pull` 更适合调整视觉顺序。
col/offset-push-pull
:::

## 响应式断点

:::demo `xs / sm / md / lg / xl` 支持直接传数字，也支持对象形式按断点配置 `span / offset / pull / push`。
row/responsive
:::

## 与 Row 配合使用

- `xy-col` 最常见的搭配是放在 `xy-row` 内，由 Row 统一下发 `gutter`。
- 如果外层没有 `xy-row`，Col 会退回到无间距模式，只保留列宽和断点规则。
- 当某个断点下的 `span` 为 `0` 时，该列会在对应范围内隐藏。

## API

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
