---
title: ColorPicker 颜色选择器
description: 颜色选择器组件，用于选择颜色。
outline: deep
---

# ColorPicker 颜色选择器

`xyu-color-picker` 是前台组件库的颜色选择器组件，用于选择颜色值。

## 基础用法

:::demo 基础颜色选择器用法。
color-picker/basic
:::

## 禁用状态

:::demo 使用 `disabled` 属性禁用选择器。
color-picker/disabled
:::

## 显示透明度

:::demo 使用 `show-alpha` 属性显示透明度滑块。
color-picker/alpha
:::

## 预定义颜色

:::demo 使用 `predefine` 属性设置预定义颜色。
color-picker/predefine
:::

## API

### ColorPicker Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `v-model` | 绑定值（颜色值） | `string` | - |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `show-alpha` | 是否显示透明度 | `boolean` | `false` |
| `predefine` | 预定义颜色列表 | `string[]` | - |
| `format` | 颜色格式 | `'hex' \| 'rgb' \| 'hsl'` | `'hex'` |

### ColorPicker Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 绑定值变化时触发 | `(value: string)` |
| `change` | 颜色变化时触发 | `(value: string)` |
