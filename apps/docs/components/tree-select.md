---
title: TreeSelect 树选择
description: 用于组织、目录和权限树单选的层级选择组件。
outline: deep
---

# TreeSelect 树选择

`xy-tree-select` 面向组织、菜单、分类目录这类层级单选场景。当前 v1 只做单选树选，不提供多选和 tag 回显。

## 基础用法

:::demo 通过 `node-key` 标识节点主键，组件会在选择后回显节点标签。
tree-select/basic
:::

## 过滤与清空

:::demo 开启 `filterable` 后，可以在面板内搜索已加载节点，并结合 `clearable` 清空当前值。
tree-select/filterable
:::

## 表单场景

:::demo 放在 `xy-form-item` 中时，树选择会在选择和关闭时参与表单校验。
tree-select/form
:::

## 行为约定

- 当前版本只做单选树选，`model-value` 是当前节点的单个 key，不是路径数组。
- `filterable` 打开后，会在面板顶部展示搜索框；默认会直接调用内部 `tree.filter()`。
- 如果你需要定制过滤逻辑，可以通过 `filter-node-method` 复用 `xy-tree` 的节点过滤协议。

## API

### TreeSelect Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 当前选中节点 key | `TreeSelectProps["modelValue"]` | `null` |
| `data` | 树节点数据 | `TreeData` | `[]` |
| `node-key` | 节点唯一标识字段 | `string` | `undefined` |
| `props` | 树节点字段映射 | `TreeOptionProps` | `{ children: 'children', label: 'label', disabled: 'disabled' }` |
| `placeholder` | 未选择时的占位提示 | `TreeSelectProps["placeholder"]` | `'请选择节点'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `clearable` | 是否允许清空 | `boolean` | `false` |
| `filterable` | 是否启用搜索过滤 | `boolean` | `false` |
| `filter-node-method` | 自定义节点过滤方法 | `FilterNodeMethodFunction` | `undefined` |
| `lazy` | 是否启用懒加载 | `boolean` | `false` |
| `load` | 懒加载回调 | `LoadFunction` | `undefined` |
| `size` | 组件尺寸 | `TreeSelectProps["size"]` | 跟随全局配置 |
| `empty-text` | 空数据文案 | `string` | `'暂无数据'` |
| `search-placeholder` | 搜索框占位文案 | `string` | `'搜索节点'` |
| `teleported` | 是否把下拉面板传送到 `body` | `boolean` | `true` |
| `append-to` | 下拉面板挂载目标 | `string \| HTMLElement` | `'body'` |
| `placement` | 下拉面板弹出位置 | `Placement` | `'bottom-start'` |
| `offset` | 下拉面板偏移量 | `number` | `8` |
| `popper-class` | 下拉面板自定义类名 | `string` | `''` |
| `popper-style` | 下拉面板自定义样式 | `StyleValue` | `''` |

### TreeSelect Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:model-value` | 选中节点 key 变化时触发 | `TreeSelectValueChangeHandler` |
| `change` | 选中节点确认变化时触发 | `TreeSelectValueChangeHandler` |
| `clear` | 点击清空按钮时触发 | — |
| `visible-change` | 面板打开或关闭时触发 | `TreeSelectVisibleChangeHandler` |
| `focus` | 打开面板时触发 | — |
| `blur` | 关闭面板时触发 | — |

### TreeSelect Exposes

| 暴露项 | 说明 | 类型 |
| --- | --- | --- |
| `focus` | 聚焦触发器 | `TreeSelectInstance["focus"]` |
| `blur` | 关闭面板并让触发器失焦 | `TreeSelectInstance["blur"]` |
| `open` | 打开下拉面板 | `TreeSelectInstance["open"]` |
| `close` | 关闭下拉面板 | `TreeSelectInstance["close"]` |
| `filter` | 主动设置过滤关键词并同步树过滤 | `TreeSelectInstance["filter"]` |
