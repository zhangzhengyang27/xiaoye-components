---
title: Skeleton 骨架屏
description: 骨架屏组件，用于内容加载占位。
outline: deep
---

# Skeleton 骨架屏

`xyu-skeleton` 是前台组件库的骨架屏组件，用于在内容加载时显示占位效果。

## 基础用法

:::demo 基础骨架屏用法。
skeleton/basic
:::

## 骨架屏变体

:::demo 使用 `variant` 属性设置骨架屏形状。
skeleton/variants
:::

## 动画

:::demo 使用 `animated` 属性开启骨架屏动画。
skeleton/animated
:::

## 自定义行数

:::demo 使用 `rows` 属性设置骨架屏行数。
skeleton/rows
:::

## 自定义宽度和高度

:::demo 使用 `width` 和 `height` 属性自定义尺寸。
skeleton/custom
:::

## API

### Skeleton Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `variant` | 骨架屏变体 | `'text' \| 'circular' \| 'rectangular' \| 'rounded'` | `'text'` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `loading` | 是否显示骨架屏 | `boolean` | `true` |
| `animated` | 是否开启动画 | `boolean` | `true` |
| `rows` | 骨架屏行数 | `number` | `3` |
| `width` | 自定义宽度 | `string \| number` | - |
| `height` | 自定义高度 | `string \| number` | - |

### Skeleton Slots

| 插槽名 | 说明 |
| --- | --- |
| `template` | 自定义骨架屏模板 |
| `default` | 真实内容 |
