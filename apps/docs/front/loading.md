---
title: Loading 加载
description: 加载组件，用于展示加载状态。
outline: deep
---

# Loading 加载

`xyu-loading` 是前台组件库的加载组件，用于展示加载状态。

## 基础用法

:::demo 基础加载用法。
loading/basic
:::

## 加载类型

:::demo 使用 `type` 属性设置加载类型。
loading/type
:::

## 加载尺寸

:::demo 使用 `size` 属性设置加载尺寸。
loading/size
:::

## 全屏加载

:::demo 使用 `fullscreen` 属性显示全屏加载。
loading/fullscreen
:::

## 自定义颜色

:::demo 使用 `color` 属性自定义加载颜色。
loading/color
:::

## 自定义文字

:::demo 使用 `text` 属性添加加载文字。
loading/text
:::

## API

### Loading Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `type` | 加载类型 | `'spinner' \| 'dot' \| 'ring' \| 'wave'` | `'ring'` |
| `size` | 加载尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `color` | 加载颜色 | `string` | - |
| `text` | 加载文字 | `string` | - |
| `fullscreen` | 是否全屏显示 | `boolean` | `false` |
