---
title: Tag 标签
description: 标签组件，用于标记和分类。
outline: deep
---

# Tag 标签

`xyu-tag` 是前台组件库的标签组件，用于信息标记和分类。

## 基础用法

:::demo 使用 `type` 定义标签类型。
tag/basic
:::

## 尺寸

:::demo 使用 `size` 属性设置标签尺寸。
tag/size
:::

## 圆角标签

:::demo 使用 `round` 属性创建圆角标签。
tag/round
:::

## 可关闭标签

:::demo 使用 `closable` 属性添加关闭按钮。
tag/closable
:::

## API

### Tag Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `type` | 标签类型 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'default'` |
| `size` | 标签尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `round` | 是否圆角 | `boolean` | `false` |
| `closable` | 是否可关闭 | `boolean` | `false` |

### Tag Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `close` | 点击关闭按钮时触发 | `(event: MouseEvent)` |
