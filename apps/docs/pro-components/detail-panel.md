---
title: DetailPanel 详情面板
description: 统一抽屉与弹窗详情查看的只读面板模型。
outline: deep
---

# DetailPanel 详情面板

`xy-detail-panel` 用来统一表达“在覆盖层中查看详情”的能力，通过 `container="drawer" | "dialog"` 收口侧边详情和弹窗详情两种查看容器。

## 详情查看场景

:::demo 这个场景把“侧边详情”和“居中详情”放在同一套详情面板模型下理解，核心是只读查看、历史说明和上下文保留。
pro/detail-panel/containers
:::

## 当前定位

- 统一表达详情查看面板，不再让使用方在选型阶段先纠结抽屉还是弹窗。
- 适合列表查看、审批复核、任务详情、日志回溯等只读链路。
- 在收口后的公开体系里，它是 `DetailPage` 的近邻能力，而不是一组碎片化详情小组件的集合。

## 当前边界

- 更复杂的详情区块能力，继续建议通过 `DetailPage + AuditTimeline` 这种页面级组合承接。

## DetailPanel API

### DetailPanel Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `open` | 是否打开 | `boolean` | `false` |
| `container` | 容器类型 | `'drawer' \| 'dialog'` | `'drawer'` |
| `title` | 标题 | `string` | `'详情信息'` |
| `description` | 说明文案 | `string` | `''` |
| `loading` | 是否显示加载态 | `boolean` | `false` |
| `drawer-props` | 透传给抽屉容器的属性 | `Partial<DrawerProps>` | `{}` |
| `dialog-props` | 透传给弹窗容器的属性 | `Partial<DialogProps>` | `{}` |

### DetailPanel Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:open` | 打开状态变化时派发 | `(value: boolean) => void` |
| `closed` | 面板完全关闭后派发 | `() => void` |

### DetailPanel Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 主内容区 |
| `description` | 头部说明区 |
| `meta` | 头部右侧元信息，仅抽屉容器生效 |
| `timeline` | 历史记录区 |
| `actions` | 底部动作区 |
