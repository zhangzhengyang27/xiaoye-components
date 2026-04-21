---
title: Pagination 分页
description: 分页组件，用于数据列表的分页。
outline: deep
---

# Pagination 分页

`xyu-pagination` 是前台组件库的分页组件，用于数据列表的分页展示。

## 基础用法

:::demo 基础分页用法。
pagination/basic
:::

## 背景风格

:::demo 使用 `background` 属性启用背景按钮风格。
pagination/background
:::

## 完整功能

:::demo 展示完整的分页组件功能。
pagination/layout
:::

## 尺寸

:::demo 使用 `small` 属性使用小型分页。
pagination/size
:::

## 隐藏当只有一页时

:::demo 使用 `hide-on-single-page` 属性隐藏单页分页器。
pagination/hide
:::

## API

### Pagination Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `v-model` | 当前页码 | `number` | `1` |
| `page-size` | 每页条数 | `number` | `10` |
| `total` | 总条数 | `number` | `0` |
| `pager-count` | 页码按钮数量 | `number` | `7` |
| `layout` | 组件布局 | `string` | `'prev, pager, next'` |
| `background` | 是否添加背景色 | `boolean` | `false` |
| `small` | 是否使用小型分页 | `boolean` | `false` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `prev-text` | 上一页按钮文字 | `string` | - |
| `next-text` | 下一页按钮文字 | `string` | - |
| `hide-on-single-page` | 只有一页时是否隐藏 | `boolean` | `false` |

### Pagination Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 页码变化时触发 | `(value: number)` |
| `change` | 页码变化时触发 | `(value: number, prev: number)` |

### Pagination Slots

| 插槽名 | 说明 |
| --- | --- |
| `prev` | 自定义上一页按钮内容 |
| `next` | 自定义下一页按钮内容 |
