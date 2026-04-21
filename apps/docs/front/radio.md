---
title: Radio 单选框
description: 单选框组件，用于单选操作。
outline: deep
---

# Radio 单选框

`xyu-radio` 是前台组件库的单选框组件，用于单选操作。

## 基础用法

:::demo 基础单选框用法。
radio/basic
:::

## 禁用状态

:::demo 使用 `disabled` 属性禁用单选框。
radio/disabled
:::

## 带边框

:::demo 使用 `border` 属性显示边框。
radio/border
:::

## 尺寸

:::demo 使用 `size` 属性设置尺寸。
radio/size
:::

## API

### Radio Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `v-model` | 绑定值 | `boolean` | - |
| `label` | 标签文本 | `string` | - |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `checked` | 是否选中 | `boolean` | `false` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `border` | 是否显示边框 | `boolean` | `false` |
| `name` | 原生 name 属性 | `string` | - |

### Radio Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 绑定值变化时触发 | `(value: boolean)` |
| `change` | 选中状态变化时触发 | `(value: boolean)` |
