---
title: Timeline 时间线
description: 时间线组件，用于展示时间序列。
outline: deep
---

# Timeline 时间线

`xyu-timeline` 是前台组件库的时间线组件，用于展示时间序列信息。

## 基础用法

:::demo 基础时间线用法。
timeline/basic
:::

## 时间线方向

:::demo 使用 `direction` 属性设置时间线方向。
timeline/direction
:::

## 时间线模式

:::demo 使用 `mode` 属性设置时间线模式。
timeline/mode
:::

## 时间线节点状态

:::demo 使用 `status` 属性设置节点状态。
timeline/status
:::

## 自定义节点

:::demo 使用 `dot` 插槽自定义节点内容。
timeline/dot
:::

## API

### Timeline Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `direction` | 时间线方向 | `'vertical' \| 'horizontal'` | `'vertical'` |
| `mode` | 时间线模式 | `'left' \| 'alternate' \| 'right'` | `'left'` |
| `reverse` | 是否反向排序 | `boolean` | `false` |

### TimelineItem Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `timestamp` | 时间戳 | `string` | - |
| `status` | 节点状态 | `'pending' \| 'processing' \| 'success' \| 'error'` | `'pending'` |
| `hollow` | 节点是否空心 | `boolean` | `false` |
| `color` | 自定义节点颜色 | `string` | - |
| `dot` | 自定义节点内容 | `string` | - |

### Timeline Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `click` | 点击时间线节点时触发 | `(item: TimelineItem)` |

### TimelineItem Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 时间线节点内容 |
| `dot` | 自定义节点 |
