---
title: Skeleton 骨架屏
description: 用于承接列表、卡片和详情块在加载过程中的占位反馈。
outline: deep
---

# Skeleton 骨架屏

`xy-skeleton` 用于承接“结构已知、内容未到”的加载占位。它参考了 `element-plus` 的 `Skeleton` 方案，适合列表页、卡片区和详情块这类中后台场景。

## 基础骨架

:::demo 最简单的用法是直接渲染默认骨架模板，让页面先把版式站稳，再等待真实数据回填。
skeleton/basic
:::

## 状态切换与模板

:::demo 页面层通常会用 `loading` 控制骨架和真实内容切换；当默认骨架不够贴合页面结构时，再用 `template` 自定义占位布局。
skeleton/template-switch
:::

## 状态衔接

:::demo 真实页面里，Skeleton 往往不是终点。接口返回后，常见的下一个状态是“真实内容 / 空结果 / 失败反馈”三者之一。
skeleton/loading-result
:::

## 动画与重复行数

:::demo `animated` 适合强调“正在加载中”，`rows` 和 `count` 则更适合批量列表或多块卡片一起占位。
skeleton/animated-rows
:::

## 变体组合

:::demo `xy-skeleton-item` 适合手动拼装头像、标题、段落、图片和按钮区域，让骨架结构更贴近真实界面。
skeleton/variants
:::

## 何时使用

- 列表页、控制台概览、详情抽屉等已知结构但未知内容的加载过程。
- 需要让页面先稳定布局，避免数据返回前大面积闪动。
- 希望用户一眼看出“这里会加载出什么结构”，而不是只看到一个通用 loading 图标。

## 接入建议

- 页面层维护真实 `loading` 状态，Skeleton 只负责承接占位反馈，不承担请求逻辑。
- 结构简单时优先用默认模板；只有当页面骨架明显异于默认段落结构时，再上 `template` 或 `xy-skeleton-item`。

## API

### Skeleton Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `animated` | 是否启用骨架动画 | `boolean` | `false` |
| `count` | 重复渲染多少组骨架模板 | `number` | `1` |
| `rows` | 默认模板下的段落行数 | `number` | `3` |
| `loading` | 是否展示骨架，占位结束后渲染默认插槽 | `boolean` | `true` |
| `throttle` | 骨架切换节流配置，支持数字或对象写法 | `number \| { leading?: number; trailing?: number; initVal?: boolean }` | `0` |

### Skeleton Slots

| 插槽 | 说明 |
| --- | --- |
| `template` | 自定义骨架模板；当你已经知道页面结构时，用它替换默认段落骨架 |
| `default` | `loading = false` 时渲染真实内容 |

### Skeleton Exposes

| 暴露项 | 说明 | 类型 |
| --- | --- | --- |
| `uiLoading` | 节流后的最终加载态 | `Ref<boolean>` |

### SkeletonItem Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `variant` | 骨架单元类型 | `'circle' \| 'rect' \| 'h1' \| 'h3' \| 'text' \| 'caption' \| 'p' \| 'image' \| 'button'` | `'text'` |
