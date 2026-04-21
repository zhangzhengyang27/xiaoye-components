---
title: Divider 分割线
description: 分割线组件，用于分隔内容。
outline: deep
---

# Divider 分割线

`xyu-divider` 是前台组件库的分割线组件，用于分隔内容或表达段落结束。

## 基础用法

:::demo 基础分割线用法。
divider/basic
:::

## 带文字分割线

:::demo 在分割线中间显示文字。
divider/text
:::

## 垂直分割线

:::demo 使用 `direction="vertical"` 创建垂直分割线。
divider/vertical
:::

## 分割线样式

:::demo 使用 `border-style` 属性设置分割线样式。
divider/style
:::

## 分割线颜色

:::demo 使用 `color` 属性设置分割线颜色。
divider/color
:::

## API

### Divider Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `direction` | 分割线方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `border-style` | 边框样式 | `'solid' \| 'dashed' \| 'dotted'` | `'solid'` |
| `content-position` | 内容位置 | `'left' \| 'center' \| 'right'` | `'center'` |
| `color` | 分割线颜色 | `string` | - |
