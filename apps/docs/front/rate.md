---
title: Rate 评分
description: 评分组件，用于打分或评价。
outline: deep
---

# Rate 评分

`xyu-rate` 是前台组件库的评分组件，用于打分或评价操作。

## 基础用法

:::demo 基础评分用法。
rate/basic
:::

## 辅助文字

:::demo 使用 `show-text` 属性显示辅助文字。
rate/text
:::

## 只读状态

:::demo 使用 `readonly` 属性设置只读状态。
rate/readonly
:::

## 自定义图标颜色

:::demo 使用 `color` 属性自定义选中颜色。
rate/color
:::

## 半星评分

:::demo 使用 `allow-half` 属性允许选择半星。
rate/half
:::

## API

### Rate Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `v-model` | 绑定值 | `number` | `0` |
| `max` | 最大评分 | `number` | `5` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `readonly` | 是否只读 | `boolean` | `false` |
| `allow-half` | 是否允许半星 | `boolean` | `false` |
| `allow-clear` | 是否允许清除 | `boolean` | `false` |
| `color` | 选中颜色 | `string` | `'var(--xyu-warning)'` |
| `void-color` | 未选中颜色 | `string` | - |
| `show-text` | 是否显示辅助文字 | `boolean` | `false` |
| `text-color` | 辅助文字颜色 | `string` | - |
| `texts` | 辅助文字数组 | `string[]` | `['极差', '差', '一般', '满意', '很满意']` |

### Rate Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 评分变化时触发 | `(value: number)` |
| `change` | 评分变化时触发 | `(value: number)` |
