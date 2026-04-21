---
title: InputNumber 数字输入框
description: 数字输入框组件，用于输入数字。
outline: deep
---

# InputNumber 数字输入框

`xyu-input-number` 是前台组件库的数字输入框组件，支持数值加减和范围限制。

## 基础用法

:::demo 基础数字输入框用法。
input-number/basic
:::

## 禁用状态

:::demo 使用 `disabled` 属性禁用输入框。
input-number/disabled
:::

## 范围限制

:::demo 使用 `min` 和 `max` 属性设置数值范围。
input-number/range
:::

## 步进

:::demo 使用 `step` 属性设置步进值。
input-number/step
:::

## 精度

:::demo 使用 `precision` 属性设置小数精度。
input-number/precision
:::

## 按钮位置

:::demo 使用 `controls-position` 属性设置按钮位置。
input-number/controls
:::

## API

### InputNumber Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `v-model` | 绑定值 | `number` | - |
| `min` | 最小值 | `number` | `-Infinity` |
| `max` | 最大值 | `number` | `Infinity` |
| `step` | 步进值 | `number` | `1` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `readonly` | 是否只读 | `boolean` | `false` |
| `precision` | 小数精度 | `number` | - |
| `controls` | 是否显示控制按钮 | `boolean` | `true` |
| `controls-position` | 控制按钮位置 | `'right' \| 'both'` | `'right'` |
| `placeholder` | 占位文本 | `string` | - |

### InputNumber Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 绑定值变化时触发 | `(value: number)` |
| `change` | 值变化时触发 | `(value: number)` |
