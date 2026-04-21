---
title: Button 按钮
description: 按钮用于触发操作或事件，如提交表单、打开对话框等。
outline: deep
---

# Button 按钮

`xyu-button` 是前台组件库的基础按钮组件，支持多种类型、尺寸、状态和图标。

## 基础用法

:::demo 使用 `type` 定义按钮类型。
button/basic
:::

## 禁用状态

:::demo 使用 `disabled` 属性禁用按钮。
button/disabled
:::

## 图标按钮

:::demo 使用 `icon` 属性添加图标。
button/icon
:::

## 加载状态

:::demo 使用 `loading` 属性显示加载状态。
button/loading
:::

## 尺寸

:::demo 使用 `size` 属性设置按钮尺寸。
button/size
:::

## API

### Button Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `type` | 按钮类型 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'default'` |
| `size` | 按钮尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `loading` | 是否显示加载状态 | `boolean` | `false` |
| `icon` | 图标 | `string` | - |
| `native-type` | 原生按钮类型 | `'button' \| 'submit' \| 'reset'` | `'button'` |
| `round` | 是否圆角按钮 | `boolean` | `false` |
| `circle` | 是否圆形按钮 | `boolean` | `false` |
| `block` | 是否块级按钮 | `boolean` | `false` |

### Button Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `click` | 点击按钮时触发 | `(event: MouseEvent)` |

### Button Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 按钮内容 |
| `icon` | 自定义图标 |
| `loading` | 自定义加载内容 |
| `prefix` | 前缀内容 |
| `suffix` | 后缀内容 |
