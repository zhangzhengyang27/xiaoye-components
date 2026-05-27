---
title: StatCard 指标卡片
description: 承接数字指标、说明、趋势和加载态的轻量卡片。
outline: deep
---

# StatCard 指标卡片

`xy-stat-card` 用于统一后台首页、列表页和运营看板里的关键指标展示。它只承接数值、说明、趋势和图标，不额外引入异步协议或图表布局心智。

## 基础用法

:::demo 用同一套指标卡片表达上升、下降、持平和加载中的指标状态。
pro/stat-card/basic
:::

## StatCard API

### StatCard Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 指标标题 | `string` | `''` |
| `value` | 指标值 | `string \| number` | `''` |
| `description` | 辅助说明文案 | `string` | `''` |
| `icon` | 指标图标名 | `string` | `''` |
| `trend` | 趋势类型，仅影响趋势区图标与强调色 | `'up' \| 'down' \| 'flat'` | `'flat'` |
| `trend-text` | 趋势说明文案 | `string` | `''` |
| `loading` | 是否显示骨架占位 | `boolean` | `false` |
