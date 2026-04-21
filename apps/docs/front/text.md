---
title: Text 文本
description: 文本组件，用于内联文本的样式控制。
outline: deep
---

# Text 文本

`xyu-text` 组件用于内联文本的样式控制，支持多种排版样式和颜色类型。

## 基础用法

:::demo 使用 `type` 定义文本颜色类型。
text/basic
:::

## 尺寸

:::demo 使用 `size` 属性设置文本尺寸。
text/size
:::

## 文本样式

:::demo 使用 `strong`、`italic`、`underline`、`delete`、`mark` 设置文本样式。
text/style
:::

## 文本截断

:::demo 使用 `lineClamp` 或 `ellipsis` 实现文本截断。
text/ellipsis
:::

## 自定义标签

:::demo 使用 `tag` 属性渲染为不同的 HTML 标签。
text/tag
:::

## API

### Text Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `tag` | 自定义渲染标签 | `string` | `'span'` |
| `size` | 文本尺寸 | `'xs' \| 'sm' \| 'base' \| 'lg' \| 'xl'` | `'base'` |
| `type` | 颜色类型 | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'primary'` |
| `strong` | 是否加粗 | `boolean` | `false` |
| `italic` | 是否斜体 | `boolean` | `false` |
| `underline` | 是否下划线 | `boolean` | `false` |
| `delete` | 是否删除线 | `boolean` | `false` |
| `mark` | 是否高亮 | `boolean` | `false` |
| `lineClamp` | 超过指定行数截断 | `number` | `0` |
| `ellipsis` | 是否单行省略 | `boolean` | `false` |
| `ellipsisLineClamp` | 超过指定行数省略 | `number` | `1` |
