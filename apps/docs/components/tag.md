---
title: Tag 标签
description: 轻量状态、分类标记和辅助信息组件。
outline: deep
---

# Tag 标签

`xy-tag` 用于展示轻量状态、分类标记或辅助信息。它不承担复杂交互，重点在于快速表达状态和归类。

## 基础状态

:::demo `status` 决定标签的语义色，适合放在列表状态列、筛选标签或信息块边缘。
tag/basic
:::

## 圆角与关闭

:::demo `round` 适合更柔和的展示语气，`closable` 则适合用于标签删除、筛选项移除这类轻交互。
tag/closable
:::

## 尺寸

:::demo Tag 在筛选栏、卡片摘要和嵌入式表单里经常需要跟随上下文切换尺寸。`sm / md / lg` 可以直接覆盖默认节奏。
tag/sizes
:::

## 圆角对比

:::demo 如果你希望标签更像“状态胶囊”而不是“短标签片”，优先打开 `round`。常规和圆角两组放在一起会更容易判断页面气质。
tag/rounded
:::

## 图标标签

:::demo Tag 支持前置 `icon` 属性和 `icon` 插槽。适合给状态、来源和提示信息补一个更快识别的视觉锚点。
tag/icon
:::

## 动态编辑

和 Element Plus 文档一样，`xy-tag` 也可以通过 `close` 事件配合 `xy-input`、`xy-button` 做出动态增删标签的交互。

:::demo 这种模式适合规则编辑、标签维护和筛选项管理，不需要额外的专用输入组件也能完成闭环。
tag/editable
:::

## API

### Tag Attributes

| 属性       | 说明              | 类型              | 默认值       |
| ---------- | ----------------- | ----------------- | ------------ |
| `status`   | 状态色            | `ComponentStatus` | `'neutral'`  |
| `size`     | 标签尺寸          | `ComponentSize`   | 跟随全局配置 |
| `round`    | 是否为圆角样式    | `boolean`         | `false`      |
| `closable` | 是否显示关闭按钮  | `boolean`         | `false`      |
| `icon`     | 前置 Iconify 图标 | `string`          | `''`         |

### Tag Events

| 事件    | 说明               | 参数         |
| ------- | ------------------ | ------------ |
| `close` | 点击关闭按钮时触发 | `MouseEvent` |

### Tag Slots

| 插槽      | 说明                                   |
| --------- | -------------------------------------- |
| `default` | 标签主内容                             |
| `icon`    | 自定义前置图标，优先级低于 `icon` prop |
