---
title: Backtop 回到顶部
description: 回到顶部组件，用于快速回到页面顶部。
outline: deep
---

# Backtop 回到顶部

`xyu-backtop` 是前台组件库的回到顶部组件，用于快速滚动回页面顶部。

## 基础用法

:::demo 基础回到顶部用法。
backtop/basic
:::

## 自定义位置

:::demo 使用 `right` 和 `bottom` 属性自定义位置。
backtop/position
:::

## 自定义内容

:::demo 使用默认插槽自定义回到顶部按钮内容。
backtop/slot
:::

## 显示条件

:::demo 使用 `visibility-height` 属性设置滚动多少距离后显示。
backtop/visibility
:::

## API

### Backtop Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `visibility-height` | 显示的滚动距离阈值 | `number` | `200` |
| `right` | 距离右侧距离 | `number` | `24` |
| `bottom` | 距离底部距离 | `number` | `40` |
| `duration` | 滚动动画时长（毫秒） | `number` | `400` |

### Backtop Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `click` | 点击按钮时触发 | `(event: MouseEvent)` |

### Backtop Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 自定义按钮内容 |
