---
title: Popover 气泡卡片
description: 用于承载轻量说明或交互内容，比 Tooltip 更重，比 Modal 更轻。
outline: deep
---

# Popover 气泡卡片

`xy-popover` 用来承载比 Tooltip 更重一点的说明或轻交互内容。它不是纯提示，也不需要像 Modal 那样阻断页面。

## 基础用法

:::demo 最常见的场景是放一段说明文案和一个轻量按钮，让用户在原地完成理解或确认。
popover/basic
:::

## 自定义头部与宽度

:::demo Popover 支持自定义触发区、头部和内容宽度，适合做一张轻量操作卡片。
popover/custom
:::

## 触发方式与内部关闭

:::demo `trigger`、`content` 和默认插槽暴露的 `close` 方法，适合做 hover 说明卡片或在卡片内部主动关闭。
popover/trigger-close
:::

## 嵌套浮层

:::demo 当轻量说明需要升级成阻断确认时，可以在 Popover 内把处理链路升级到 Modal。
popover/nested-overlay
:::

## Tooltip 和 Popover 的边界

- `Tooltip`：短文案、解释性提示、不承载操作。
- `Popover`：多段说明、轻量交互、外部点击和 `Escape` 可关闭。

## API

### Popover Attributes

| 属性               | 说明              | 类型               | 默认值     |
| ------------------ | ----------------- | ------------------ | ---------- |
| `model-value`      | 是否打开          | `boolean`          | `false`    |
| `title`            | 标题              | `string`           | `''`       |
| `content`          | 纯文本内容        | `string`           | `''`       |
| `placement`        | 浮层位置          | `Placement`        | `'bottom'` |
| `width`            | 面板宽度          | `string \| number` | `320`      |
| `close-on-outside` | 点击外部是否关闭  | `boolean`          | `true`     |
| `close-on-esc`     | `Escape` 是否关闭 | `boolean`          | `true`     |
| `disabled`         | 是否禁用          | `boolean`          | `false`    |
| `trigger`          | 触发方式          | `'click' \| 'hover' \| 'focus' \| 'manual'` | `'click'` |
| `open-delay`       | 打开延迟          | `number`           | `80`       |
| `close-delay`      | 关闭延迟          | `number`           | `60`       |
| `show-after`       | 打开延迟别名，优先级高于 `open-delay` | `number` | `undefined` |
| `hide-after`       | 关闭延迟别名，优先级高于 `close-delay` | `number` | `undefined` |
| `enterable`        | 浮层是否允许进入  | `boolean`          | `true`     |
| `offset`           | 浮层偏移量        | `number`           | `10`       |
| `show-arrow`       | 是否显示箭头      | `boolean`          | `true`     |
| `teleported`       | 是否通过 Teleport 挂载到外层容器 | `boolean` | `true` |
| `append-to`        | Teleport 的挂载目标 | `string \| HTMLElement` | `'body'` |
| `persistent`       | 关闭后是否保留 DOM | `boolean` | `false` |
| `popper-class`     | 浮层容器自定义类名 | `string` | `''` |
| `popper-style`     | 浮层容器自定义样式 | `StyleValue` | `undefined` |

### Popover Events

| 事件                 | 说明         | 参数      |
| -------------------- | ------------ | --------- |
| `update:model-value` | 开关状态变化 | `boolean` |
| `open`               | 打开时触发   | —         |
| `close`              | 关闭时触发   | —         |

### Popover Slots

| 插槽        | 说明         |
| ----------- | ------------ |
| `reference` | 推荐的触发区域插槽 |
| `trigger`   | 兼容的触发区域插槽 |
| `header`    | 自定义头部   |
| `default`   | 面板主体内容，插槽参数为 `{ close }` |
