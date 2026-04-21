---
title: Tooltip 文字提示
description: 文字提示组件，用于展示提示信息。
outline: deep
---

# Tooltip 文字提示

`xyu-tooltip` 是前台组件库的文字提示组件，用于展示简短的提示信息。

## 基础用法

:::demo 基础文字提示用法。
tooltip/basic
:::

## 提示位置

:::demo 使用 `placement` 属性设置提示位置。
tooltip/placement
:::

## 触发方式

:::demo 使用 `trigger` 属性设置触发方式。
tooltip/trigger
:::

## 延迟显示

:::demo 使用 `delay` 属性设置显示延迟。
tooltip/delay
:::

## API

### Tooltip Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `content` | 提示内容 | `string` | - |
| `placement` | 提示位置 | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` |
| `trigger` | 触发方式 | `'hover' \| 'focus' \| 'click'` | `'hover'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `delay` | 延迟显示时间（毫秒） | `number` | `100` |
| `offset` | 偏移量 | `number` | `8` |
| `max-width` | 最大宽度 | `number` | `280` |
