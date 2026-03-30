---
title: AuditTimeline 审计时间线
description: 面向后台操作记录、审批流和变更历史的增强时间线。
outline: deep
---

# AuditTimeline 审计时间线

`xy-audit-timeline` 把基础时间线提升成可以直接承接“操作者 + 时间 + 状态 + 备注 + 附件”的历史记录组件。

## 操作历史

:::demo `AuditTimeline` 支持状态映射、附件展示和具名插槽，适合直接嵌进 `DetailPanel` 或详情页信息区。
pro/audit-timeline/basic
:::

## AuditTimeline API

### AuditTimeline Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `items` | 历史记录列表 | `AuditTimelineEntry[]` | `[]` |
| `empty-text` | 空态说明文案 | `string` | `'暂时还没有审计记录'` |
| `compact` | 是否启用紧凑模式 | `boolean` | `false` |

### AuditTimelineEntry Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `id` | 记录唯一标识 | `string \| number` | — |
| `title` | 记录标题 | `string` | — |
| `operator` | 操作者 | `string` | `''` |
| `timestamp` | 时间 | `string` | `''` |
| `status` | 状态映射 | `'default' \| 'success' \| 'warning' \| 'danger' \| 'processing'` | `'default'` |
| `description` | 记录说明 | `string` | `''` |
| `remark` | 备注内容 | `string` | `''` |
| `attachments` | 附件列表 | `AuditTimelineAttachment[]` | `[]` |

### AuditTimeline Slots

| 插槽 | 说明 |
| --- | --- |
| `title` | 自定义标题区 |
| `meta` | 自定义操作者 / 状态区 |
| `default` | 自定义正文区 |
| `actions` | 自定义右侧动作 |
| `attachments` | 自定义附件区 |
| `extra` | 自定义扩展区 |

## 状态映射

- `success`：成功，映射为完成态。
- `warning`：警告，映射为黄色强调态。
- `danger`：拒绝，映射为阻塞态。
- `processing`：处理中，映射为进行中态。
- `default`：已记录，作为普通历史项展示。
