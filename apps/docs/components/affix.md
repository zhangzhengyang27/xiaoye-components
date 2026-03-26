---
title: Affix 固钉
description: 将内容固定在视口顶部或底部，并可限制在指定容器范围内。
outline: deep
---

# Affix 固钉

`xy-affix` 用于把按钮、筛选摘要、操作卡片这类“小块但需要跟随可见区域”的内容固定在页面顶部或底部。首版实现参考了 Element Plus 的 `Affix`，并补齐了 `teleported`、`append-to`、`change / scroll` 和 `update / updateRoot`。

## 基础偏移

:::demo 默认吸附在顶部，可通过 `offset` 控制与视口顶部的距离。
affix/basic
:::

## 目标容器

:::demo 设置 `target` 后，固钉内容会被限制在容器范围内，超出边界时自动退出固定态。
affix/target
:::

## 底部固钉

:::demo `position='bottom'` 适合承接移动操作条、批量操作按钮和总结算入口。
affix/fixed
:::

## 传送与手动刷新

:::demo `teleported` 会在固定态时把节点挂到 `append-to` 指定容器，内容尺寸变化后可调用 `updateRoot()` 重新同步占位尺寸。
affix/teleported
:::

## 何时使用

- 需要让关键操作或摘要信息在滚动过程中持续可见。
- 需要把固定内容限制在某个局部区域内，而不是整页一直显示。
- 需要在内容尺寸变化后手动刷新固定占位，避免布局跳动。

## Affix API

### Affix Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `offset` | 与顶部或底部的偏移距离，单位 px | `number` | `0` |
| `position` | 固定位置 | `'top' \| 'bottom'` | `'top'` |
| `target` | 目标容器选择器 | `string` | `''` |
| `z-index` | 固定节点层级 | `number \| string` | `100` |
| `teleported` | 固定态时是否通过 Teleport 挂载到外部容器 | `boolean` | `false` |
| `append-to` | Teleport 的挂载目标 | `string \| HTMLElement` | `'body'` |

### Affix Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `change` | 固定状态变化时触发 | `(fixed: boolean) => void` |
| `scroll` | 监听到滚动后触发 | `({ scrollTop: number, fixed: boolean }) => void` |

### Affix Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 固钉内容 |

### Affix Exposes

| 暴露项 | 说明 | 类型 |
| --- | --- | --- |
| `update` | 立即重新计算固钉状态 | `() => void` |
| `updateRoot` | 重新测量占位尺寸并刷新固钉状态 | `() => Promise<void> \| void` |

## 行为约定

- `target` 容器首版不支持自身再带滚动条，推荐把它作为普通边界容器使用。
- `teleported=false` 时，固定节点保留在原位置切换为 `position: fixed`；`teleported=true` 时，仅固定态节点会被传送到 `append-to`。
- `target` 选择器不存在会直接抛出 `[XyAffix] ...` 错误，便于在开发期尽快发现接入问题。
