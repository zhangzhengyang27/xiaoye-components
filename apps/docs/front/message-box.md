---
title: MessageBox 消息框
description: 消息框组件，用于显示模态消息。
outline: deep
---

# MessageBox 消息框

`xyu-message-box` 是前台组件库的消息框组件，用于显示模态消息和确认操作。

## 基础用法

:::demo 基础消息框用法。
message-box/basic
:::

## 确认消息

:::demo 使用 `confirm` 方法显示确认消息框。
message-box/confirm
:::

## 带输入框

:::demo 使用 `prompt` 方法显示带输入框的消息框。
message-box/prompt
:::

## 自定义配置

:::demo 自定义消息框标题和按钮文字。
message-box/custom
:::

## API

### MessageBox Methods

```ts
import { XyuMessageBox } from 'xiaoye-components';

// 基础用法
XyuMessageBox({
  title: '提示',
  message: '这是一条消息'
});

// 确认操作
XyuMessageBox.confirm({
  title: '确认删除',
  message: '确定要删除这条数据吗？',
  confirmButtonText: '删除',
  cancelButtonText: '取消'
});

// 带输入框
XyuMessageBox.prompt({
  title: '输入',
  message: '请输入内容'
});
```

### MessageBox Options

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 标题 | `string` | - |
| `message` | 内容 | `string` | - |
| `type` | 消息类型 | `'success' \| 'warning' \| 'error' \| 'info'` | - |
| `confirmButtonText` | 确认按钮文字 | `string` | `'确定'` |
| `cancelButtonText` | 取消按钮文字 | `string` | `'取消'` |
| `showCancelButton` | 是否显示取消按钮 | `boolean` | `true` |
| `showInput` | 是否显示输入框 | `boolean` | `false` |
| `inputPlaceholder` | 输入框占位文本 | `string` | - |
| `inputType` | 输入框类型 | `'text' \| 'textarea'` | `'text'` |
