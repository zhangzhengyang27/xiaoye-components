---
title: Image 图片
description: 图片组件，支持预览和加载状态。
outline: deep
---

# Image 图片

`xyu-image` 是前台组件库的图片组件，支持懒加载、预览和加载状态。

## 基础用法

:::demo 基础图片用法。
image/basic
:::

## 占位符

:::demo 图片加载中或失败时显示占位符。
image/placeholder
:::

## 懒加载

:::demo 使用 `lazy` 属性开启懒加载。
image/lazy
:::

## 图片预览

:::demo 使用 `preview` 属性开启图片预览。
image/preview
:::

## 填充模式

:::demo 使用 `fit` 属性设置图片填充方式。
image/fit
:::

## API

### Image Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `src` | 图片地址 | `string` | - |
| `alt` | 图片 alt 文本 | `string` | - |
| `fit` | 图片填充方式 | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'cover'` |
| `width` | 图片宽度 | `string \| number` | - |
| `height` | 图片高度 | `string \| number` | - |
| `lazy` | 是否懒加载 | `boolean` | `false` |
| `preview` | 是否开启预览 | `boolean` | `false` |
| `preview-src-list` | 预览图片列表 | `string[]` | `[]` |
| `z-index` | 预览层 z-index | `number` | `2000` |
