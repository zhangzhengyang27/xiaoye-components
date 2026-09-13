---
title: TableFilterDrawer 表格筛选抽屉
description: 用抽屉承接列表的高级筛选项和应用重置动作。
outline: deep
---

# TableFilterDrawer 表格筛选抽屉

`xy-table-filter-drawer` 适合在列表页收纳不常用但复杂的筛选条件，让主筛选栏保持简洁。

## 基础用法

:::demo 常见做法是把高频筛选放在 SearchForm，把次级条件收进这个筛选抽屉里。
pro/table-filter-drawer/basic
:::

## 当前定位

- 负责高级筛选抽屉的容器、字段承载和应用重置出口。
- 适合与 SearchForm、ProTable 配合形成主次筛选闭环。

## 当前边界

- 当前不处理筛选字段的远程配置和条件持久化。
- 真正的筛选协议和表格刷新仍由页面层接管。

## TableFilterDrawer API

### TableFilterDrawer Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `open` | 是否打开抽屉，支持 `v-model:open` | `boolean` | `false` |
| `title` | 抽屉标题 | `string` | `'筛选条件'` |
| `model` | 筛选表单数据对象，必填，字段名需与 `fields` 的 `prop` 对应 | `Record<string, unknown>` | `-` |
| `fields` | 筛选字段 schema，内部交给 `XyProForm` 渲染，继承 `ProFieldSchema` 的能力 | `ProFieldSchema[]` | `[]` |
| `drawer-props` | 透传给 `xy-drawer` 的 props，继承自 `DrawerProps`（Omit 掉 `modelValue` / `title`）的关键属性，如 `size`（默认 `420`）、`placement`、`closeOnOverlay`、`destroyOnClose`、`beforeClose` 等 | `Omit<Partial<DrawerProps>, 'modelValue' \| 'title'>` | `{}` |

### TableFilterDrawer Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:open` | 抽屉开关状态变化时派发 | `(value: boolean) => void` |
| `apply` | 点击「应用筛选」时派发，携带当前 `model` 的浅拷贝，随后自动关闭抽屉 | `(payload: Record<string, unknown>) => void` |
| `reset` | 点击「重置」时派发，携带当前 `model` 的浅拷贝，随后自动关闭抽屉 | `(payload: Record<string, unknown>) => void` |
| `closed` | 抽屉关闭动画结束后派发 | `() => void` |
