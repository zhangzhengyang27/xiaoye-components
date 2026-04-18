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

## 扩展注册

:::demo 默认已经覆盖常见折线、柱状、极坐标、雷达、仪表盘和漏斗图；如果需要 `graphic` 这类默认未内置的组件，可以通过 `useChartsModules(...)` 继续补注册。
charts/extended-modules
:::

## 扩展注册：日历热力图

:::demo `calendar + heatmap + visualMap` 这类组合适合显式注册，既能保持默认集合轻量，也能让业务按需补齐高级模块。
charts/calendar-heatmap
:::

## 扩展注册：Timeline

:::demo `timeline` 常见于季度切换、阶段回放和历史快照，这类能力默认不内置，按需注册会更清晰。
charts/timeline-quarterly
:::

## 扩展注册：Sankey

:::demo `sankey` 适合承接流程流向和转化链路分析，示例演示只补图表模块本身即可工作。
charts/sankey-service-flow
:::

## 默认模块覆盖

:::demo `radar / gauge / funnel` 已经包含在默认预注册集合中，可以直接作为业务图表使用，不需要再额外调用注册 helper。
charts/radar-gauge-funnel
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
- 组件默认预注册了中后台常见图表模块，可直接承接 `line / bar / pie / scatter / radar / gauge / funnel`，以及 `polar` 坐标系和 `grid / tooltip / axisPointer / legend / title / dataset / dataZoom / toolbox` 等能力，不需要像纯 `echarts/core` 那样先手动补基础注册。
- 如果页面需要更冷门的图表或组件，可以从包根导出调用 `useChartsModules(...)` 继续补注册，使用方式与 `vue-echarts` 的 `use(...)` 类似。上面的 `graphic / calendar / visualMap / timeline / sankey` 示例就是推荐写法。
- `theme`、`initOptions` 变化时会重建图表实例；普通数据更新优先直接更新 `option`，或通过 expose 的 `setOption` 做局部重绘。
- `autoresize` 默认开启，适合放在自适应卡片、响应式网格和工作台概览布局中。
- 点击交互统一通过 `click` 事件抛出原始 ECharts 参数，方便接筛选、联动跳转和 drill down。

```ts
import { GraphicComponent } from "echarts/components"
import { useChartsModules } from "xiaoye-components"

useChartsModules([GraphicComponent])
```

## API

### Charts Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `option` | ECharts 配置对象 | `EChartsCoreOption` | — |
| `theme` | 图表主题名或主题对象 | `string \| object` | — |
| `width` | 容器宽度 | `string \| number` | `'100%'` |
| `height` | 容器高度 | `string \| number` | `360` |
| `init-options` | 初始化参数，会在创建实例时传给 `echarts.init` | `ChartsInitOptions` | — |
| `loading` | 是否显示加载态 | `boolean` | `false` |
| `loading-options` | 加载态配置 | `ChartsLoadingOptions` | — |
| `autoresize` | 是否自动监听容器尺寸变化并调用 `resize` | `boolean` | `true` |
| `set-option-options` | 更新配置时传给 `setOption` 的第二个参数 | `ChartsSetOptionOptions` | — |

### Charts Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `init` | 图表实例创建完成后触发 | `ChartsInstanceHandler` |
| `ready` | 图表实例可用后触发 | `ChartsInstanceHandler` |
| `click` | 图表元素点击时触发 | `ChartsClickHandler` |

### Charts Exposes

| 暴露项 | 说明 | 类型 |
| --- | --- | --- |
| `chart` | 当前图表实例引用 | `ChartsInstance["chart"]` |
| `resize` | 手动触发图表重排 | `ChartsInstance["resize"]` |
| `setOption` | 手动更新图表配置 | `ChartsInstance["setOption"]` |
| `showLoading` | 手动显示加载态 | `ChartsInstance["showLoading"]` |
| `hideLoading` | 手动隐藏加载态 | `ChartsInstance["hideLoading"]` |
