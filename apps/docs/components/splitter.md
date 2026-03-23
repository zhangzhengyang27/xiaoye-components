---
title: Splitter 分隔面板
description: 用拖拽分隔条组织双栏或上下布局的基础分区组件。
outline: deep
---

# Splitter 分隔面板

`xy-splitter` 用来组织左右分栏、上下日志区、筛选栏加结果区这类需要连续调宽调高的页面骨架。它由 `xy-splitter` 和 `xy-splitter-panel` 两个组件组成。

## 基础用法

:::demo 最常见的场景是左侧导航或筛选区，右侧承载主列表和详情摘要。
splitter/basic
:::

## 纵向布局

:::demo 把 `layout` 改成 `vertical` 后，就可以搭建上下分区的监控台、终端或预览器。
splitter/vertical
:::

## 折叠与延迟提交

:::demo `xy-splitter-panel` 支持 `v-model:size` 同步当前像素尺寸，配合 `collapsible` 和 `lazy` 可以做更接近桌面应用的交互。
splitter/collapsible
:::

## API

### Splitter Attributes

| 属性     | 说明                                 | 类型                             | 默认值         |
| -------- | ------------------------------------ | -------------------------------- | -------------- |
| `layout` | 面板排列方向                         | `'horizontal' \| 'vertical'`     | `'horizontal'` |
| `lazy`   | 是否在拖拽结束后再提交最终尺寸       | `boolean`                        | `false`        |

### Splitter Events

| 事件            | 说明               | 参数                                  |
| --------------- | ------------------ | ------------------------------------- |
| `resize-start`  | 开始拖拽时触发     | `(index: number, sizes: number[])`    |
| `resize`        | 拖拽过程中触发     | `(index: number, sizes: number[])`    |
| `resize-end`    | 拖拽结束后触发     | `(index: number, sizes: number[])`    |
| `collapse`      | 折叠或恢复面板时触发 | `(index: number, direction: 'start' \| 'end', sizes: number[])` |

### SplitterPanel Attributes

| 属性          | 说明                                           | 类型                   | 默认值  |
| ------------- | ---------------------------------------------- | ---------------------- | ------- |
| `size`        | 初始尺寸或受控尺寸，支持数字、`px`、百分比     | `number \| string`     | —       |
| `min`         | 最小尺寸，支持数字、`px`、百分比               | `number \| string`     | `0`     |
| `max`         | 最大尺寸，支持数字、`px`、百分比               | `number \| string`     | —       |
| `resizable`   | 是否允许通过分隔条调整尺寸                     | `boolean`              | `true`  |
| `collapsible` | 是否允许通过分隔条快捷折叠当前面板             | `boolean`              | `false` |

### SplitterPanel Events

| 事件          | 说明                     | 参数       |
| ------------- | ------------------------ | ---------- |
| `update:size` | 当前面板尺寸变化时触发   | `number`   |

### Splitter Slots

| 插槽      | 说明             |
| --------- | ---------------- |
| `default` | 放置若干 `xy-splitter-panel` |

### SplitterPanel Slots

| 插槽      | 说明       |
| --------- | ---------- |
| `default` | 面板内容区 |
