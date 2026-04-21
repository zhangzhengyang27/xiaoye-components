---
title: Badge 徽标
description: 徽标组件，用于显示数量或状态。
outline: deep
---

# Badge 徽标

`xyu-badge` 是前台组件库的徽标组件，用于显示数量或状态提示。

## 基础用法

:::demo 使用 `value` 显示数字徽标。
badge/basic
:::

## 最大值

:::demo 使用 `max` 属性设置最大显示值。
badge/max
:::

## 点状徽标

:::demo 使用 `is-dot` 属性显示点状徽标。
badge/dot
:::

## 隐藏徽标

:::demo 使用 `hidden` 属性隐藏徽标。
badge/hidden
:::

## 自定义颜色

:::demo 使用 `color` 属性自定义徽标颜色。
badge/color
:::

## API

### Badge Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `value` | 徽标内容 | `string \| number` | - |
| `max` | 最大值，超过最大值显示 `{max}+` | `number` | `99` |
| `is-dot` | 是否显示为点状 | `boolean` | `false` |
| `hidden` | 是否隐藏徽标 | `boolean` | `false` |
| `type` | 徽标类型 | `'primary' \| 'success' \| 'warning' \| 'danger'` | `'danger'` |
| `size` | 徽标尺寸 | `'sm' \| 'md'` | `'md'` |
| `show-zero` | 当值为 0 时是否显示 | `boolean` | `true` |
| `color` | 自定义颜色 | `string` | - |

### Badge Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 徽标包裹的内容 |
| `content` | 自定义徽标内容 |
