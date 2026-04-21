---
title: TimePicker 时间选择
description: 时间选择器组件，用于选择时间。
outline: deep
---

# TimePicker 时间选择

`xyu-time-picker` 是前台组件库的时间选择器组件，用于选择时间或时间范围。

## 基础用法

:::demo 基础时间选择器用法。
time-picker/basic
:::

## 范围选择

:::demo 使用 `is-range` 属性选择时间范围。
time-picker/range
:::

## 禁用状态

:::demo 使用 `disabled` 属性禁用选择器。
time-picker/disabled
:::

## 格式化

:::demo 使用 `format` 属性设置时间格式。
time-picker/format
:::

## API

### TimePicker Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `v-model` | 绑定值 | `string \| [string, string]` | - |
| `placeholder` | 占位文本 | `string` | - |
| `format` | 格式化字符串 | `string` | `'HH:mm:ss'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `clearable` | 是否可清空 | `boolean` | `false` |
| `is-range` | 是否范围选择 | `boolean` | `false` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `step` | 步进值 | `{ hour: number; minute: number; second: number }` | - |

### TimePicker Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 绑定值变化时触发 | `(value: string \| [string, string])` |
| `change` | 值变化时触发 | `(value: string \| [string, string])` |
