---
title: 反馈与数据展示
description: Tooltip、Popover、Dropdown、Empty、Table、Pagination 在列表页中的常见用法。
outline: deep
---

# 反馈与数据展示

这页把后台列表页最常见的“查看和反馈”路径串起来：先给提示和空态，再进入表格与分页的组合方式。

:::tip 单组件页
如果你需要查 `row-key`、动态插槽名或更完整的浮层能力，优先看 [Table 表格](/components/table)、[Tooltip 文字提示](/components/tooltip)、[Popover 气泡卡片](/components/popover)。
:::

## 轻提示与说明

:::demo Tooltip 适合一句话解释，Popover 适合更完整的说明或轻交互。两者最重要的差别，不是样式，而是信息密度。
feedback-data/tooltip-popover
:::

## 行操作与空状态

:::demo Dropdown 负责收纳操作菜单，Empty 负责兜底空结果。它们都服务于“列表页怎么不乱”这个问题。
feedback-data/dropdown-empty
:::

## 列表页主干

:::demo 后台列表页里最常见的需求不是“渲染一张表”，而是“表格需要跟加载态、空态、行选中和分页联动”。
feedback-data/list-page
:::

## 场景建议

- `Tooltip + Popover` 适合表头提示、按钮说明和轻量帮助。
- `Dropdown + Empty` 适合列表行操作和筛选无结果场景。
- `Table + Pagination` 适合大多数后台列表页主干。

## 推荐阅读顺序

1. 先看 [Tooltip 文字提示](/components/tooltip)、[Popover 气泡卡片](/components/popover)，明确轻提示和轻交互的边界。
2. 再看 [Dropdown 下拉菜单](/components/dropdown)、[Empty 空状态](/components/empty)。
3. 最后看 [Table 表格](/components/table)、[Pagination 分页](/components/pagination)，把数据页主干串起来。

<style>
.doc-row-active td {
  background: color-mix(in srgb, var(--xy-color-primary) 10%, white);
}
</style>
