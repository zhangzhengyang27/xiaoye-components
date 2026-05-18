---
title: ProTable 增强表格
description: 统一工具栏、搜索区、表格主干和分页联动的增强组件。
outline: deep
---

# ProTable 增强表格

`xy-pro-table` 把工具栏、搜索区、表格本体和分页收成一个稳定闭环，适合后台列表页和运营台页面。

## 何时使用

- 需要快速搭建后台列表页，不想手拼工具栏、搜索区和分页。
- 需要远程数据加载、自动分页联动的表格工作台。
- 需要列设置、密度切换、全屏、筛选抽屉等内置工作台能力。
- 需要行编辑、虚拟滚动、右键菜单等高级表格能力。

## 何时不使用

- 只需要纯展示表格（无工具栏、无分页）时，优先使用 `xy-table`。
- 需要完全自定义表格布局时，优先使用 `xy-table` + 手动组合。
- 数据量极小（< 20 条）且无分页需求时，`xy-table` 更轻量。

## 与基础组件的关系

```
ProTable
├── 工具栏（内置）         ← 自定义布局，非独立组件
├── SearchForm（搜索区）    ← 可选，通过 slot 或 request 联动
├── Table（表格本体）       ← 基于 xy-table，通过 tableProps 透传
├── Pagination（分页）      ← 内置，与 request 自动联动
├── ColumnSettingPanel      ← 工作台内置，列显隐配置
└── TableFilterDrawer       ← 工作台内置，高级筛选
```

**核心区别**：`xy-table` 是纯表格渲染组件，`xy-pro-table` 在其之上封装了完整的列表页工作台能力。

## 最佳实践

### 远程数据加载

推荐使用 `request` 配置，让 ProTable 自动管理加载态、分页和数据刷新：

```vue
<xy-pro-table
  :columns="columns"
  :request="fetchData"
/>

<script setup lang="ts">
async function fetchData(params) {
  const { data } = await api.getList({
    page: params.currentPage,
    pageSize: params.pageSize,
    ...params.filters
  })
  return { data: data.list, total: data.total }
}
</script>
```

### 列定义与显示协议

使用 `value-type` 快速渲染常见数据格式，避免每个列都写自定义插槽：

```ts
const columns = [
  { prop: 'name', label: '名称' },
  { prop: 'status', label: '状态', valueType: 'tag', options: statusOptions },
  { prop: 'amount', label: '金额', value_type: 'money' },
  { prop: 'createdAt', label: '创建时间', value_type: 'datetime' },
]
```

### 稳定的 row-key

只要涉及选择列、展开行、行编辑或数据刷新后保留状态，都应显式提供稳定的 `row-key`：

```vue
<xy-pro-table
  :table-props="{ rowKey: 'id' }"
  :columns="columns"
  :data="data"
/>
```

## 基础用法

:::demo 第一版先支持标题、工具栏动作、列 schema 和分页联动，足够承接大多数后台列表页主干。
pro/pro-table/basic
:::

## 组合 SearchForm

:::demo 搜索区通常直接接 `xy-search-form`，让查询栏和表格分页落在同一条链路里。
pro/pro-table/toolbar-search
:::

## 工作台与请求

:::demo `xy-pro-table` 现在可以直接承接请求、视图、筛选抽屉、密度、列设置、导出和打印，不再要求页面层手拼一整套列表工作台。
pro/pro-table/workbench-request
:::

## 行编辑

:::demo 首版把行编辑能力纳入 `xy-pro-table`，通过 expose 和编辑配置统一控制草稿、保存和取消。
pro/pro-table/editable-row
:::

## 虚拟列表

:::demo 虚拟模式首版要求固定行高和显式 `rowKey`，适合大体量后台列表，不建议和复杂展开内容一起开启。
pro/pro-table/virtual-list
:::

## 显示协议

:::demo 第三批先不公开 `display-item`，而是把 `valueType / formatter / render / renderHTML` 这套显示协议先接到 `xy-pro-table` 列定义里。
pro/pro-table/display-value-types
:::

## 右键菜单与表格选择器

:::demo `xy-pro-table` 可以统一接住右键菜单和表格选择器，让列表页不再需要再拼一套外部状态壳层。
pro/pro-table/contextmenu-selection
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
| `workbench` | 工作台配置，控制刷新、密度、列设置、全屏、筛选、导出、打印 | `ProTableWorkbenchConfig` | `{}` |
| `request` | 远程请求配置 | `ProTableRequestConfig<T>` | `undefined` |
| `views` | 搜索区、筛选抽屉和保存视图配置 | `ProTableViewsConfig` | `undefined` |
| `batch-actions` | 批量动作按钮组 | `ProTableBatchAction[]` | `[]` |
| `table-select` | 表格选择器模式配置 | `ProTableTableSelectConfig` | `undefined` |
| `editable` | 编辑模式配置 | `ProTableEditableConfig<T>` | `undefined` |
| `virtual` | 虚拟列表配置 | `ProTableVirtualConfig` | `undefined` |
| `contextmenu` | 右键菜单配置 | `ProTableContextmenuConfig<T>` | `undefined` |
| `export-options` | 导出配置 | `ProTableExportOptions<T>` | `undefined` |
| `print-options` | 打印配置 | `ProTablePrintOptions<T>` | `undefined` |
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

### 请求编排行为

- `request` 连续触发时只会应用最后一次响应结果，避免快速搜索、切页或筛选时旧响应回写新状态。
- `request-success` 和 `request-error` 也只针对当前最新一次请求派发。

### ProTable Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `toolbar-action` | 点击工具栏按钮时派发 | `(action) => void` |
| `workbench-action` | 点击内置工作台动作时派发 | `(actionKey) => void` |
| `update:currentPage` | 当前页变化时派发 | `(page: number) => void` |
| `update:pageSize` | 每页条数变化时派发 | `(pageSize: number) => void` |
| `page-change` | 分页任一维度变化时派发 | `(page, pageSize) => void` |
| `request-success` | 远程请求成功时派发 | `(rows) => void` |
| `request-error` | 远程请求失败时派发 | `(error) => void` |
| `batch-action` | 点击批量动作时派发 | `(action, selection) => void` |
| `view-select` | 选中保存视图时派发 | `(item) => void` |
| `filter-apply` | 应用筛选抽屉时派发 | `(model) => void` |
| `contextmenu-select` | 点击右键菜单项时派发 | `(item, payload) => void` |
| `table-select-confirm` | 确认表格选择器结果时派发 | `(selection) => void` |
| `edit-submit` | 保存编辑内容时派发 | `({ rows }) => void` |
| `row-click` | 透传自 `xy-table` | `(row, rowIndex, event) => void` |
| `selection-change` | 透传自 `xy-table` | `(selection) => void` |
| `sort-change` | 透传自 `xy-table` | `({ column, prop, order }) => void` |
| `filter-change` | 透传自 `xy-table` | `(filterValues) => void` |

### 公共类型

- `ProTableColumn<T>`：列 schema 定义，支持 `children`、`slot`、`headerSlot`、`hidden`。
- `ProTableProps<T>`：增强表格 props。
- `ProTableInstance<T>`：增强表格 expose，除基础表格能力外，还补了 `reload / refresh / reset / toggleFullscreen / setDensity / openFilterDrawer / getVisibleColumns / startEdit / cancelEdit / submitEdit`。

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
| `value-type` | 显示态值类型，先服务于表格列回显 | `'text' \| 'select' \| 'radio' \| 'checkbox' \| 'tag' \| 'progress' \| 'link' \| 'image' \| 'avatar' \| 'money' \| 'date' \| 'datetime' \| 'code' \| 'copy'` | `undefined` |
| `formatter` | 兜底的文本格式化函数，低于 `slot / render / renderHTML`，沿用表格列的四参签名 | `(row, column, value, rowIndex) => unknown` | `undefined` |
| `render` | 自定义 VNode 渲染函数 | `(value, { row, column, rowIndex }) => VNodeChild` | `undefined` |
| `render-html` | 自定义 HTML 字符串渲染，内部走 `innerHTML`，只适合可信内容 | `(value, { row, column, rowIndex }) => string` | `undefined` |
| `empty-value` | 空值占位文案 | `string` | `'-'` |
| `editable` | 是否允许编辑该列 | `boolean \| ((row, rowIndex) => boolean)` | `false` |
| `editor` | 编辑组件 | `ProFieldSchemaBuiltinComponent \| Component` | `input` |
| `editor-props` | 编辑组件额外 props | `Record<string, unknown> \| ((row) => Record<string, unknown>)` | `undefined` |
| `editor-slot` | 自定义编辑插槽名 | `string` | `undefined` |
| `options` | 选择类编辑组件选项 | `SelectOption[] \| ((row) => SelectOption[])` | `undefined` |
| `exportable` | 是否参与导出 | `boolean` | `true` |
| `printable` | 是否参与打印 | `boolean` | `true` |

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
| `[column.editorSlot]` | 自定义编辑态内容 |

## 当前不覆盖的能力边界

- 不承诺兼容 `@pureadmin/table` / Element Plus 的同名 props 设计，只对齐能力而不照抄接口。
- 虚拟模式首版要求固定行高和显式 `rowKey`，不建议与复杂展开行、可变高度内容同时使用。
- 列显隐和固定列状态目前是运行时状态，默认不自动做本地持久化。
- 当 `total / pageCount` 都缺失时，不会自动猜测分页区是否需要显示。
- `renderHTML` 只适合渲染可信 HTML 字符串；如果内容来自用户输入或第三方数据，优先改用 `render` 返回 VNode。
- 运行时组件以 `Record<string, unknown>` 宽类型为主，模板侧不追求完整泛型推断；强类型主要通过导出的 `ProTableProps<T>` / `ProTableColumn<T>` / `ProTableInstance<T>` 提供。
