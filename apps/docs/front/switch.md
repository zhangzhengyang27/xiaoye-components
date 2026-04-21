---
title: Switch 开关
description: 开关组件，用于切换状态。
outline: deep
---

# Switch 开关

`xyu-switch` 是前台组件库的开关组件，用于切换开关状态。

## 基础用法

:::demo 基础开关用法。
switch/basic
:::

## 禁用状态

:::demo 使用 `disabled` 属性禁用开关。
switch/disabled
:::

## 加载状态

:::demo 使用 `loading` 属性显示加载状态。
switch/loading
:::

## 尺寸

:::demo 使用 `size` 属性设置开关尺寸。
switch/size
:::

## 自定义值

:::demo 使用 `active-value` 和 `inactive-value` 自定义开关的值。
switch/value
:::

## API

### Switch Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `v-model` | 绑定值 | `unknown` | - |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `loading` | 是否加载中 | `boolean` | `false` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `active-value` | 打开时的值 | `unknown` | `true` |
| `inactive-value` | 关闭时的值 | `unknown` | `false` |
| `active-text` | 打开时的文字 | `string` | - |
| `inactive-text` | 关闭时的文字 | `string` | - |

### Switch Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 绑定值变化时触发 | `(value: unknown)` |
| `change` | 状态变化时触发 | `(value: unknown)` |
