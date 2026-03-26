---
title: Statistic 统计数值
description: 标题、前后缀、精度和自定义格式化的指标展示组件。
outline: deep
---

# Statistic 统计数值

`xy-statistic` 用来展示 KPI、金额、计数和 SLA 指标。实现思路参考了 Element Plus 的 `Statistic`，但默认样式按当前组件库更偏中后台的数据看板语境做了收敛，`precision` 也改成了更直觉的四舍五入。

## 基础指标

:::demo 最常见的用法是在概览卡片、状态面板和运营看板里展示一组核心指标。
statistic/basic
:::

## 格式化与插槽

:::demo 可以通过 `formatter`、分隔符和 `title / prefix / suffix` 插槽，把统计值接进更贴业务的 KPI 卡片。
statistic/formatter
:::

## 使用提示

- `formatter` 存在时会完全接管展示结果，内置的千分位、精度和分隔符不再生效。
- `precision` 会先向下取整到非负整数，再按四舍五入和补零规则格式化。
- `value` 为字符串、`NaN` 或 `Infinity` 时会按原值直出，适合展示 `N/A`、`--` 这类占位文本。
- `title / prefix / suffix` 同时支持 prop 和同名插槽，插槽优先级更高。

## API

### Statistic Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `value` | 统计值 | `number \| string` | `0` |
| `title` | 标题文案 | `string` | `''` |
| `prefix` | 前缀文案 | `string` | `''` |
| `suffix` | 后缀文案 | `string` | `''` |
| `precision` | 小数位数，按四舍五入处理 | `number` | `0` |
| `decimal-separator` | 小数分隔符 | `string` | `'.'` |
| `group-separator` | 千分位分隔符 | `string` | `','` |
| `formatter` | 自定义展示函数 | `(value: number \| string) => string \| number` | `undefined` |
| `value-style` | 数值区域样式 | `StyleValue` | `undefined` |

### Statistic Slots

| 插槽 | 说明 |
| --- | --- |
| `title` | 自定义标题区域 |
| `prefix` | 自定义前缀区域 |
| `suffix` | 自定义后缀区域 |

### Statistic Exposes

| 暴露项 | 说明 | 类型 |
| --- | --- | --- |
| `displayValue` | 当前实际展示文本 | `ComputedRef<string \| number>` |

### CSS Variables

| 变量名 | 说明 | 默认值 |
| --- | --- | --- |
| `--xy-statistic-gap` | 标题和数值之间的间距 | `10px` |
| `--xy-statistic-head-font-size` | 标题字号 | `13px` |
| `--xy-statistic-head-color` | 标题颜色 | `var(--xy-text-color-secondary)` |
| `--xy-statistic-number-font-size` | 数值字号 | `30px` |
| `--xy-statistic-number-font-weight` | 数值字重 | `700` |
| `--xy-statistic-number-color` | 数值颜色 | `var(--xy-text-color)` |
| `--xy-statistic-affix-font-size` | 前后缀字号 | `15px` |
| `--xy-statistic-affix-color` | 前后缀颜色 | `color-mix(in srgb, var(--xy-text-color-secondary) 86%, white)` |
| `--xy-statistic-affix-gap` | 前后缀和数值之间的间距 | `8px` |
