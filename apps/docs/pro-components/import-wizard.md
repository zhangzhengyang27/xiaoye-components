---
title: ImportWizard 导入向导
description: 用统一步骤流承接导入流程的多阶段操作。
outline: deep
---

# ImportWizard 导入向导

`xy-import-wizard` 适合承接“上传文件 -> 校验 -> 查看结果”这类导入流程，把阶段切换做成稳定向导。

## 基础用法

:::demo 当前示例先演示步骤流和阶段内容承接，后续可以再接上传和结果表格。
pro/import-wizard/basic
:::

## 当前定位

- 面向导入流程的向导型容器。
- 统一步骤条、阶段内容和上一步下一步动作。

## 当前边界

- 当前不包含文件上传、解析进度和失败修复工作流。
- 真实导入逻辑仍需页面层或专门上传组件承接。

## ImportWizard API

### ImportWizard Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 向导标题 | `string` | `'导入向导'` |
| `steps` | 步骤配置 | `ImportWizardStep[]` | — |
| `active` | 当前步骤索引，受控模式 | `number` | `undefined` |
| `default-active` | 默认步骤索引，仅在非受控模式生效 | `number` | `0` |

### ImportWizard Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:active` | 当前步骤变化时派发，支持 `v-model:active` | `(value: number) => void` |
| `prev` | 点击「上一步」时派发 | `(value: number) => void` |
| `next` | 点击「下一步」时派发 | `(value: number) => void` |
| `finish` | 在最后一步点击「完成」时派发 | `() => void` |

### ImportWizard Slots

| 插槽 | 说明 | 接收参数 |
| --- | --- | --- |
| `default` | 当前阶段的内容区 | `{ step: ImportWizardStep \| undefined, active: number }` |
