---
title: ImportResultTable 导入结果表格
description: 用统一摘要区和表格结果承接导入反馈。
outline: deep
---

# ImportResultTable 导入结果表格

`xy-import-result-table` 用来承接批量导入完成后的成功、失败和原因信息，让导入反馈更集中。

## 基础用法

:::demo 它通常放在导入向导的最后一步，或作为单独结果页的主内容。
pro/import-result-table/basic
:::

## 当前定位

- 负责导入结果摘要和表格明细的统一展示。
- 适合导入完成后的静态反馈和二次核对场景。

## 当前边界

- 当前不处理文件上传、导入过程状态和失败修复工作流。
- 更复杂的导入编排仍建议由 ImportWizard 或页面层承接。

## ImportResultTable API

### ImportResultTable Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `data` | 导入结果数据行 | `T[]` | `[]` |
| `columns` | 表格列 schema，直接复用 `ProTableColumn<T>` | `ProTableColumn<T>[]` | `[]` |
| `summary` | 导入结果摘要，展示总数、成功、失败三个标签；字段为 `total / success / failed` | `ImportResultSummary` | `undefined` |
| `loading` | 是否加载中 | `boolean` | `false` |

本组件不定义自有事件与插槽；传入的插槽会原样透传给内部的 `XyProTable`，可在 `columns` 中通过 `slot / headerSlot` 引用。
