---
title: Table 表格
description: 参考 Element Plus 经典 Table 设计的后台表格组件，支持列树、选择列、展开行、树形数据、固定列、汇总行和实例方法。
outline: deep
---

# Table 表格

`xy-table` 用于后台列表页的数据展示。当前版本以 `xy-table + xy-table-column` 作为唯一列定义方式，并在第一轮排序/筛选/当前行的基础上，补齐了 `selection / index / expand / fixed / summary / span-method / tree / lazy / methods` 这一轮高频能力。

## 基础用法

:::demo 基础表格继续使用子组件列定义，支持当前行高亮、行点击和默认单元格插槽。
table/basic
:::

## 服务端分页联动

:::demo 远程排序仍然通过 `sortable="custom"` 配合 `sort-change` 驱动外部请求，初始排序使用 `default-sort`。
table/server-pagination
:::

## 筛选与排序联动

:::demo 表格内置列级筛选和本地排序，页面层只负责叠加关键字搜索等业务过滤。
table/filter-sort
:::

## 选择列、展开行与实例方法

:::demo `selection / index / expand / fixed / show-summary` 可以组合使用，实例方法用于清空选择、清空排序等控制场景。
table/selection-expand
:::

## 树形数据、懒加载与列树表头

:::demo `xy-table-column` 支持嵌套声明，树形数据和懒加载仍然走同一套列树与 body 渲染链路。
table/tree-lazy
:::

## 行操作列

:::demo 任意一列都可以通过默认插槽变成自定义单元格，操作列不再依赖命名插槽。
table/action-column
:::

## 加载态与空态

:::demo Table 仍然适合作为加载态、空态和列表内容的统一承载容器。
table/state
:::

Table 的默认加载遮罩已经接入统一的 Loading indicator。未自定义 `loading` 插槽时，会使用与独立 `Loading` 一致的 spinner 和文案表现；同时会读取 `ConfigProvider.loading` 的 `text / spinner / svg / svgViewBox / background` 作为视觉默认项，但不会继承 `delay / minDuration / fullscreen / lock`。

## 空态、加载态与错误态

:::demo 页面层可以在正常、空结果、加载中和加载失败之间切换，Table 只负责统一展示骨架。
table/multi-state
:::

## 何时使用

- 后台列表页、运营视图和只读数据表格。
- 需要选择列、展开行、固定列、汇总行、树形数据等经典 Table 能力。
- 需要通过 `xy-table-column` 的嵌套声明组织复杂表头，而不是维护 `columns` 数组。

## API

### Table Attributes

| 属性                      | 说明                                   | 类型                                                                                     | 默认值                                                                       |
| ------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `data`                    | 数据源                                 | `T[]`                                                                                    | `[]`                                                                         |
| `row-key`                 | 行唯一标识字段或函数                   | `keyof T \| (row, rowIndex) => string \| number`                                         | `undefined`                                                                  |
| `size`                    | 表格尺寸                               | `'sm' \| 'md' \| 'lg'`                                                                   | `'md'`                                                                       |
| `width`                   | 表格根节点宽度                         | `string \| number`                                                                       | `undefined`                                                                  |
| `height`                  | 固定高度，超过后表体滚动               | `string \| number`                                                                       | `undefined`                                                                  |
| `max-height`              | 最大高度，超过后表体滚动               | `string \| number`                                                                       | `undefined`                                                                  |
| `fit`                     | 是否让列宽自适应容器宽度               | `boolean`                                                                                | `true`                                                                       |
| `stripe`                  | 是否显示斑马纹                         | `boolean`                                                                                | `false`                                                                      |
| `border`                  | 是否显示完整边框和纵向分割线           | `boolean`                                                                                | `false`                                                                      |
| `show-header`             | 是否显示表头                           | `boolean`                                                                                | `true`                                                                       |
| `show-summary`            | 是否显示汇总行                         | `boolean`                                                                                | `false`                                                                      |
| `sum-text`                | 汇总行第一列文案                       | `string`                                                                                 | `'合计'`                                                                     |
| `summary-method`          | 自定义汇总行计算                       | `({ columns, data }) => unknown[]`                                                       | `undefined`                                                                  |
| `empty-text`              | 默认空态文案                           | `string`                                                                                 | `'暂无数据'`                                                                 |
| `loading`                 | 是否显示加载态遮罩                     | `boolean`                                                                                | `false`                                                                      |
| `loading-text`            | 默认加载文案                           | `string`                                                                                 | `'Loading...'`                                                               |
| `highlight-current-row`   | 是否高亮当前行                         | `boolean`                                                                                | `false`                                                                      |
| `current-row-key`         | 当前行 key，受控模式                   | `string \| number \| null`                                                               | `undefined`                                                                  |
| `default-sort`            | 默认排序配置                           | `{ prop?: string; order?: 'ascending' \| 'descending' \| null }`                         | `{ prop: undefined, order: null }`                                           |
| `expand-row-keys`         | 展开行 key 列表                        | `Array<string \| number>`                                                                | `undefined`                                                                  |
| `default-expand-all`      | 是否默认展开全部可展开行/树节点        | `boolean`                                                                                | `false`                                                                      |
| `row-expandable`          | 控制 `type="expand"` 行是否可展开      | `(row, rowIndex) => boolean`                                                             | `undefined`                                                                  |
| `span-method`             | 单元格合并逻辑                         | `({ row, rowIndex, column, columnIndex }) => [rowspan, colspan] \| { rowspan, colspan }` | `undefined`                                                                  |
| `select-on-indeterminate` | 头部勾选在半选态下是否直接全选         | `boolean`                                                                                | `true`                                                                       |
| `indent`                  | 树形缩进宽度                           | `number`                                                                                 | `16`                                                                         |
| `tree-props`              | 树形字段配置                           | `{ children?: string; hasChildren?: string; checkStrictly?: boolean }`                   | `{ children: 'children', hasChildren: 'hasChildren', checkStrictly: false }` |
| `lazy`                    | 是否启用懒加载树节点                   | `boolean`                                                                                | `false`                                                                      |
| `load`                    | 懒加载回调                             | `(row, treeNode, resolve) => void`                                                       | `undefined`                                                                  |
| `table-layout`            | 表格布局算法                           | `'fixed' \| 'auto'`                                                                      | `'fixed'`                                                                    |
| `show-overflow-tooltip`   | 是否为默认文本链路统一开启溢出 tooltip | `boolean`                                                                                | `false`                                                                      |
| `tooltip-formatter`       | 自定义溢出 tooltip 文案                | `({ row, column, value, cellValue }) => unknown`                                         | `undefined`                                                                  |
| `row-class-name`          | 行 class 或 class 计算函数             | `string \| (row, rowIndex) => string`                                                    | `''`                                                                         |
| `row-style`               | 行样式或样式计算函数                   | `StyleValue \| (row, rowIndex) => StyleValue`                                            | `undefined`                                                                  |
| `cell-class-name`         | 单元格 class 或 class 计算函数         | `string \| (cellMeta) => string`                                                         | `''`                                                                         |
| `cell-style`              | 单元格样式或样式计算函数               | `StyleValue \| (cellMeta) => StyleValue`                                                 | `undefined`                                                                  |
| `header-row-class-name`   | 表头行 class 或 class 计算函数         | `string \| (rowIndex) => string`                                                         | `''`                                                                         |
| `header-row-style`        | 表头行样式或样式计算函数               | `StyleValue \| (rowIndex) => StyleValue`                                                 | `undefined`                                                                  |
| `header-cell-class-name`  | 表头单元格 class 或 class 计算函数     | `string \| (column, columnIndex) => string`                                              | `''`                                                                         |
| `header-cell-style`       | 表头单元格样式或样式计算函数           | `StyleValue \| (column, columnIndex) => StyleValue`                                      | `undefined`                                                                  |
| `class-name`              | 表格根节点附加 class                   | `string`                                                                                 | `''`                                                                         |
| `style`                   | 表格根节点附加样式                     | `StyleValue`                                                                             | `undefined`                                                                  |
| `clickable`               | 是否把主表体行视为可点击项，并补齐键盘聚焦与回车触发 | `boolean`                                                                                | `false`                                                                      |
| `scrollbar-always-on`     | 是否为滚动容器保留稳定滚动条槽位       | `boolean`                                                                                | `false`                                                                      |

### Compatibility Notes

- `stripe` 是主命名，`striped` 仅保留兼容，不再作为文档主推写法。
- `border` 是主命名，`bordered` 仅保留兼容，不再作为文档主推写法。
- 表级 `sortProp / sortOrder / filterValues / defaultFilterValues` 仍可兼容使用，但不再作为推荐 API。

### Table Events

| 事件                   | 说明                     | 参数                                                 |
| ---------------------- | ------------------------ | ---------------------------------------------------- |
| `row-click`            | 行点击或键盘触发时派发   | `(row, rowIndex, event)`                             |
| `row-dblclick`         | 行双击时派发             | `(row, rowIndex, event)`                             |
| `row-contextmenu`      | 行右键时派发             | `(row, rowIndex, event)`                             |
| `cell-click`           | 单元格点击时派发         | `(row, column, cell, event)`                         |
| `cell-dblclick`        | 单元格双击时派发         | `(row, column, cell, event)`                         |
| `cell-contextmenu`     | 单元格右键时派发         | `(row, column, cell, event)`                         |
| `cell-mouse-enter`     | 鼠标进入单元格时派发     | `(row, column, cell, event)`                         |
| `cell-mouse-leave`     | 鼠标离开单元格时派发     | `(row, column, cell, event)`                         |
| `header-click`         | 表头点击时派发           | `(column, event)`                                    |
| `header-contextmenu`   | 表头右键时派发           | `(column, event)`                                    |
| `header-dragend`       | 列拖拽结束时派发         | `(newWidth, oldWidth, column, event)`                |
| `selection-change`     | 选择结果变化时派发       | `(selectionRows)`                                    |
| `select`               | 单行选择变化时派发       | `(selectionRows, row)`                               |
| `select-all`           | 头部全选变化时派发       | `(selectionRows)`                                    |
| `current-change`       | 当前高亮行变化时派发     | `(currentRow, oldCurrentRow)`                        |
| `sort-change`          | 排序变化时派发           | `({ column, prop, order })`                          |
| `filter-change`        | 筛选变化时派发           | `(filterValues)`                                     |
| `expand-change`        | 展开行或树节点变化时派发 | `(row, expandedRows \| expanded)`                    |
| `update:currentRowKey` | 当前行 key 更新          | `string \| number \| null`                           |
| `update:sortProp`      | 兼容排序列更新           | `string \| undefined`                                |
| `update:sortOrder`     | 兼容排序方向更新         | `'ascending' \| 'descending' \| null`                |
| `update:filterValues`  | 兼容筛选状态更新         | `Record<string, Array<string \| number \| boolean>>` |

### Table Methods

| 方法                 | 说明                   | 签名                              |
| -------------------- | ---------------------- | --------------------------------- |
| `clearSelection`     | 清空当前选择           | `() => void`                      |
| `getSelectionRows`   | 获取当前选择行         | `() => T[]`                       |
| `toggleAllSelection` | 切换当前页全选         | `() => void`                      |
| `toggleRowSelection` | 切换单行选择状态       | `(row, selected?) => void`        |
| `toggleRowExpansion` | 切换展开行状态         | `(row, expanded?) => void`        |
| `setCurrentRow`      | 设置当前高亮行         | `(row?) => void`                  |
| `clearSort`          | 清空排序               | `() => void`                      |
| `clearFilter`        | 清空筛选               | `(columnKeys?) => void`           |
| `sort`               | 主动设置排序           | `(prop, order) => void`           |
| `doLayout`           | 重新同步布局与滚动度量 | `() => void`                      |
| `scrollTo`           | 滚动到指定位置         | `(options \| left, top?) => void` |
| `setScrollTop`       | 设置纵向滚动位置       | `(top) => void`                   |
| `setScrollLeft`      | 设置横向滚动位置       | `(left) => void`                  |

### Table Slots

| 插槽      | 说明                               |
| --------- | ---------------------------------- |
| `default` | 列定义区，只接收 `xy-table-column` |
| `loading` | 自定义加载态内容                   |
| `empty`   | 自定义空态内容                     |

### TableColumn Attributes

| 属性                    | 说明                                        | 类型                                                          | 默认值                              |
| ----------------------- | ------------------------------------------- | ------------------------------------------------------------- | ----------------------------------- |
| `type`                  | 列类型                                      | `'default' \| 'selection' \| 'index' \| 'expand'`             | `'default'`                         |
| `prop`                  | 读取行数据的字段名                          | `keyof T & string`                                            | `undefined`                         |
| `label`                 | 列标题                                      | `string`                                                      | `''`                                |
| `column-key`            | 列状态 key，筛选和排序优先使用它            | `string`                                                      | `undefined`                         |
| `width`                 | 列宽                                        | `string \| number`                                            | `undefined`                         |
| `min-width`             | 最小列宽                                    | `string \| number`                                            | `undefined`                         |
| `align`                 | 单元格对齐方式                              | `'left' \| 'center' \| 'right'`                               | `'left'`                            |
| `header-align`          | 表头对齐方式                                | `'left' \| 'center' \| 'right'`                               | 跟随 `align`                        |
| `class-name`            | 单元格 class                                | `string`                                                      | `''`                                |
| `label-class-name`      | 表头 class                                  | `string`                                                      | `''`                                |
| `formatter`             | 默认单元格格式化函数                        | `(row, column, value, rowIndex) => unknown`                   | `undefined`                         |
| `sortable`              | 是否开启排序；`'custom'` 表示远程排序       | `boolean \| 'custom'`                                         | `false`                             |
| `sort-method`           | 本地排序函数                                | `(left, right) => number`                                     | `undefined`                         |
| `sort-by`               | 指定排序字段或排序读取函数                  | `string \| Function \| Array<string \| Function>`             | `undefined`                         |
| `sort-orders`           | 排序切换顺序                                | `Array<'ascending' \| 'descending' \| null>`                  | `['ascending', 'descending', null]` |
| `filters`               | 列筛选项                                    | `Array<{ text: string; value: string \| number \| boolean }>` | `[]`                                |
| `filtered-value`        | 当前列筛选状态                              | `Array<string \| number \| boolean>`                          | `undefined`                         |
| `filter-method`         | 自定义筛选函数                              | `(value, row, column) => boolean`                             | `undefined`                         |
| `filter-multiple`       | 是否多选筛选                                | `boolean`                                                     | `true`                              |
| `show-overflow-tooltip` | 当前列是否启用溢出 tooltip                  | `boolean`                                                     | 跟随表格 `show-overflow-tooltip`    |
| `fixed`                 | 固定列位置                                  | `true \| 'left' \| 'right'`                                   | `undefined`                         |
| `selectable`            | `selection` 列的可选行判断                  | `(row, rowIndex) => boolean`                                  | `undefined`                         |
| `reserve-selection`     | `selection` 列是否按 `row-key` 保留选择状态 | `boolean`                                                     | `false`                             |
| `index`                 | `index` 列起始值或自定义序号函数            | `number \| (index) => number`                                 | `undefined`                         |
| `resizable`             | 当前叶子列是否允许拖拽列宽                  | `boolean`                                                     | `true`                              |

### TableColumn Slots

| 插槽      | 说明                                                 | 参数                                                                |
| --------- | ---------------------------------------------------- | ------------------------------------------------------------------- |
| `default` | 自定义单元格内容；`type="expand"` 时用于渲染展开内容 | `{ row, rowIndex, column, columnIndex, value, expanded, treeNode }` |
| `header`  | 自定义表头内容                                       | `{ column, sortOrder, filteredValues }`                             |
