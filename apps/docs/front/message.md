---
title: Message 消息提示
description: 消息提示组件，用于展示轻量级反馈。
outline: deep
---

# Message 消息提示

`xyu-message` 是前台组件库的消息提示组件，用于展示轻量级反馈信息。

## 基础用法

:::demo 基础消息提示用法。
message/basic
:::

## 消息类型

:::demo 使用 `type` 属性设置消息类型。
message/type
:::

## 可关闭

:::demo 使用 `show-close` 属性显示关闭按钮。
message/closable
:::

## 自定义时长

:::demo 使用 `duration` 属性设置显示时长。
message/duration
:::

## API

### Message Options

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `type` | 消息类型 | `'success' \| 'warning' \| 'error' \| 'info' \| ''` | - |
| `message` | 消息内容 | `string` | - |
| `duration` | 显示时长（毫秒），0 表示不自动关闭 | `number` | `3000` |
| `show-close` | 是否显示关闭按钮 | `boolean` | `false` |
| `effect` | 主题风格 | `'light' \| 'dark'` | `'light'` |

### Message Service

```ts
import { XyuMessage } from 'xiaoye-components';

// 基本用法
XyuMessage({
  message: '这是一条消息提示',
  type: 'success'
});

// 关闭所有
XyuMessage.closeAll();
```
