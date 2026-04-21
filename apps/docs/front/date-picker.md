---
title: DatePicker 日期选择
description: 日期选择器组件，用于选择日期。
outline: deep
---

# DatePicker 日期选择

`xyu-date-picker` 是前台组件库的日期选择器组件，用于选择日期或日期范围。

## 基础用法

:::demo 基础日期选择器用法。
date-picker/basic
:::

## 日期范围

:::demo 使用 `type="daterange"` 选择日期范围。
date-picker/range
:::

## 禁用日期

:::demo 使用 `disabled-date` 属性禁用特定日期。
date-picker/disabled
:::

## 选择周

:::demo 使用 `type="week"` 选择周。
date-picker/week
:::

## 选择月

:::demo 使用 `type="month"` 选择月。
date-picker/month
:::

## API

### DatePicker Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `v-model` | 绑定值 | `Date \| [Date, Date]` | - |
| `type` | 选择器类型 | `'date' \| 'daterange' \| 'week' \| 'month'` | `'date'` |
| `placeholder` | 占位文本 | `string` | - |
| `format` | 格式化字符串 | `string` | `'YYYY-MM-DD'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `clearable` | 是否可清空 | `boolean` | `false` |
| `disabled-date` | 禁用日期函数 | `(date: Date) => boolean` | - |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |

### DatePicker Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 绑定值变化时触发 | `(value: Date \| [Date, Date])` |
| `change` | 值变化时触发 | `(value: Date \| [Date, Date])` |
