---
title: Tabs 标签页
description: 页面分区、局部导航和视图切换的基础页签组件。
outline: deep
---

# Tabs 标签页

`xy-tabs` 适合做页面分区、局部导航和视图切换。当前版本强调键盘可达性、禁用项跳过和插槽化面板内容。

## 基础用法

:::demo 最常见的用法是传一组 `items`，再通过默认插槽渲染当前激活面板内容。
tabs/basic
:::

## 禁用页签

:::demo 禁用页签会被键盘导航自动跳过，适合放“暂未开放”或当前不可切换的面板。
tabs/disabled
:::

## API

### Tabs Attributes

| 属性          | 说明         | 类型        | 默认值       |
| ------------- | ------------ | ----------- | ------------ |
| `model-value` | 当前激活项   | `string`    | 首个可用项   |
| `items`       | 页签项配置   | `TabItem[]` | `[]`         |

### TabItem

| 字段       | 说明       | 类型      | 默认值  |
| ---------- | ---------- | --------- | ------- |
| `key`      | 唯一标识   | `string`  | —       |
| `label`    | 展示文案   | `string`  | —       |
| `disabled` | 是否禁用   | `boolean` | `false` |

### Tabs Events

| 事件                 | 说明           | 参数       |
| -------------------- | -------------- | ---------- |
| `update:model-value` | 激活项变化     | `string`   |
| `change`             | 切换页签时触发 | `string`   |

### Tabs Slots

| 插槽      | 说明                                          |
| --------- | --------------------------------------------- |
| `default` | 面板内容，暴露 `activeKey` 与 `activeItem`    |
