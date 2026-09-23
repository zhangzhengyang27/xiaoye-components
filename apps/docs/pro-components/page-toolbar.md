---
title: PageToolbar 页面工具栏
description: 页面级标题、动作区和扩展内容容器。
outline: deep
---

# PageToolbar 页面工具栏

`xy-page-toolbar` 统一承接列表页、详情页和运营面板顶部的标题、说明与动作区。

## 基础用法

:::demo 适合把标题、描述、按钮和筛选区收成一个稳定头部。
pro/page-toolbar/basic
:::

## PageToolbar API

### PageToolbar Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 工具栏标题 | `string` | `''` |
| `description` | 工具栏说明文案 | `string` | `''` |
| `divider` | 内容区与头部之间是否显示分隔线 | `boolean` | `false` |
| `sticky` | 是否吸顶 | `boolean` | `false` |
| `offset-top` | 吸顶时的顶部偏移量，仅 `sticky` 时生效 | `number` | `0` |
| `bordered` | 是否启用卡片化边框预设：整圈边框、容器底色与投影 | `boolean` | `false` |
| `style` | 自定义根节点样式 | `CSSProperties` | `undefined` |

### PageToolbar Slots

| 插槽 | 说明 | 接收参数 |
| --- | --- | --- |
| `title` | 自定义标题区，替换默认的 `title` 渲染 | - |
| `actions` | 右侧动作区，仅在提供了内容时渲染 | - |
| `default` | 工具栏下方的扩展内容，仅在提供了内容时渲染 | - |
