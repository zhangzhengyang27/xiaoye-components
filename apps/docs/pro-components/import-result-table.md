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
