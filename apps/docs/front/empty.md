---
title: Empty 空状态
description: 空状态组件，用于展示无数据时的占位。
outline: deep
---

# Empty 空状态

`xyu-empty` 是前台组件库的空状态组件，用于展示无数据时的占位内容。

## 基础用法

:::demo 基础空状态用法。
empty/basic
:::

## 自定义图片

:::demo 使用 `image` 属性自定义图片。
empty/image
:::

## 自定义描述

:::demo 使用 `description` 属性自定义描述文字。
empty/description
:::

## 尺寸

:::demo 使用 `size` 属性设置空状态尺寸。
empty/size
:::

## 自定义插槽

:::demo 使用默认插槽添加操作按钮。
empty/action
:::

## API

### Empty Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `description` | 描述文字 | `string` | `'暂无数据'` |
| `image` | 自定义图片地址 | `string` | - |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |

### Empty Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 自定义操作区内容 |
| `image` | 自定义图片内容 |
