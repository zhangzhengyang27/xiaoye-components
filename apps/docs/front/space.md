---
title: Space 间距
description: 间距组件，用于设置元素之间的间距。
outline: deep
---

# Space 间距

`xyu-space` 是前台组件库的间距组件，用于设置元素之间的间距。

## 基础用法

:::demo 基础间距用法。
space/basic
:::

## 间距尺寸

:::demo 使用 `size` 属性设置间距尺寸。
space/size
:::

## 换行

:::demo 使用 `wrap` 属性允许换行。
space/wrap
:::

## 垂直排列

:::demo 使用 `direction` 属性设置垂直排列。
space/vertical
:::

## 对齐方式

:::demo 使用 `alignment` 属性设置对齐方式。
space/alignment
:::

## API

### Space Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `size` | 间距尺寸 | `'sm' \| 'md' \| 'lg' \| 'xl' \| [number, number]` | `'md'` |
| `direction` | 排列方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `alignment` | 对齐方式 | `'start' \| 'end' \| 'center' \| 'baseline'` | `'center'` |
| `wrap` | 是否自动换行 | `boolean` | `false` |
| `fill` | 子元素是否填充 | `boolean` | `false` |

### Space Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 间距内的元素 |
