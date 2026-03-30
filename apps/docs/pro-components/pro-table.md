---
title: ProTable 增强表格
description: 统一工具栏、搜索区、表格主干和分页联动的增强组件。
outline: deep
---

# ProTable 增强表格

`xy-pro-table` 把工具栏、搜索区、表格本体和分页收成一个稳定闭环，适合后台列表页和运营台页面。

## 基础用法

:::demo 第一版先支持标题、工具栏动作、列 schema 和分页联动，足够承接大多数后台列表页主干。
pro/pro-table/basic
:::

## 组合 SearchForm

:::demo 搜索区通常直接接 `xy-search-form`，让查询栏和表格分页落在同一条链路里。
pro/pro-table/toolbar-search
:::

## 列表态优先级

:::demo `loading` 和空态的优先级是固定的：只要 `loading=true`，优先显示 loading；只有 `loading=false` 且 `data.length===0` 才进入 empty。
pro/pro-table/states
:::

## ProTable API

### ProTable Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 工具栏标题 | `string` | `''` |
| `description` | 工具栏说明 | `string` | `''` |
| `data` | 表格数据 | `T[]` | `[]` |
| `columns` | 列 schema 数组 | `ProTableColumn<T>[]` | `[]` |
| `loading` | 是否加载中 | `boolean` | `false` |
| `toolbar-actions` | 工具栏按钮组 | `Array<{ key: string; label: string; type?: ButtonType; ... }>` | `[]` |
| `table-props` | 透传给 `xy-table` 的 props | `Partial<TableProps<T>>` | `{}` |
| `pagination` | 是否显示分页区 | `boolean` | `true` |
| `current-page` | 当前页，受控模式 | `number` | `undefined` |
| `page-size` | 当前每页条数，受控模式 | `number` | `undefined` |
| `default-current-page` | 默认页码 | `number` | `1` |
| `default-page-size` | 默认每页条数 | `number` | `10` |
| `total` | 总条数 | `number` | `undefined` |
| `page-sizes` | 可选每页条数 | `number[]` | `[10, 20, 50, 100]` |

### 列表态优先级

- `loading=true` 时始终优先显示 loading，空态不会同时出现。
- 只有 `loading=false && data.length===0` 时才进入 empty。
- `ProTable` 当前不承接错误态，错误展示继续由页面层或外部容器决定。

### ProTable Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `toolbar-action` | 点击工具栏按钮时派发 | `(action) => void` |
| `update:currentPage` | 当前页变化时派发 | `(page: number) => void` |
| `update:pageSize` | 每页条数变化时派发 | `(pageSize: number) => void` |
| `page-change` | 分页任一维度变化时派发 | `(page, pageSize) => void` |
| `row-click` | 透传自 `xy-table` | `(row, rowIndex, event) => void` |
| `selection-change` | 透传自 `xy-table` | `(selection) => void` |
| `sort-change` | 透传自 `xy-table` | `({ column, prop, order }) => void` |
| `filter-change` | 透传自 `xy-table` | `(filterValues) => void` |

### 公共类型

- `ProTableColumn<T>`：列 schema 定义，支持 `children`、`slot`、`headerSlot`、`hidden`。
- `ProTableProps<T>`：增强表格 props。
- `ProTableInstance<T>`：增强表格 expose，额外补了 `refreshLayout()`。

### 类型边界

- 根入口当前稳定承诺的是 `ProTableColumn<T>`、`ProTableProps<T>`、`ProTableInstance<T>`。
- 工具栏动作、排序事件载荷、单元格插槽入参这类更细的实现型类型，不再作为增强包根入口的长期公开承诺。

### ProTableColumn Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `prop` | 字段键名 | `keyof T & string` | `undefined` |
| `label` | 列标题 | `string` | `''` |
| `slot` | 单元格插槽名 | `string` | 跟随 `prop / key` |
| `header-slot` | 表头插槽名 | `string` | `${slot}-header` |
| `children` | 子列数组 | `ProTableColumn<T>[]` | `[]` |
| `hidden` | 是否隐藏该列 | `boolean` | `false` |

其余未列出的列属性会继续透传给 `xy-table-column`。

### ProTable Slots

| 插槽 | 说明 |
| --- | --- |
| `toolbar-main` | 自定义标题区 |
| `toolbar-left` | 工具栏右侧操作区前置内容 |
| `toolbar-right` | 工具栏右侧操作区尾部内容 |
| `search` | 搜索区内容 |
| `footer-meta` | 分页左侧补充信息 |
| `loading` | 自定义加载态 |
| `empty` | 自定义空态 |
| `[column.slot / column.prop]` | 自定义单元格内容 |
| `[column.headerSlot]` | 自定义表头内容 |

## 当前不覆盖的能力边界

- 不负责远程请求编排，不提供 `request / reload / params` 这类请求层接口。
- 不负责搜索表单 schema 的统一管理，搜索区仍然通过 `search` 插槽承接。
- 不覆盖虚拟滚动、可编辑表格、列显隐持久化、批量操作状态机。
- 当 `total / pageCount` 都缺失时，不会自动猜测分页区是否需要显示。
- 运行时组件以 `Record<string, unknown>` 宽类型为主，模板侧不追求完整泛型推断；强类型主要通过导出的 `ProTableProps<T>` / `ProTableColumn<T>` / `ProTableInstance<T>` 提供。
