---
title: ProTable 场景示例
description: ProTable 的工具栏、搜索区和分页联动示例。
outline: deep
---

# ProTable 场景示例

## 基础列表页骨架

:::demo 标题、工具栏按钮、列 schema 和分页联动，是后台列表页最基础的一条主干。这里顺带演示了 `children` 与 `hidden` 列的组合。
pro/pro-table/basic
:::

## 组合 SearchForm 的后台闭环

:::demo 把 SearchForm 放进搜索区以后，列表页就具备了更完整的“筛选 -> 查询 -> 查看结果”闭环。
pro/pro-table/toolbar-search
:::

## 列表态优先级

:::demo loading 和 empty 的优先级是固定的，错误态仍然建议由页面层自己承接。
pro/pro-table/states
:::

## 显示协议

:::demo `valueType / formatter / render / renderHTML` 现在已经可以先在 `xy-pro-table` 列定义中落地，优先补齐后台列表的展示闭环。
pro/pro-table/display-value-types
:::
