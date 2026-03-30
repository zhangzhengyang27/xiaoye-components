---
title: PageContainer 页面容器
description: 页面头部、主体内容与底部区的统一承载容器。
outline: deep
---

# PageContainer 页面容器

`xy-page-container` 用来统一承接中后台页面头部、正文区和 footer 区，让列表页、详情页和运营面板都能共享同一套页面壳层语义。

## 默认头部

:::demo 未提供 `header` 插槽时，只要传入标题、说明、元信息或动作区，就会自动生成 `PageHeader`。
pro/page-container/basic
:::

## 自定义头部与加载态

:::demo 传入 `header` 插槽后由插槽完全接管头部，同时保留 `loading`、body 区和 footer 区的统一结构。
pro/page-container/custom
:::

## PageContainer API

### PageContainer Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 页面标题 | `string` | `''` |
| `description` | 页面说明文案 | `string` | `''` |
| `meta-items` | 页面元信息列表 | `PageMetaItem[]` | `[]` |
| `divider` | 默认头部是否显示分隔线 | `boolean` | `false` |
| `bordered` | 是否显示边框容器样式 | `boolean` | `true` |
| `loading` | 是否显示统一 loading 视觉 | `boolean` | `false` |
| `shadow` | 是否显示阴影容器样式 | `boolean` | `false` |
| `body-class` | body 区额外类名 | `string` | `''` |
| `body-style` | body 区内联样式 | `CSSProperties` | — |

### PageContainer Slots

| 插槽 | 说明 |
| --- | --- |
| `header` | 自定义头部，提供后完全覆盖默认头部 |
| `actions` | 默认头部右侧动作区 |
| `extra` | 默认头部右侧扩展区，未提供 `actions` 时作为兜底动作区 |
| `meta` | 默认头部元信息区 |
| `default` | 页面主体内容 |
| `footer` | 页面底部区 |
