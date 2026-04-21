---
title: Slider 滑块
description: 滑块组件，用于选择数值范围。
outline: deep
---

# Slider 滑块

`xyu-slider` 是前台组件库的滑块组件，用于在数值范围内进行选择。

## 基础用法

:::demo 基础滑块用法。
slider/basic
:::

## 禁用状态

:::demo 使用 `disabled` 属性禁用滑块。
slider/disabled
:::

## 范围选择

:::demo 使用 `range` 属性开启范围选择。
slider/range
:::

## 显示输入框

:::demo 使用 `show-input` 属性显示数值输入框。
slider/input
:::

## 显示步进点

:::demo 使用 `show-stops` 属性显示步进点。
slider/stops
:::

## 垂直模式

:::demo 使用 `vertical` 属性设置垂直模式。
slider/vertical
:::

## API

### Slider Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `v-model` | 绑定值 | `number \| [number, number]` | - |
| `min` | 最小值 | `number` | `0` |
| `max` | 最大值 | `number` | `100` |
| `step` | 步进值 | `number` | `1` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `show-input` | 是否显示输入框 | `boolean` | `false` |
| `show-stops` | 是否显示步进点 | `boolean` | `false` |
| `range` | 是否范围选择 | `boolean` | `false` |
| `vertical` | 是否垂直模式 | `boolean` | `false` |
| `height` | 垂直模式下的高度 | `string` | `'200px'` |

### Slider Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 绑定值变化时触发 | `(value: number \| [number, number])` |
| `change` | 值变化时触发 | `(value: number \| [number, number])` |
