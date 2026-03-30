---
title: 增强组件总览
description: 面向中后台闭环场景的增强层入口。
outline: deep
---

# 增强组件总览

这里不再把增强层理解成“每一个局部区块都值得公开成一个组件”。收口后的心智是：对外主推少数真正有稳定契约的核心公开件，其余能力通过场景页、页面容器和内部片段来理解。

## 核心表单与筛选

- [SearchForm 搜索表单](/pro-components/search-form)：统一筛选栏布局、查询动作和折叠字段。
- [ProForm 增强表单](/pro-components/pro-form)：统一表单网格、标题和动作区。
- [OverlayForm 覆盖层表单](/pro-components/overlay-form)：统一覆盖层编辑，不再把抽屉表单和弹窗表单拆成两套主心智。
- [FilterPanel 筛选面板](/pro-components/filter-panel)：统一高级筛选容器。
- [RequestForm 请求表单](/pro-components/request-form)：统一加载、提交和表单骨架。
- [StepsForm 分步表单](/pro-components/steps-form)：统一多阶段录入流程。

## 核心列表与数据

- [ProTable 增强表格](/pro-components/pro-table)：统一工具栏、搜索区、表格本体和分页联动。
- [ColumnSettingPanel 列设置面板](/pro-components/column-setting-panel)：统一列显隐配置入口。
- [SavedViewTabs 视图页签](/pro-components/saved-view-tabs)：统一后台常见的视图切换和保存入口。
- [TableFilterDrawer 表格筛选抽屉](/pro-components/table-filter-drawer)：统一高级筛选抽屉。
- [ImportResultTable 导入结果表格](/pro-components/import-result-table)：统一导入反馈摘要和结果明细。
- [ListPage 列表页面容器](/pro-components/list-page)：统一列表页骨架。
- [CrudPage 增删改查页面](/pro-components/crud-page)：统一列表、编辑和查看闭环。

## 核心详情与历史

- [AuditTimeline 审计时间线](/pro-components/audit-timeline)：统一历史记录与审批说明。
- [DetailPanel 详情面板](/pro-components/detail-panel)：统一覆盖层中的详情查看，不再把抽屉详情和弹窗详情拆成两套主心智。
- [DetailPage 详情页面容器](/pro-components/detail-page)：统一完整详情页骨架。

## 流程与任务

- [ApprovalFlowPanel 审批流面板](/pro-components/approval-flow-panel)：统一审批进度和节点展示。
- [ImportWizard 导入向导](/pro-components/import-wizard)：统一导入流程步骤。
- [ExportTaskPanel 导出任务面板](/pro-components/export-task-panel)：统一导出任务状态展示。

## 页面布局

- [AsyncStateContainer 异步状态容器](/pro-components/async-state-container)：统一加载、空态、错误和恢复动作承载。
- [SplitLayoutPage 分栏布局页](/pro-components/split-layout-page)：统一主从布局与侧栏布局，不再把两种双栏工作区拆成并列主心智。

## 当前不再主推为独立公开件

- 诸如列表头、批量操作条、筛选预设、详情分区、附件区、操作日志区这类能力，后续更适合作为页面容器内部块、slot 片段或场景用法出现。
- 当前仓库里仍保留这些页面和实现，但这个总览页不再把它们作为增强层的第一入口。

## 推荐阅读顺序

1. 先看 [SearchForm 搜索表单](/pro-components/search-form)、[ProTable 增强表格](/pro-components/pro-table) 和 [ListPage 列表页面容器](/pro-components/list-page)，理解后台列表页主干。
2. 再看 [OverlayForm 覆盖层表单](/pro-components/overlay-form)、[StepsForm 分步表单](/pro-components/steps-form)、[CrudPage 增删改查页面](/pro-components/crud-page)，补齐编辑链路。
3. 接着看 [DetailPanel 详情面板](/pro-components/detail-panel)、[DetailPage 详情页面容器](/pro-components/detail-page)、[AuditTimeline 审计时间线](/pro-components/audit-timeline)，补齐查看和历史记录。
4. 最后看 [ApprovalFlowPanel 审批流面板](/pro-components/approval-flow-panel)、[ImportWizard 导入向导](/pro-components/import-wizard)、[ExportTaskPanel 导出任务面板](/pro-components/export-task-panel)，理解更重的业务流场景。
5. 然后进入 [增强组件示例总览](/examples/pro/overview)，按场景和闭环查看整套接法。
