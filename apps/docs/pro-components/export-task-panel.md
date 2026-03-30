---
title: ExportTaskPanel 导出任务面板
description: 用统一列表承接后台导出任务状态。
outline: deep
---

# ExportTaskPanel 导出任务面板

`xy-export-task-panel` 适合展示后台导出任务的排队、处理中、成功和失败状态。

## 基础用法

:::demo 它适合放在工作台侧边栏或导出中心页面中，集中展示任务进度。
pro/export-task-panel/basic
:::

## 当前定位

- 负责导出任务列表、进度条和基础操作入口。
- 适合导出中心、任务中心和报表工作台场景。

## 当前边界

- 当前不处理轮询、通知订阅和历史分页。
- 任务调度与下载鉴权仍由业务层处理。
