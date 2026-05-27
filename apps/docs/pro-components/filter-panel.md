---
title: FilterPanel 筛选面板
description: 把筛选区头部、折叠和动作区收成统一卡片。
outline: deep
---

# FilterPanel 筛选面板

`xy-filter-panel` 适合做页面左侧筛选区或顶部高级筛选区，让筛选头部、折叠和动作区保持一致。

## 基础用法

:::demo 它通常和 SearchForm 或业务自定义筛选项一起使用，形成可收起的筛选容器。
pro/filter-panel/basic
:::

## 当前定位

- 负责筛选区域的头部、折叠行为和动作区承载。
- 适合作为 SearchForm 之外的补充筛选容器。

## 当前边界

- 当前不内建字段 schema、查询派发和预设管理。
- 真正的查询行为和筛选协议仍由外层页面负责。
