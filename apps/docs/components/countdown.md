---
title: Countdown 倒计时
description: 复用 Statistic 外壳的目标时间倒计时组件。
outline: deep
---

# Countdown 倒计时

`xy-countdown` 复用了 `xy-statistic` 的标题、前后缀和数值骨架，用来展示发版窗口、活动结束时间、支付剩余时长等倒计时场景。`Statistic` 负责外层展示，`Countdown` 负责时间计算和事件。

## 基础倒计时

:::demo 最常见的场景是状态面板里展示“距离某个截止时间还剩多久”。
countdown/basic
:::

## 格式串与事件

:::demo 通过 `format` 控制展示粒度，并通过 `change / finish` 接进业务状态更新。
countdown/format
:::

## 订单保留时间

:::demo 在订单中心、客服催付和大促履约后台里，更常见的是把倒计时嵌进列表行或任务卡片，直接表达“超时后会发生什么”。
countdown/payment-window
:::

## SLA 升级看板

:::demo `change / finish` 很适合拿来驱动工单、告警和审批任务的 SLA 状态切换，让剩余时间直接映射到风险等级。
countdown/sla-board
:::

## 营销场次排期

:::demo 大促作战室里经常会同时盯多个场次的开场时间。这个场景更适合把 `title / prefix / suffix` 插槽和 `value-style` 一起用起来。
countdown/campaign-waves
:::

## 发布冻结窗口

:::demo 当倒计时本身会推动业务阶段切换时，可以把 `finish` 作为状态机触发点，让一个组件承接“即将冻结 -> 冻结中 -> 已恢复”的完整链路。
countdown/change-freeze
:::

## 审批截止面板

:::demo 如果倒计时结束后需要马上进入下一步结果态，可以把 `Countdown` 和 `Result`、按钮区放进同一块审批面板里，直接表达“超时后会发生什么”。
countdown/approval-deadline
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
