---
title: Alert 警告提示
description: 警告提示组件，用于展示重要信息。
outline: deep
---

# Alert 警告提示

`xyu-alert` 是前台组件库的警告提示组件，用于展示重要信息和提示。

## 基础用法

:::demo 基础警告提示用法。
alert/basic
:::

## 警告类型

:::demo 使用 `type` 属性设置警告类型。
alert/type
:::

## 可关闭

:::demo 使用 `closable` 属性添加关闭按钮。
alert/closable
:::

## 显示图标

:::demo 使用 `show-icon` 属性显示图标。
alert/icon
:::

## 主题风格

:::demo 使用 `effect` 属性设置主题风格。
alert/effect
:::

## 描述文字

:::demo 使用 `description` 属性添加描述文字。
alert/description
:::

## API

### Alert Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `v-model` | 是否显示 | `boolean` | `true` |
| `title` | 标题 | `string` | - |
| `description` | 描述文字 | `string` | - |
| `type` | 警告类型 | `'success' \| 'warning' \| 'error' \| 'info'` | `'info'` |
| `closable` | 是否可关闭 | `boolean` | `false` |
| `close-text` | 自定义关闭按钮文字 | `string` | - |
| `show-icon` | 是否显示图标 | `boolean` | `true` |
| `effect` | 主题风格 | `'light' \| 'dark'` | `'light'` |
| `center` | 内容是否居中 | `boolean` | `false` |
| `display-mode` | 显示模式 | `'default' \| 'card'` | `'default'` |

### Alert Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `close` | 点击关闭按钮时触发 | `(event: MouseEvent)` |
| `update:modelValue` | 显示状态变化时触发 | `(value: boolean)` |

### Alert Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 描述区内容 |
| `actions` | 操作区内容 |
