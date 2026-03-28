---
title: CollapseTransition 折叠过渡
description: 为可展开内容提供平滑的高度过渡效果。
outline: deep
---

# CollapseTransition 折叠过渡

`xy-collapse-transition` 是一个轻量的过渡包装器，适合给筛选项、补充说明、侧边配置区这类“按需展开”的内容增加平滑的高度动画。

## 基础用法

:::demo 最常见的场景是用一个按钮控制说明区显隐，让内容在展开和收起时保持顺滑。
collapse-transition/basic
:::

## 卡片内容折叠

:::demo 当内容块本身有边框、背景和内边距时，也可以直接把内容区域包在 `xy-collapse-transition` 里。
collapse-transition/panel
:::

## API

### CollapseTransition Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 需要执行折叠过渡的内容 |

### 使用说明

- `xy-collapse-transition` 自身不维护展开状态，通常与 `v-if`、`v-show` 或外层布尔状态一起使用。
- 组件会根据内容高度自动计算 `max-height`，适合处理高度不固定的内容块。
- 如果内容区域本身有外边距，建议把外边距移动到内部容器，避免动画开始和结束时出现跳动。
