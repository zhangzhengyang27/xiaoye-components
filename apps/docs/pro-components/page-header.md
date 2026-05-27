---
title: PageHeader 页面头部
description: 页面级标题、描述、元信息与动作区容器。
outline: deep
---

# PageHeader 页面头部

`xy-page-header` 统一承接中后台页面的标题、说明、元信息和右侧动作区，不再把这些页面摘要区散落到每个页面模板里单独维护。

## 基础用法

:::demo 标题、描述、metaItems 和 actions 组合成一个稳定的页面头部。
pro/page-header/basic
:::

## PageHeader API

### PageHeader Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 页面标题 | `string` | `''` |
| `description` | 页面说明文案 | `string` | `''` |
| `meta-items` | 头部辅助信息列表 | `PageMetaItem[]` | `[]` |
| `divider` | 是否在头部底部显示分隔线 | `boolean` | `false` |
| `bordered` | 是否显示边框容器样式 | `boolean` | `false` |

### PageMetaItem

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `label` | 元信息标签 | `string` | — |
| `value` | 元信息值 | `string \| number` | — |
| `icon` | 元信息图标名，沿用 `XyIcon` 的字符串图标入口 | `string` | — |
| `className` | 元信息项根节点类名 | `string` | — |
| `labelClassName` | 标签区类名 | `string` | — |
| `valueClassName` | 值区类名 | `string` | — |

### PageHeader Slots

| 插槽 | 说明 |
| --- | --- |
| `title` | 自定义标题区域 |
| `actions` | 右侧动作区 |
| `meta` | 自定义元信息区 |
