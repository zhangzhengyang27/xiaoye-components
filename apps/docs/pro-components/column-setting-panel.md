---
title: ColumnSettingPanel 列设置面板
description: 统一列表列显隐选择和重置入口的增强面板。
outline: deep
---

# ColumnSettingPanel 列设置面板

`xy-column-setting-panel` 用来承接列表列显隐控制，让“全选、重置、手动勾选”收在一个稳定侧栏里。

## 基础用法

:::demo 它适合挂在表格工具栏右侧，作为列配置面板的最小承载体。
pro/column-setting-panel/basic
:::

## 当前定位

- 负责列勾选、重置和全选等基础交互。
- 适合为 ProTable 或业务表格提供轻量列配置入口。

## 当前边界

- 当前不处理列顺序拖拽、持久化和复杂权限裁剪。
- 真正的列定义和表格重绘仍由外层表格组件负责。

## ColumnSettingPanel API

### ColumnSettingPanel Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 面板标题 | `string` | `'列设置'` |
| `description` | 标题下方的补充说明，为空时不渲染 | `string` | `''` |
| `columns` | 列配置项，每项含 `key / label`，可选 `description` 和 `disabled` | `ColumnSettingPanelColumn[]` | `[]` |
| `model-value` | 当前勾选的列 key 集合，支持 `v-model` | `string[]` | `[]` |

### ColumnSettingPanel Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 勾选集合变化时派发（勾选或全选） | `(value: string[]) => void` |
| `change` | 勾选集合变化时派发 | `(value: string[]) => void` |
| `reset` | 点击「重置」时派发，重置结果为未被 `disabled` 的全部列 | `(value: string[]) => void` |
