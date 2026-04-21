---
title: Result 结果
description: 结果组件，用于展示操作结果。
outline: deep
---

# Result 结果

`xyu-result` 是前台组件库的结果组件，用于展示操作结果的反馈。

## 基础用法

:::demo 基础结果用法。
result/basic
:::

## 结果类型

:::demo 使用 `type` 属性设置结果类型。
result/type
:::

## 自定义图标

:::demo 使用 `icon` 插槽自定义图标。
result/icon
:::

## 自定义内容

:::demo 使用插槽自定义结果内容。
result/slot
:::

## API

### Result Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `type` | 结果类型 | `'success' \| 'warning' \| 'error' \| 'info' \| '404' \| '403' \| '500' \| 'empty'` | `'info'` |
| `title` | 结果标题 | `string` | - |
| `description` | 结果描述 | `string` | - |
| `icon` | 自定义图标 | `string` | - |

### Result Slots

| 插槽名 | 说明 |
| --- | --- |
| `icon` | 自定义图标 |
| `title` | 自定义标题 |
| `subTitle` | 自定义副标题/描述 |
| `default` | 自定义内容 |
| `extra` | 自定义操作区 |
