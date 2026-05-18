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
