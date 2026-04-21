---
title: Steps 步骤条
description: 步骤条组件，用于展示流程进度。
outline: deep
---

# Steps 步骤条

`xyu-steps` 是前台组件库的步骤条组件，用于展示流程进度。

## 基础用法

:::demo 基础步骤条用法。
steps/basic
:::

## 步骤状态

:::demo 使用 `status` 属性设置步骤状态。
steps/status
:::

## 垂直方向

:::demo 使用 `direction` 属性设置垂直排列。
steps/vertical
:::

## 简洁风格

:::demo 使用 `simple` 属性启用简洁风格。
steps/simple
:::

## 自定义图标

:::demo 使用 `icon` 插槽自定义步骤图标。
steps/icon
:::

## API

### Steps Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `active` | 当前激活步骤索引 | `number` | `0` |
| `direction` | 排列方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `align-center` | 步骤标签是否居中对齐 | `boolean` | `false` |
| `simple` | 是否简洁风格 | `boolean` | `false` |
| `finish-status` | 完成状态 | `'wait' \| 'process' \| 'finish' \| 'error'` | `'finish'` |
| `process-status` | 进行中状态 | `'wait' \| 'process' \| 'finish' \| 'error'` | `'process'` |

### Step Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 步骤标题 | `string` | - |
| `description` | 步骤描述 | `string` | - |
| `status` | 步骤状态 | `'wait' \| 'process' \| 'finish' \| 'error'` | - |
| `disabled` | 是否禁用 | `boolean` | `false` |

### Steps Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 步骤内容 |

### Step Slots

| 插槽名 | 说明 |
| --- | --- |
| `icon` | 自定义图标 |
| `title` | 自定义标题 |
| `description` | 自定义描述 |
