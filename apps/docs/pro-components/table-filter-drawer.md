---
title: TableFilterDrawer 表格筛选抽屉
description: 用抽屉承接列表的高级筛选项和应用重置动作。
outline: deep
---

# TableFilterDrawer 表格筛选抽屉

`xy-table-filter-drawer` 适合在列表页收纳不常用但复杂的筛选条件，让主筛选栏保持简洁。

## 基础用法

:::demo 常见做法是把高频筛选放在 SearchForm，把次级条件收进这个筛选抽屉里。
pro/table-filter-drawer/basic
:::

## 当前定位

- 负责高级筛选抽屉的容器、字段承载和应用重置出口。
- 适合与 SearchForm、ProTable 配合形成主次筛选闭环。

## 当前边界

- 当前不处理筛选字段的远程配置和条件持久化。
- 真正的筛选协议和表格刷新仍由页面层接管。
