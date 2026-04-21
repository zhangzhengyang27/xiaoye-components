---
title: Link 链接
description: 链接组件，用于跳转或触发操作。
outline: deep
---

# Link 链接

`xyu-link` 是前台组件库的链接组件，提供多种链接样式和状态。

## 基础用法

:::demo 使用 `type` 定义链接颜色类型。
link/basic
:::

## 下划线

:::demo 使用 `underline` 属性控制下划线显示时机。
link/underline
:::

## 禁用状态

:::demo 使用 `disabled` 属性禁用链接。
link/disabled
:::

## 新窗口打开

:::demo 使用 `target="_blank"` 在新窗口打开链接。
link/target
:::

## API

### Link Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `type` | 链接类型 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'default'` |
| `underline` | 下划线显示时机 | `'always' \| 'hover' \| 'never'` | `'hover'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `href` | 链接地址 | `string` | - |
| `target` | 跳转目标 | `'_self' \| '_blank'` | `'_self'` |

### Link Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `click` | 点击链接时触发 | `(event: MouseEvent)` |
