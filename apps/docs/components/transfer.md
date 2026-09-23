---
title: Transfer 穿梭框
description: 用于成员、权限和资源双栏分配的基础穿梭框组件。
outline: deep
---

# Transfer 穿梭框

`xy-transfer` 适合成员分配、权限绑定和资源配置这类双栏迁移场景。当前 v1 只做基础双栏穿梭，不提供树穿梭和表格穿梭。

## 基础用法

:::demo 默认通过 `v-model` 绑定右侧目标列表的 key 数组。
transfer/basic
:::

## 搜索与禁用项

:::demo 开启 `filterable` 后可以分别在左右两栏做本地过滤，禁用项不会参与迁移。
transfer/filterable
:::

### Transfer Attributes

| 属性              | 说明                       | 类型                            | 默认值               |
| ----------------- | -------------------------- | ------------------------------- | -------------------- |
| `modelValue`      | 已选中项的 key 集合        | `TransferKey[]`                 | `[]`                 |
| `data`            | 可迁移的数据源             | `TransferItem[]`                | `[]`                 |
| `titles`          | 左右两栏的标题             | `[string, string]`              | `['源列表', '目标列表']` |
| `disabled`        | 是否整体禁用               | `boolean`                       | `false`              |
| `filterable`      | 是否显示本地搜索框         | `boolean`                       | `false`              |
| `filterPlaceholder` | 搜索框占位文案           | `string`                        | `'搜索条目'`         |
| `size`            | 尺寸                       | `'xs' / 'sm' / 'md' / 'lg' / 'xl'` | `'md'`            |

### Transfer Events

| 事件名             | 说明                 | 参数                      |
| ------------------ | -------------------- | ------------------------- |
| `update:modelValue` | 选中集合变化        | `(value: TransferKey[])`  |
| `change`           | 数据迁移后触发       | `(value: TransferKey[])`  |

### Transfer Slots

| 插槽     | 说明                       | 接收参数                                        |
| -------- | -------------------------- | ----------------------------------------------- |
| `default` | 自定义数据项渲染内容       | `{ item, checked, side }`（item 为 `TransferItem`） |
