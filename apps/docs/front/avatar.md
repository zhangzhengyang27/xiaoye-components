---
title: Avatar 头像
description: 头像组件，用于展示用户头像。
outline: deep
---

# Avatar 头像

`xyu-avatar` 是前台组件库的头像组件，支持图片和文字两种展示方式。

## 基础用法

:::demo 使用 `src` 传入图片地址。
avatar/basic
:::

## 头像尺寸

:::demo 使用 `size` 属性设置头像尺寸。
avatar/size
:::

## 头像形状

:::demo 使用 `shape` 属性设置头像形状。
avatar/shape
:::

## 头像组

:::demo 组合使用多个头像。
avatar/group
:::

## 占位符

:::demo 图片加载失败时显示占位符。
avatar/fallback
:::

## API

### Avatar Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `src` | 图片地址 | `string` | - |
| `alt` | 图片 alt 文本 | `string` | `'avatar'` |
| `size` | 头像尺寸 | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| number` | `'md'` |
| `shape` | 头像形状 | `'circle' \| 'square'` | `'circle'` |
| `fit` | 图片填充方式 | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'cover'` |
| `initials` | 当无图片时显示的文字 | `string` | - |
