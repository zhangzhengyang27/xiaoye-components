---
title: ApprovalFlowPanel 审批流面板
description: 用统一步骤和节点区承接审批流可视化。
outline: deep
---

# ApprovalFlowPanel 审批流面板

`xy-approval-flow-panel` 适合展示审批节点、当前进度和节点负责人，是审批详情页中的核心区块之一。

## 基础用法

:::demo 审批流面板可以独立存在，也可以嵌入详情页和抽屉中。
pro/approval-flow-panel/basic
:::

## 当前定位

- 负责审批节点步骤条、节点信息和动作区展示。
- 适合流程详情、审批进度、任务流转场景。

## 当前边界

- 当前不处理流程图布局、分支节点和评论流。
- 更复杂的工作流编排仍建议在页面层处理。

## ApprovalFlowPanel API

### ApprovalFlowPanel Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 面板标题 | `string` | `'审批流程'` |
| `nodes` | 审批节点配置 | `ApprovalFlowNode[]` | — |
| `actions` | 底部动作按钮组 | `ApprovalFlowAction[]` | `[]` |

### ApprovalFlowPanel Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `action` | 点击动作按钮时派发 | `(action: ApprovalFlowAction) => void` |
| `node-click` | 点击节点卡片时派发 | `(node: { key: string }) => void` |

### ApprovalFlowPanel Slots

| 插槽 | 说明 | 接收参数 |
| --- | --- | --- |
| `actions` | 自定义动作区内容，覆盖默认动作按钮 | — |
