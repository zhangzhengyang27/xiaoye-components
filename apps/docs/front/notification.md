---
title: Notification 通知
description: 通知组件，用于展示重要通知。
outline: deep
---

# Notification 通知

`xyu-notification` 是前台组件库的通知组件，用于展示重要通知信息。

## 基础用法

:::demo 基础通知用法。
notification/basic
:::

## 通知类型

:::demo 使用 `type` 属性设置通知类型。
notification/type
:::

## 位置

:::demo 使用 `position` 属性设置通知位置。
notification/position
:::

## 可关闭

:::demo 使用 `show-close` 属性控制关闭按钮显示。
notification/close
:::

## API

### Notification Options

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 通知标题 | `string` | - |
| `message` | 通知内容 | `string` | - |
| `type` | 通知类型 | `'success' \| 'warning' \| 'error' \| 'info' \| ''` | - |
| `duration` | 显示时长（毫秒），0 表示不自动关闭 | `number` | `4500` |
| `show-close` | 是否显示关闭按钮 | `boolean` | `true` |
| `position` | 通知位置 | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` |
| `offset` | 偏移量 | `number` | `20` |
| `z-index` | z-index 值 | `number` | `9999` |

### Notification Service

```ts
import { XyuNotification } from 'xiaoye-components';

// 基本用法
XyuNotification({
  title: '提示',
  message: '这是一条通知消息',
  type: 'success'
});

// 关闭所有
XyuNotification.closeAll();
```
