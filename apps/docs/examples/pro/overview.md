---
title: 增强组件示例总览
description: 后台闭环增强组件的场景示例入口。
outline: deep
---

# 增强组件示例总览

这里的示例不再追求“每个局部壳子一个 basic.vue”，而是优先展示收口后的公开体系如何落回真实后台页面链路。

## 列表主干

- [SearchForm 场景示例](/examples/pro/search-form)
- [ProTable 场景示例](/examples/pro/pro-table)
- [ListPage 场景示例](/examples/pro/list-page)
- [ColumnSettingPanel 场景示例](/examples/pro/column-setting-panel)
- [SavedViewTabs 场景示例](/examples/pro/saved-view-tabs)
- [TableFilterDrawer 场景示例](/examples/pro/table-filter-drawer)

## 编辑链路

- [ProForm 场景示例](/examples/pro/pro-form)
- [OverlayForm 场景示例](/examples/pro/overlay-form)
- [LoginForm 场景示例](/examples/pro/login-form)
- [RequestForm 场景示例](/examples/pro/request-form)
- [StepsForm 场景示例](/examples/pro/steps-form)
- [CrudPage 场景示例](/examples/pro/crud-page)

## 详情链路

- [DetailPanel 场景示例](/examples/pro/detail-panel)
- [DetailPage 场景示例](/examples/pro/detail-page)
- [AuditTimeline 场景示例](/examples/pro/audit-timeline)

## 页面状态与工作区

- [PageHeader 场景示例](/examples/pro/page-header)
- [PageContainer 场景示例](/examples/pro/page-container)
- [StatCard 场景示例](/examples/pro/stat-card)
- [AsyncStateContainer 场景示例](/examples/pro/async-state-container)
- [SplitLayoutPage 场景示例](/examples/pro/split-layout-page)
- [FilterPanel 场景示例](/examples/pro/filter-panel)

## 流程与任务

- [ApprovalFlowPanel 场景示例](/examples/pro/approval-flow-panel)
- [ImportWizard 场景示例](/examples/pro/import-wizard)
- [ImportResultTable 场景示例](/examples/pro/import-result-table)
- [ExportTaskPanel 场景示例](/examples/pro/export-task-panel)

## 当前不再主推为独立示例入口

- 诸如批量操作条、列表头、详情摘要区、变更对比区、状态摘要条这类片段，更适合作为页面场景内部块，而不是一级示例目录。

## 推荐理解顺序

1. 先看 `SearchForm + ProTable + ListPage`，理解后台列表页主干。
2. 再看 `OverlayForm + LoginForm + StepsForm + CrudPage`，把编辑链路接上。
3. 接着看 `DetailPanel + DetailPage + AuditTimeline`，补齐查看和历史记录。
4. 再看 `PageHeader + PageContainer + StatCard`，补齐页面展示壳层。
5. 最后看 `ApprovalFlowPanel + ImportWizard + ExportTaskPanel`，理解更重的业务流场景。
