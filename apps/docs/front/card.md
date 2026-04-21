---
title: Card 卡片
description: 卡片组件，用于组织和展示内容。
outline: deep
---

# Card 卡片

`xyu-card` 是前台组件库的卡片组件，用于组织和展示相关内容。

## 基础用法

:::demo 基础卡片用法。
card/basic
:::

## 卡片类型

:::demo 使用 `type` 属性设置卡片类型。
card/type
:::

## 可悬停

:::demo 使用 `hoverable` 属性添加悬停效果。
card/hoverable
:::

## 自定义头部和底部

:::demo 使用 `header` 和 `footer` 插槽自定义卡片内容。
card/slots
:::

## 图片卡片

:::demo 使用 `cover` 插槽添加封面图片。
card/image
:::

## API

### Card Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `type` | 卡片类型 | `'default' \| 'bordered' \| 'shadow' \| 'flat'` | `'default'` |
| `bordered` | 是否显示边框 | `boolean` | `true` |
| `hoverable` | 是否添加悬停效果 | `boolean` | `false` |
| `loading` | 是否显示加载状态 | `boolean` | `false` |
| `title` | 卡片标题 | `string` | - |
| `sub-title` | 副标题 | `string` | - |
| `header-style` | 头部自定义样式 | `CSSProperties` | - |
| `body-style` | 内容区自定义样式 | `CSSProperties` | - |

### Card Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `click` | 点击卡片时触发 | `(event: MouseEvent)` |

### Card Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 卡片内容 |
| `header` | 自定义头部内容 |
| `footer` | 自定义底部内容 |
| `cover` | 封面图片 |
