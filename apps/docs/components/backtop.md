---
title: Backtop 回到顶部
description: 固定在视口角落的回到顶部按钮，支持整页和局部滚动容器。
outline: deep
---

# Backtop 回到顶部

`xy-backtop` 用于在页面或局部滚动容器滚到一定距离后，显示一个回到顶部按钮。它的能力边界参考了 Element Plus 的 `Backtop`，保留了 `visibility-height`、`target`、`right`、`bottom` 和 `click` 事件。

## 基础与目标容器

:::demo 为了避免同页出现多个回顶按钮，这里通过模式切换展示“整页回顶”和“目标容器 + 自定义内容”两种场景，同一时间只挂载一个 `xy-backtop`。
backtop/modes
:::

## 何时使用

- 页面较长，希望用户不必反复手动滚回顶部。
- 抽屉、侧栏、规则面板等局部滚动区域需要单独提供“回到顶部”入口。
- 希望把回顶操作做成轻量悬浮按钮，而不是放进主工具栏。

## Backtop API

### Backtop Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `target` | 触发滚动监听的目标容器选择器 | `string` | `''` |
| `visibility-height` | 滚动高度达到该值后才显示按钮 | `number` | `200` |
| `right` | 距离视口右侧的偏移 | `number` | `40` |
| `bottom` | 距离视口底部的偏移 | `number` | `40` |

### Backtop Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `click` | 点击按钮时触发 | `(event: MouseEvent) => void` |

### Backtop Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 自定义按钮内容 |

## 行为约定

- `target` 只决定监听哪个滚动容器，以及点击后回滚哪个容器；按钮本身仍然固定在视口角落。
- 未传 `target` 时默认监听整页滚动。
- `target` 选择器不存在会直接抛出 `[XyBacktop] ...` 错误，避免在开发期静默失效。
