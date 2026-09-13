---
title: ListPage 列表页面容器
description: 统一筛选栏、列表、批量动作和请求状态的页面容器。
outline: deep
---

# ListPage 列表页面容器

`xy-list-page` 用来把 `SearchForm + ProTable + 请求状态 + 页面内批量动作区` 收成一块稳定的列表页容器。

## 何时使用

- 需要标准列表页骨架：搜索 → 表格 → 分页 → 批量操作。
- 需要统一管理列表页的加载态、空态和错误态。
- 需要批量选择行后执行批量操作（如批量删除、批量导出）。

## 何时不使用

- 只需要纯表格展示时，优先使用 `xy-pro-table`。
- 需要编辑表单或详情查看时，优先使用 `xy-crud-page`。
- 页面布局非标准列表结构时，优先使用 `xy-page-container` 自由组合。

## 与基础组件的关系

```
ListPage
├── PageContainer（页面容器）  ← 页面头部 + 主体布局
├── SearchForm（搜索区）       ← 筛选栏，通过 slot 承接
├── ProTable（表格区）         ← 列表主体，通过 slot 承接
├── AsyncStateContainer       ← 加载/空态/错误状态管理
└── BatchActionBar            ← 批量操作栏（选中行后出现）
```

**核心区别**：`xy-pro-table` 是表格工作台，`xy-list-page` 在其之上封装了完整的列表页容器能力（搜索、批量操作、异步状态）。

## 最佳实践

### 与 ProTable 的分工

- **ProTable**：负责表格渲染、列定义、工具栏、分页。
- **ListPage**：负责页面容器、搜索联动、批量操作、异步状态。

推荐将 ProTable 放在 ListPage 的默认插槽中：

```vue
<xy-list-page
  :search-fields="searchFields"
  :batch-actions="batchActions"
  @search="handleSearch"
>
  <xy-pro-table
    :columns="columns"
    :data="tableData"
    :loading="loading"
  />
</xy-list-page>
```

### 批量操作

使用 `batchActions` 定义批量操作按钮，组件会自动在选中行后显示操作栏：

```ts
const batchActions = [
  { label: '批量删除', type: 'danger', handler: handleBatchDelete },
  { label: '批量导出', handler: handleBatchExport },
]
```

## 基础用法

:::demo 适合中后台列表页的标准骨架。
pro/list-page/basic
:::

## 当前定位

- 承接列表页里的搜索、列表、分页、批量动作和异步状态。
- 不直接处理表单编辑或详情展示，那些能力继续交给 `CrudPage` 和 `DetailPage`。

## 类型命名约定

- 对外主类型名统一使用 `ListPageBatchAction`、`ListPageProps`、`ListPageActionRef`。
- 旧的 `BatchActionBarAction` 仅作为源码兼容别名保留，不再作为正式文档类型入口。

## ListPage API

### ListPage Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 工具栏标题 | `string` | `''` |
| `description` | 工具栏说明 | `string` | `''` |
| `search-model` | 搜索表单数据 | `Record<string, unknown>` | `{}` |
| `search-fields` | 搜索表单字段配置 | `SearchFormField[]` | `[]` |
| `data` | 表格数据 | `T[]` | `[]` |
| `columns` | 列 schema 数组 | `ProTableColumn<T>[]` | — |
| `request` | 远程请求函数，传入后启用分页区 | `(params: Record<string, unknown>, ctx: ProRequestContext) => Promise<ProRequestResult<T>>` | `undefined` |
| `toolbar-actions` | 工具栏按钮组 | `ProPageAction[]` | `[]` |
| `batch-actions` | 批量动作按钮组 | `ListPageBatchAction[]` | `[]` |
| `immediate` | 挂载后是否立即发起远程请求 | `boolean` | `true` |
| `page-size` | 默认每页条数 | `number` | `10` |
| `workbench` | 工作台配置，透传给内部 `xy-pro-table` | `ProTableWorkbenchConfig` | `{}` |
| `editable` | 编辑模式配置 | `ProTableEditableConfig<T>` | `undefined` |
| `virtual` | 虚拟列表配置 | `ProTableVirtualConfig` | `undefined` |

### ListPage Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `toolbar-action` | 点击工具栏按钮时派发 | `(action: ProPageAction) => void` |
| `batch-action` | 点击批量动作时派发 | `(action: ListPageBatchAction, selection: Record<string, unknown>[]) => void` |
| `selection-change` | 表格选中行变化时派发 | `(selection: Record<string, unknown>[]) => void` |
| `request-success` | 远程请求成功时派发 | `(payload: Record<string, unknown>[]) => void` |
| `request-error` | 远程请求失败时派发 | `(error: unknown) => void` |

### ListPage Slots

| 插槽 | 说明 | 接收参数 |
| --- | --- | --- |
| `toolbar-main` | 自定义标题区 | — |
| `toolbar-left` | 工具栏右侧操作区前置内容 | — |
| `toolbar-meta` | 工具栏右侧操作区补充内容 | — |
| `toolbar-right` | 工具栏右侧操作区尾部内容 | — |
| `search` | 自定义搜索区 | — |
| `footer-meta` | 分页左侧补充信息 | — |
| `loading` | 自定义加载态 | 透传 `ProTable` 对应插槽参数 |
| `empty` | 自定义空态 | 透传 `ProTable` 对应插槽参数 |
| 其他具名插槽 | 透传给内部 `xy-pro-table` 的同名插槽（如单元格自定义插槽） | 对应插槽参数 |

### ListPage Exposes

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `reload` | `() => Promise<void>` | 以当前参数重新发起远程请求 |
| `refresh` | `() => Promise<void>` | 刷新当前页数据 |
| `reset` | `() => Promise<void>` | 重置搜索、筛选、分页和选中行后重新加载 |
| `clearSelection` | `() => void` | 清空表格选中行 |
