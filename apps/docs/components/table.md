---
title: Table 表格
description: 后台表格组件，支持列树、选择列、展开行、树形数据、固定列、汇总行和实例方法。
outline: deep
---

# Table 表格

用于展示多种类型的数据。当前版本仍以 `xy-table + xy-table-column` 作为唯一列定义方式，提供完善的能力组织，补齐了 `selection / index / expand / fixed / summary / span-method / tree / lazy / methods` 这一组高频能力。

## 基础用法

:::demo 基础表格继续使用子组件列定义，支持当前行高亮、行点击和默认单元格插槽。
table/basic
:::

## 带状态的表格

:::demo 使用 `row-class-name` 可以为不同行增加状态层，适合审批、告警和风控类列表。
table/status-rows
:::

## 远程排序与分页

:::demo 当排序、筛选和分页由服务端驱动时，可以通过受控排序状态、列级受控筛选和分页参数统一联动外部请求；切换排序或筛选后应主动回到第一页。
table/server-pagination
:::

## 筛选与排序

:::demo 表格内置列级筛选和本地排序；多选筛选会在点击“确定”后统一提交。
table/filter-sort
:::

## 单选筛选

:::demo 单选筛选面板支持方向键切换、回车确认和 Tab 关闭，适合需要键盘可达性的列表场景。
table/filter-single-keyboard
:::

## 固定列与列宽拖拽

:::demo 固定列、固定高度和列宽拖拽常用于后台长列表。示例保留了横向溢出，方便直接观察固定列边界表现。
table/fixed-resizable
:::

## Auto 布局与响应式滚动

:::demo `table-layout="auto"` 会优先根据真实内容测宽；结合 `flexible`、`native-scrollbar` 和实例方法滚动，可以更直观地观察列宽优先级与布局同步。
table/auto-responsive
:::

## 多级表头与合并单元格

:::demo 通过嵌套 `xy-table-column` 和 `span-method` 可以组织多级表头与合并单元格。
table/grouped-span
:::

## Auto、固定列与汇总组合

:::demo 当列表既有长文本列、又需要左右锚定列和经营指标汇总时，可以把 `table-layout="auto"`、分组表头、固定列与 `summary-method` 组合在同一张表里。
table/auto-fixed-summary
:::

## 自定义表头

:::demo 通过 `header` 插槽可以自定义表头内容，也可以把局部搜索和轻筛选放进表头。
table/custom-header
:::

## 选择列、展开行与实例方法

:::demo `selection / index / expand / fixed / show-summary` 可以组合使用，实例方法适合做列表控制和状态回写。
table/selection-expand
:::

## 选择列与实例方法控制

:::demo 当列表需要“选中第一行 / 清空选择 / 主动排序”这类外部控制时，可以直接通过实例方法驱动表格状态。
table/selection-methods
:::

## 实例方法与事件联动

:::demo `sort / clearSort / clearFilter / toggleAllSelection` 这类实例方法适合由外部工具栏触发，再通过 `sort-change / filter-change / selection-change` 回写状态摘要。
table/methods-events
:::

## 受控状态组合

:::demo 当当前行、展开行、排序和筛选需要与路由、工具栏或请求参数保持同源时，可以把它们统一收敛到外部受控状态，再通过事件回写。
table/controlled-state
:::

## 展开行与汇总行

:::demo 展开行适合承载补充说明，`summary-method` 适合自定义汇总结果，两者可以组合使用。
table/expand-summary
:::

## 树形数据与懒加载

:::demo 树形数据和懒加载共用同一套列树与 body 渲染链路；可以通过 `updateKeyChildren` 主动写回 lazy 子节点，并配合 `preserve-expanded-content` 保留展开内容 DOM。
table/tree-lazy
:::

## Lazy 挂起与手动写回

:::demo 当 lazy 请求仍在挂起时，节点会保持 loading 态并忽略重复点击；如果业务侧提前拿到 children，可以通过 `updateKeyChildren` 直接写回并结束 loading。
table/tree-lazy-control
:::

## 附加内容与滚动事件

:::demo `append` 插槽会渲染在表体末尾、汇总行之前；`scroll` 会在原生滚动、固定列联动和实例方法滚动后统一派发。
table/append-scroll
:::

## 行操作列

:::demo 任意一列都可以通过默认插槽变成自定义单元格，操作列不依赖额外命名插槽。
table/action-column
:::

## 加载态与空态

:::demo Table 可以作为加载态、空态和列表内容的统一承载容器。
table/state
:::

Table 的默认加载遮罩已经接入统一的 Loading indicator。未自定义 `loading` 插槽时，会使用与独立 `Loading` 一致的 spinner 和文案表现；同时会读取 `ConfigProvider.loading` 的 `text / spinner / svg / svgViewBox / background` 作为视觉默认项，但不会继承 `delay / minDuration / fullscreen / lock`。

## 空态、加载态与错误态

:::demo 页面层可以在正常、空结果、加载中和加载失败之间切换，Table 负责统一展示容器与骨架。
table/multi-state
:::

## 何时使用

- 后台列表页、运营视图和只读数据表格。
- 需要选择列、展开行、固定列、汇总行、树形数据等经典 Table 能力。
- 需要通过 `xy-table-column` 的嵌套声明组织复杂表头，而不是维护 `columns` 数组。

## 最佳实践

### 先补稳定的 `row-key`

- 只要涉及 `selection`、当前行高亮、展开行、tree、lazy、`updateKeyChildren` 或“数据刷新后保留状态”，都应显式提供稳定的 `row-key`。
- 不要直接使用页内索引、排序后会变化的字段或只在当前页唯一的临时值；这些 key 会让选择、展开和当前行恢复语义失效。
- `row-key` 支持点路径，但路径最终解析出的值仍需保持全量数据范围内稳定且唯一。

### 区分受控状态与默认状态

- `default-current-row-key`、`default-expand-all`、`default-sort` 更适合首屏初始化，不适合承载长期业务状态。
- 一旦传入 `current-row-key`、`expand-row-keys`，或兼容态的 `sortProp / sortOrder / filterValues`，就应把它们视为受控值，并由外部单一数据源维护。
- 不建议同时依赖默认值、实例方法和外部受控值反复抢占同一份状态；需要与路由、工具栏、服务端查询参数同步时，应优先采用受控写法。

### 根据场景选择 `fixed` 或 `auto`

- `table-layout="fixed"` 适合字段语义稳定、列宽预期明确的后台列表，推荐配合 `width / min-width` 获得更稳定的首屏布局。
- `table-layout="auto"` 更适合长短文本混排、内容宽度差异明显的列表，但仍建议给关键列设置 `width` 或 `min-width` 作为兜底。
- `auto` 布局下列宽优先级为“手动拖拽 > 显式 `width` > 自动测宽”；内容频繁变化的列会重新收敛，因此不建议把所有列都完全交给自动测宽。
- 当 `show-header=false` 时，`auto` 会退回按 body 内容测宽，关键列更建议保留 `min-width`，避免纯数据波动造成视觉抖动。

### 在弹性容器中使用 `auto`

- 表格位于 flex 子项中时，推荐同时开启 `flexible`，或确保外层容器显式设置 `min-width: 0`。
- 如果父容器仍保留默认最小宽度约束，横向压缩会被父层拦住，表现上会像 `auto` 没有生效。

### tree / lazy 推荐写法

- tree 与 lazy 场景应始终补齐 `row-key`，否则展开、选择、子节点回写与状态恢复都缺少稳定锚点。
- `load` 只负责异步获取 children；如果业务侧提前拿到结果，优先调用 `updateKeyChildren(key, children)`，不要一边直接改原数组、一边再依赖内部 lazy 缓存兜底同步。
- 默认树形选择会保持父子联动；如果业务需要严格独立勾选，应显式开启 `tree-props.checkStrictly`。
- `default-expand-all` 更适合作为初始展开策略。数据整批替换后它会按当前数据重新作用，但不适合作为长期受控展开源。

### 实例方法适合做一次性动作

- `clearSelection`、`clearSort`、`clearFilter`、`toggleAllSelection`、`scrollTo` 这类实例方法更适合由外部工具栏触发的一次性操作。
- 如果页面状态需要可回放、可序列化，或者要与 URL / 查询条件保持同步，优先使用受控 props，而不是完全依赖实例方法驱动。
- `preserve-expanded-content` 适合保留折叠区 DOM 与本地状态，但会增加页面保留节点数量；在超大列表或重量级详情区中应谨慎开启。

## API

### Table Attributes

| 属性                        | 说明                                                          | 类型                                                                                                                        | 默认值                                                                       |
| --------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `data`                      | 数据源                                                        | `T[]`                                                                                                                       | `[]`                                                                         |
| `row-key`                   | 行唯一标识字段或函数                                          | `keyof T \| (row, rowIndex) => string \| number`                                                                            | `undefined`                                                                  |
| `size`                      | 表格尺寸                                                      | `'sm' \| 'md' \| 'lg'`                                                                                                      | `'md'`                                                                       |
| `width`                     | 表格根节点宽度                                                | `string \| number`                                                                                                          | `undefined`                                                                  |
| `height`                    | 固定高度，超过后表体滚动                                      | `string \| number`                                                                                                          | `undefined`                                                                  |
| `max-height`                | 最大高度，超过后表体滚动                                      | `string \| number`                                                                                                          | `undefined`                                                                  |
| `fit`                       | 是否让列宽自适应容器宽度                                      | `boolean`                                                                                                                   | `true`                                                                       |
| `stripe`                    | 是否显示斑马纹                                                | `boolean`                                                                                                                   | `false`                                                                      |
| `border`                    | 是否显示完整边框和纵向分割线                                  | `boolean`                                                                                                                   | `false`                                                                      |
| `show-header`               | 是否显示表头                                                  | `boolean`                                                                                                                   | `true`                                                                       |
| `show-summary`              | 是否显示汇总行                                                | `boolean`                                                                                                                   | `false`                                                                      |
| `sum-text`                  | 汇总行第一列文案                                              | `string`                                                                                                                    | `'合计'`                                                                     |
| `summary-method`            | 自定义汇总行计算                                              | `({ columns, data }) => unknown[]`                                                                                          | `undefined`                                                                  |
| `empty-text`                | 默认空态文案                                                  | `string`                                                                                                                    | `'暂无数据'`                                                                 |
| `loading`                   | 是否显示加载态遮罩                                            | `boolean`                                                                                                                   | `false`                                                                      |
| `loading-text`              | 默认加载文案                                                  | `string`                                                                                                                    | `'Loading...'`                                                               |
| `highlight-current-row`     | 是否高亮当前行                                                | `boolean`                                                                                                                   | `false`                                                                      |
| `current-row-key`           | 当前行 key，受控模式                                          | `string \| number \| null`                                                                                                  | `undefined`                                                                  |
| `default-current-row-key`   | 当前行 key 的非受控初始值                                     | `string \| number \| null`                                                                                                  | `null`                                                                       |
| `default-sort`              | 默认排序配置；只传 `prop` 时会默认按升序生效                  | `{ prop?: string; order?: 'ascending' \| 'descending' \| null }`                                                            | `{ prop: undefined, order: undefined }`                                      |
| `expand-row-keys`           | 展开行 key 列表                                               | `Array<string \| number>`                                                                                                   | `undefined`                                                                  |
| `default-expand-all`        | 是否默认展开全部可展开行/树节点                               | `boolean`                                                                                                                   | `false`                                                                      |
| `row-expandable`            | 控制 `type="expand"` 行是否可展开                             | `(row, rowIndex) => boolean`                                                                                                | `undefined`                                                                  |
| `span-method`               | 单元格合并逻辑                                                | `({ row, rowIndex, column, columnIndex }) => [rowspan, colspan] \| { rowspan, colspan }`                                    | `undefined`                                                                  |
| `select-on-indeterminate`   | 头部勾选在半选态下是否直接全选                                | `boolean`                                                                                                                   | `true`                                                                       |
| `indent`                    | 树形缩进宽度                                                  | `number`                                                                                                                    | `16`                                                                         |
| `tree-props`                | 树形字段配置                                                  | `{ children?: string; hasChildren?: string; checkStrictly?: boolean }`                                                      | `{ children: 'children', hasChildren: 'hasChildren', checkStrictly: false }` |
| `lazy`                      | 是否启用懒加载树节点                                          | `boolean`                                                                                                                   | `false`                                                                      |
| `load`                      | 懒加载回调                                                    | `(row, treeNode, resolve) => void`                                                                                          | `undefined`                                                                  |
| `table-layout`              | 表格布局算法                                                  | `'fixed' \| 'auto'`                                                                                                         | `'fixed'`                                                                    |
| `show-overflow-tooltip`     | 是否为默认文本链路统一开启溢出 tooltip，可传 tooltip 配置对象 | `boolean \| { effect?, enterable?, hideAfter?, offset?, placement?, popperClass?, popperOptions?, showAfter?, showArrow? }` | `false`                                                                      |
| `tooltip-effect`            | 全表默认溢出 tooltip 主题                                     | `'dark' \| 'light'`                                                                                                         | `undefined`                                                                  |
| `tooltip-options`           | 全表默认溢出 tooltip 配置                                     | `{ effect?, enterable?, hideAfter?, offset?, placement?, popperClass?, popperOptions?, showAfter?, showArrow? }`            | `undefined`                                                                  |
| `tooltip-formatter`         | 自定义溢出 tooltip 文案                                       | `({ row, column, value, cellValue }) => unknown`                                                                            | `undefined`                                                                  |
| `append-filter-panel-to`    | 指定筛选面板挂载节点选择器                                    | `string`                                                                                                                    | `''`                                                                         |
| `row-class-name`            | 行 class 或 class 计算函数                                    | `string \| ({ row, rowIndex }) => string`                                                                                   | `''`                                                                         |
| `row-style`                 | 行样式或样式计算函数                                          | `StyleValue \| ({ row, rowIndex }) => StyleValue`                                                                           | `undefined`                                                                  |
| `cell-class-name`           | 单元格 class 或 class 计算函数                                | `string \| (cellMeta) => string`                                                                                            | `''`                                                                         |
| `cell-style`                | 单元格样式或样式计算函数                                      | `StyleValue \| (cellMeta) => StyleValue`                                                                                    | `undefined`                                                                  |
| `header-row-class-name`     | 表头行 class 或 class 计算函数                                | `string \| ({ row, rowIndex }) => string`                                                                                   | `''`                                                                         |
| `header-row-style`          | 表头行样式或样式计算函数                                      | `StyleValue \| ({ row, rowIndex }) => StyleValue`                                                                           | `undefined`                                                                  |
| `header-cell-class-name`    | 表头单元格 class 或 class 计算函数                            | `string \| ({ row, rowIndex, column, columnIndex }) => string`                                                              | `''`                                                                         |
| `header-cell-style`         | 表头单元格样式或样式计算函数                                  | `StyleValue \| ({ row, rowIndex, column, columnIndex }) => StyleValue`                                                     | `undefined`                                                                  |
| `class-name`                | 表格根节点附加 class                                          | `string`                                                                                                                    | `''`                                                                         |
| `style`                     | 表格根节点附加样式                                            | `StyleValue`                                                                                                                | `undefined`                                                                  |
| `clickable`                 | 是否把主表体行视为可点击项，并补齐键盘聚焦与回车触发          | `boolean`                                                                                                                   | `false`                                                                      |
| `scrollbar-always-on`       | 是否为滚动容器保留稳定滚动条槽位                              | `boolean`                                                                                                                   | `false`                                                                      |
| `scrollbar-tabindex`        | 表体滚动容器的 `tabindex`                                     | `string \| number`                                                                                                          | `undefined`                                                                  |
| `flexible`                  | 是否让表格所在的 flex 子项自动解除最小宽度限制                | `boolean`                                                                                                                   | `false`                                                                      |
| `native-scrollbar`          | 是否使用原生滚动条而不是自定义滚动条                          | `boolean`                                                                                                                   | `false`                                                                      |
| `allow-drag-last-column`    | 是否允许拖拽当前渲染带中的最后一个叶子列                      | `boolean`                                                                                                                   | `true`                                                                       |
| `preserve-expanded-content` | 折叠展开行后是否保留其 DOM                                    | `boolean`                                                                                                                   | `false`                                                                      |
| `aria-label`                | 表格容器的无障碍名称                                          | `string`                                                                                                                    | `undefined`                                                                  |
| `aria-labelledby`           | 关联表格标题元素 id                                           | `string`                                                                                                                    | `undefined`                                                                  |
| `aria-describedby`          | 关联表格说明元素 id                                           | `string`                                                                                                                    | `undefined`                                                                  |

### Compatibility Notes

- `stripe` 是主命名，`striped` 仅保留兼容，不再作为文档主推写法。
- `border` 是主命名，`bordered` 仅保留兼容，不再作为文档主推写法。
- 表级 `sortProp / sortOrder / filterValues / defaultFilterValues` 仍可兼容使用，但不再作为推荐 API。
- `row-class-name / row-style / header-row-class-name / header-row-style / header-cell-class-name / header-cell-style` 现阶段主推对象风格入参；旧的拆参签名仍保留兼容。
- 列级 `filtered-value` 优先级高于表级 `filterValues`；表级 `filterValues` 再高于内部 `defaultFilterValues`。
- `table-layout="auto"` 下，列宽优先级遵循“手动拖拽 > 显式 width > 自动测宽”，动态切换 `width` 后会重新收敛到最新优先级。
- `lazy` 树节点在 loading 期间会忽略重复点击；如果通过 `updateKeyChildren` 手动写回 children，会直接结束 loading 并使用新子节点。

### Behavior Notes

- 当 `row-key` 稳定时，当前行、选择结果、展开状态以及 tree / lazy 相关状态会尽量按 key 恢复到新数据上。
- 如果 `row-key` 缺失、发生变化，或新数据中已不存在对应 key，表格会把这些记录视为全新的行，不保证继续沿用旧状态。
- 远程排序、筛选和分页场景中，表格负责交互发起与事件派发，最终数据、分页参数、排序摘要仍应由外部请求层统一维护。

### Table Events

| 事件                   | 说明                                         | 参数                                                 |
| ---------------------- | -------------------------------------------- | ---------------------------------------------------- |
| `row-click`            | 行点击或键盘触发时派发                       | `(row, column, event)`                               |
| `row-dblclick`         | 行双击时派发                                 | `(row, column, event)`                               |
| `row-contextmenu`      | 行右键时派发                                 | `(row, column, event)`                               |
| `cell-click`           | 单元格点击时派发                             | `(row, column, cell, event)`                         |
| `cell-dblclick`        | 单元格双击时派发                             | `(row, column, cell, event)`                         |
| `cell-contextmenu`     | 单元格右键时派发                             | `(row, column, cell, event)`                         |
| `cell-mouse-enter`     | 鼠标进入单元格时派发                         | `(row, column, cell, event)`                         |
| `cell-mouse-leave`     | 鼠标离开单元格时派发                         | `(row, column, cell, event)`                         |
| `header-click`         | 表头点击时派发                               | `(column, event)`                                    |
| `header-contextmenu`   | 表头右键时派发                               | `(column, event)`                                    |
| `header-dragend`       | 列拖拽结束时派发                             | `(newWidth, oldWidth, column, event)`                |
| `selection-change`     | 选择结果变化时派发                           | `(selectionRows)`                                    |
| `select`               | 单行选择变化时派发                           | `(selectionRows, row)`                               |
| `select-all`           | 头部全选变化时派发                           | `(selectionRows)`                                    |
| `current-change`       | 当前高亮行变化时派发                         | `(currentRow, oldCurrentRow)`                        |
| `sort-change`          | 排序变化时派发                               | `({ column, prop, order })`                          |
| `filter-change`        | 筛选变化时派发                               | `(filterValues)`                                     |
| `expand-change`        | 展开行或树节点变化时派发                     | `(row, expandedRows \| expanded)`                    |
| `scroll`               | 表体滚动、固定列联动滚动或实例方法滚动后派发 | `({ scrollLeft, scrollTop })`                        |
| `update:currentRowKey` | 当前行 key 更新                              | `string \| number \| null`                           |
| `update:sortProp`      | 兼容排序列更新                               | `string \| undefined`                                |
| `update:sortOrder`     | 兼容排序方向更新                             | `'ascending' \| 'descending' \| null`                |
| `update:filterValues`  | 兼容筛选状态更新                             | `Record<string, Array<string \| number \| boolean>>` |
| `update:expandRowKeys` | 展开行 key 更新                              | `Array<string \| number>`                            |

### Accessibility Notes

- 表格根节点会输出 `role="table"`、`aria-rowcount`、`aria-colcount` 与 `aria-busy`。
- `aria-label / aria-labelledby / aria-describedby` 适合在页面已经有标题、提示文案时接入无障碍语义。
- 展开按钮和树节点开关会自动输出 `aria-expanded`；lazy 节点加载中会额外输出 `aria-busy="true"`。
- 筛选按钮会输出 `aria-haspopup="dialog"` 与当前打开状态，适合和键盘筛选场景一起使用。

### Table Methods

这些方法更适合做“外部触发的一次性动作”，例如清空筛选、重置排序、滚动定位或主动切换选择状态；如果你需要把状态与路由、查询参数或服务端结果长期同步，优先使用受控 props。

| 方法                 | 说明                                                      | 签名                                          |
| -------------------- | --------------------------------------------------------- | --------------------------------------------- |
| `clearSelection`     | 清空当前选择                                              | `() => void`                                  |
| `getSelectionRows`   | 获取当前选择行                                            | `() => T[]`                                   |
| `toggleAllSelection` | 切换当前页全选                                            | `() => void`                                  |
| `toggleRowSelection` | 切换单行选择状态；第三参数可显式决定是否忽略 `selectable` | `(row, selected?, ignoreSelectable?) => void` |
| `toggleRowExpansion` | 切换展开行状态                                            | `(row, expanded?) => void`                    |
| `setCurrentRow`      | 设置当前高亮行                                            | `(row?) => void`                              |
| `clearSort`          | 清空排序                                                  | `() => void`                                  |
| `clearFilter`        | 清空筛选                                                  | `(columnKeys?) => void`                       |
| `sort`               | 主动设置排序                                              | `(prop, order) => void`                       |
| `doLayout`           | 重新同步布局与滚动度量                                    | `() => void`                                  |
| `scrollTo`           | 滚动到指定位置                                            | `(options \| left, top?) => void`             |
| `setScrollTop`       | 设置纵向滚动位置                                          | `(top) => void`                               |
| `setScrollLeft`      | 设置横向滚动位置                                          | `(left) => void`                              |
| `updateKeyChildren`  | 在 lazy 模式下按 `row-key` 主动写回某个节点的子节点       | `(key, children) => void`                     |

### Table Exposes

| 名称       | 说明                 | 类型                      |
| ---------- | -------------------- | ------------------------- |
| `columns`  | 当前解析后的列上下文 | `TableResolvedColumn<T>[]` |

### Table Slots

| 插槽      | 说明                                 |
| --------- | ------------------------------------ |
| `default` | 列定义区，只接收 `xy-table-column`   |
| `loading` | 自定义加载态内容                     |
| `empty`   | 自定义空态内容                       |
| `append`  | 渲染在表体末尾、汇总行之前的附加区域 |

### TableColumn Attributes

| 属性                    | 说明                                                      | 类型                                                                                                                        | 默认值                              |
| ----------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `type`                  | 列类型                                                    | `'default' \| 'selection' \| 'index' \| 'expand'`                                                                           | `'default'`                         |
| `prop`                  | 读取行数据的字段名                                        | `keyof T & string`                                                                                                          | `undefined`                         |
| `property`              | `prop` 的兼容别名                                         | `keyof T & string`                                                                                                          | `undefined`                         |
| `label`                 | 列标题                                                    | `string`                                                                                                                    | `''`                                |
| `column-key`            | 列状态 key，筛选和排序优先使用它                          | `string`                                                                                                                    | `undefined`                         |
| `width`                 | 列宽                                                      | `string \| number`                                                                                                          | `undefined`                         |
| `min-width`             | 最小列宽                                                  | `string \| number`                                                                                                          | `undefined`                         |
| `align`                 | 单元格对齐方式                                            | `'left' \| 'center' \| 'right'`                                                                                             | `'left'`                            |
| `header-align`          | 表头对齐方式                                              | `'left' \| 'center' \| 'right'`                                                                                             | 跟随 `align`                        |
| `class-name`            | 单元格 class                                              | `string`                                                                                                                    | `''`                                |
| `label-class-name`      | 表头 class                                                | `string`                                                                                                                    | `''`                                |
| `formatter`             | 默认单元格格式化函数                                      | `(row, column, value, rowIndex) => unknown`                                                                                 | `undefined`                         |
| `sortable`              | 是否开启排序；`'custom'` 表示远程排序                     | `boolean \| 'custom'`                                                                                                       | `false`                             |
| `sort-method`           | 本地排序函数                                              | `(left, right) => number`                                                                                                   | `undefined`                         |
| `sort-by`               | 指定排序字段或排序读取函数                                | `string \| Function \| Array<string \| Function>`                                                                           | `undefined`                         |
| `sort-orders`           | 排序切换顺序                                              | `Array<'ascending' \| 'descending' \| null>`                                                                                | `['ascending', 'descending', null]` |
| `filters`               | 列筛选项                                                  | `Array<{ text: string; value: string \| number \| boolean }>`                                                               | `[]`                                |
| `filtered-value`        | 当前列筛选状态                                            | `Array<string \| number \| boolean>`                                                                                        | `undefined`                         |
| `filter-method`         | 自定义筛选函数                                            | `(value, row, column) => boolean`                                                                                           | `undefined`                         |
| `filter-multiple`       | 是否多选筛选                                              | `boolean`                                                                                                                   | `true`                              |
| `filter-placement`      | 当前列筛选面板的浮层位置                                  | `Placement`                                                                                                                 | `'bottom-start'`                    |
| `filter-class-name`     | 当前列筛选面板的附加 class                                | `string`                                                                                                                    | `''`                                |
| `show-overflow-tooltip` | 当前列是否启用溢出 tooltip，可传 tooltip 配置对象         | `boolean \| { effect?, enterable?, hideAfter?, offset?, placement?, popperClass?, popperOptions?, showAfter?, showArrow? }` | 跟随表格 `show-overflow-tooltip`    |
| `tooltip-formatter`     | 当前列自定义溢出 tooltip 文案，优先级高于表格级 formatter | `({ row, rowIndex, column, columnIndex, value, cellValue }) => unknown`                                                     | `undefined`                         |
| `fixed`                 | 固定列位置                                                | `true \| 'left' \| 'right'`                                                                                                 | `undefined`                         |
| `selectable`            | `selection` 列的可选行判断                                | `(row, rowIndex) => boolean`                                                                                                | `undefined`                         |
| `reserve-selection`     | `selection` 列是否按 `row-key` 保留选择状态               | `boolean`                                                                                                                   | `false`                             |
| `index`                 | `index` 列起始值或自定义序号函数                          | `number \| (index) => number`                                                                                               | `undefined`                         |
| `resizable`             | 当前叶子列是否允许拖拽列宽                                | `boolean`                                                                                                                   | `true`                              |

### TableColumn Slots

| 插槽          | 说明                                                 | 参数                                                                |
| ------------- | ---------------------------------------------------- | ------------------------------------------------------------------- |
| `default`     | 自定义单元格内容；`type="expand"` 时用于渲染展开内容 | `{ row, rowIndex, column, columnIndex, value, expanded, treeNode }` |
| `expand`      | `type="expand"` 的专用展开内容槽位，优先级高于默认槽 | `{ row, rowIndex, column, columnIndex, value, expanded, expandable, treeNode }` |
| `header`      | 自定义表头内容                                       | `{ column, sortOrder, filteredValues }`                             |
| `filter-icon` | 自定义筛选图标                                       | `{ filterOpened }`                                                  |
