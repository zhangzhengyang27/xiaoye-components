---
title: Countdown 倒计时
description: 复用 Statistic 外壳的目标时间倒计时组件。
outline: deep
---

# Countdown 倒计时

`xy-countdown` 复用了 `xy-statistic` 的标题、前后缀和数值骨架，用来展示发版窗口、活动结束时间、支付剩余时长等倒计时场景。实现拆分参考了 Element Plus：`Statistic` 负责外层展示，`Countdown` 负责时间计算和事件。

## 基础倒计时

:::demo 最常见的场景是状态面板里展示“距离某个截止时间还剩多久”。
countdown/basic
:::

## 格式串与事件

:::demo 通过 `format` 控制展示粒度，并通过 `change / finish` 接进业务状态更新。
countdown/format
:::

## 使用提示

- `value` 支持 `number`、`Date` 和 `dayjs()`；`number` 按时间戳毫秒处理。
- `format` 支持 `Y / M / D / H / m / s / S` 和中括号转义，例如 `DD [days] HH:mm:ss`。
- `change` 会在每一帧同步剩余毫秒数；如果业务只关心整秒变化，建议在接收端自行节流。
- 组件样式完全复用 `xy-statistic` 的 CSS 变量，只额外增加了根类名 `xy-countdown`。

## API

### Countdown Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `value` | 目标时间 | `number \| Date \| Dayjs` | `0` |
| `format` | 展示格式串 | `string` | `'HH:mm:ss'` |
| `title` | 标题文案 | `string` | `''` |
| `prefix` | 前缀文案 | `string` | `''` |
| `suffix` | 后缀文案 | `string` | `''` |
| `value-style` | 数值区域样式 | `StyleValue` | `undefined` |

### Countdown Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `change` | 每次倒计时更新时触发 | `(remainingMs: number)` |
| `finish` | 倒计时结束时触发 | `()` |

### Countdown Slots

| 插槽 | 说明 |
| --- | --- |
| `title` | 自定义标题区域 |
| `prefix` | 自定义前缀区域 |
| `suffix` | 自定义后缀区域 |

### Countdown Exposes

| 暴露项 | 说明 | 类型 |
| --- | --- | --- |
| `displayValue` | 当前展示文本 | `ComputedRef<string>` |
