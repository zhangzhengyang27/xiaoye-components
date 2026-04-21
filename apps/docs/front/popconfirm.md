---
title: Popconfirm 气泡确认框
description: 气泡确认框组件，用于需要用户确认的操作。
outline: deep
---

# Popconfirm 气泡确认框

`xyu-popconfirm` 是前台组件库的气泡确认框组件，用于需要用户二次确认的操作。

## 基础用法

:::demo 基础气泡确认框用法。
popconfirm/basic
:::

## 触发方式

:::demo 使用 `trigger` 属性设置触发方式。
popconfirm/trigger
:::

## 弹出位置

:::demo 使用 `placement` 属性设置弹出位置。
popconfirm/placement
:::

## 自定义内容

:::demo 使用插槽自定义确认框内容。
popconfirm/slot
:::

## API

### Popconfirm Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 确认框标题 | `string` | - |
| `content` | 确认框内容 | `string` | - |
| `confirm-button-text` | 确认按钮文字 | `string` | `'确定'` |
| `cancel-button-text` | 取消按钮文字 | `string` | `'取消'` |
| `confirm-button-type` | 确认按钮类型 | `'primary' \| 'success' \| 'warning' \| 'danger'` | `'primary'` |
| `icon` | 自定义图标 | `string` | - |
| `placement` | 弹出位置 | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end'` | `'top'` |
| `trigger` | 触发方式 | `'click' \| 'hover' \| 'focus' \| 'manual'` | `'click'` |

### Popconfirm Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `confirm` | 点击确认按钮时触发 | - |
| `cancel` | 点击取消按钮时触发 | - |

### Popconfirm Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 触发器内容 |
| `icon` | 自定义图标 |
| `content` | 自定义内容 |
