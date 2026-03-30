---
title: Charts 图表
description: 基于 ECharts 的统一图表容器。
outline: deep
---

# Charts 图表

`xy-charts` 用来承接仪表盘、趋势、分布和概览类图表。当前对外统一收口为一个稳定主入口，不再暴露多套图表组件别名。

## 基础用法

:::demo 适合快速承接折线、柱状和饼图等常见中后台图表场景。
charts/basic
:::

## 组合图表

:::demo 同一个容器里可以直接承接柱状、折线和双坐标轴组合，不需要再额外切组件入口。
charts/combo
:::

## 交互与动态更新

:::demo `loading`、`click` 和 expose 的 `setOption` 适合接入异步报表或钻取类看板。
charts/interactive
:::

## 仪表盘工作台

:::demo 图表通常不会单独存在，而是放在统计卡片、筛选动作和概览卡片之间，这个示例更接近真实后台工作台布局。
charts/dashboard-board
:::

## 与增强层组合

:::demo 当页面已经进入中后台壳层时，更常见的接法是把 Charts 放进 `PageContainer` 的主体区，而不是独立铺一张图。
charts/page-analysis
:::

## 与 PageContainer 组合

:::demo 当图表进入正式后台页时，通常由 `PageContainer` 负责页面头部、动作区和 footer，`Charts` 只承接图表内容本身。
charts/page-container-analytics
:::

## 使用约定

- `xy-charts` 只负责 ECharts 实例生命周期、尺寸同步和加载态联动，不内置数据请求协议。
- `theme`、`initOptions` 变化时会重建图表实例；普通数据更新优先直接更新 `option`，或通过 expose 的 `setOption` 做局部重绘。
- `autoresize` 默认开启，适合放在自适应卡片、响应式网格和工作台概览布局中。
- 点击交互统一通过 `click` 事件抛出原始 ECharts 参数，方便接筛选、联动跳转和 drill down。

## API

### Charts Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `option` | ECharts 配置对象 | `EChartsCoreOption` | — |
| `theme` | 图表主题名或主题对象 | `string \| object` | — |
| `width` | 容器宽度 | `string \| number` | `'100%'` |
| `height` | 容器高度 | `string \| number` | `360` |
| `init-options` | 初始化参数，会在创建实例时传给 `echarts.init` | `Record<string, unknown>` | — |
| `loading` | 是否显示加载态 | `boolean` | `false` |
| `loading-options` | 加载态配置 | `Record<string, unknown>` | — |
| `autoresize` | 是否自动监听容器尺寸变化并调用 `resize` | `boolean` | `true` |
| `set-option-options` | 更新配置时传给 `setOption` 的第二个参数 | `Record<string, unknown>` | — |

### Charts Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `init` | 图表实例创建完成后触发 | `(chart) => void` |
| `ready` | 图表实例可用后触发 | `(chart) => void` |
| `click` | 图表元素点击时触发 | `(params) => void` |

### Charts Exposes

| 暴露项 | 说明 | 类型 |
| --- | --- | --- |
| `chart` | 当前图表实例引用 | `unknown \| null` |
| `resize` | 手动触发图表重排 | `() => void` |
| `setOption` | 手动更新图表配置 | `(option, setOptionOptions?) => void` |
| `showLoading` | 手动显示加载态 | `(loadingOptions?) => void` |
| `hideLoading` | 手动隐藏加载态 | `() => void` |
