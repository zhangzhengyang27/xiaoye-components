---
title: Space 间距
description: 给一组元素建立统一间距的基础布局组件。
outline: deep
---

# Space 间距

`xy-space` 用来给一组行内或纵向元素建立统一间距，适合按钮组、筛选栏和表单操作区。

## 基础用法

:::demo 最常见的场景是把一组按钮或轻量操作排成一行，并统一控制它们之间的距离。
space/basic
:::

## 纵向排列

:::demo 当信息需要堆叠展示时，可以切到 `vertical` 方向，并通过 `align` 控制左对齐或居中。
space/vertical
:::

## 自动换行与自定义间距

:::demo 筛选标签、快捷入口或统计卡片通常更适合配合 `wrap` 使用，让内容在窄屏下自然换行。
space/wrap
:::

## API

### Space Attributes

| 属性        | 说明           | 类型                                               | 默认值         |
| ----------- | -------------- | -------------------------------------------------- | -------------- |
| `size`      | 间距大小       | `number \| 'sm' \| 'md' \| 'lg'`                   | `'md'`         |
| `direction` | 排列方向       | `'horizontal' \| 'vertical'`                       | `'horizontal'` |
| `wrap`      | 是否允许换行   | `boolean`                                          | `false`        |
| `align`     | 交叉轴对齐方式 | `'start' \| 'center' \| 'end' \| 'stretch'`        | `'center'`     |

### Space Slots

| 插槽      | 说明             |
| --------- | ---------------- |
| `default` | 被统一排布的内容 |
