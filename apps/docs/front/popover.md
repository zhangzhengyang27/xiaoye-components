---
title: Popover 弹出框
description: 弹出框组件，用于展示更多内容。
outline: deep
---

# Popover 弹出框

`xyu-popover` 是前台组件库的弹出框组件，与 Tooltip 类似但支持更丰富的内容。

## 基础用法

:::demo 基础弹出框用法。
popover/basic
:::

## 触发方式

:::demo 使用 `trigger` 属性设置触发方式。
popover/trigger
:::

## 弹出位置

:::demo 使用 `placement` 属性设置弹出位置。
popover/placement
:::

## 显示箭头

:::demo 使用 `show-arrow` 属性控制箭头显示。
popover/arrow
:::

## 延迟显示

:::demo 使用 `delay` 属性设置显示延迟。
popover/delay
:::

## API

### Popover Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `content` | 弹出框内容 | `string` | - |
| `title` | 弹出框标题 | `string` | - |
| `placement` | 弹出位置 | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'right'` | `'top'` |
| `trigger` | 触发方式 | `'hover' \| 'click' \| 'focus' \| 'manual'` | `'hover'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `delay` | 延迟显示时间（毫秒） | `number` | `100` |
| `offset` | 偏移量 | `number` | `8` |
| `width` | 弹出框宽度 | `number \| 'auto'` | `'auto'` |
| `max-width` | 最大宽度 | `number` | `320` |
| `show-arrow` | 是否显示箭头 | `boolean` | `true` |
| `transition-name` | 过渡动画名称 | `string` | `'xyu-popover'` |
| `append-to-body` | 是否挂载到 body | `boolean` | `true` |
| `visible` | 是否显示（受控） | `boolean` | `false` |

### Popover Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:visible` | 显示状态变化时触发 | `(value: boolean)` |
| `show` | 显示时触发 | - |
| `hide` | 隐藏时触发 | - |

### Popover Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 触发器内容 |
| `title` | 自定义标题 |
| `content` | 自定义内容 |
