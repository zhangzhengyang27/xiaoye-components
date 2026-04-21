---
title: Progress 进度条
description: 进度条组件，用于展示进度信息。
outline: deep
---

# Progress 进度条

`xyu-progress` 是前台组件库的进度条组件，用于展示操作进度。

## 基础用法

:::demo 基础进度条用法。
progress/basic
:::

## 进度比例

:::demo 使用 `percentage` 属性设置进度比例。
progress/percentage
:::

## 自定义颜色

:::demo 使用 `stroke-color` 属性自定义进度条颜色。
progress/color
:::

## 环形进度

:::demo 使用 `type="circle"` 创建环形进度条。
progress/circle
:::

## 进度条宽度

:::demo 使用 `stroke-width` 属性设置进度条宽度。
progress/width
:::

## 进度条内文字

:::demo 使用 `show-text` 属性控制进度条内文字显示。
progress/text
:::

## API

### Progress Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `percentage` | 进度比例（0-100） | `number` | `0` |
| `type` | 进度条类型 | `'line' \| 'circle' \| 'dashboard'` | `'line'` |
| `stroke-width` | 进度条宽度 | `number` | `8` |
| `width` | 环形进度条画布宽度 | `number` | `126` |
| `size` | 尺寸 | `'default' \| 'small'` | `'default'` |
| `show-text` | 是否显示进度条内文字 | `boolean` | `true` |
| `stroke-color` | 进度条颜色 | `string` | - |
| `status` | 进度条状态 | `'success' \| 'warning' \| 'error'` | - |
| `striped` | 是否条纹样式 | `boolean` | `false` |
| `striped-flow` | 是否条纹流动动画 | `boolean` | `false` |
| `indeterminate` | 是否动画不确定状态 | `boolean` | `false` |
| `format` | 自定义进度条文字格式化函数 | `(percentage: number) => string` | - |

### Progress Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 自定义进度条内文字 |
