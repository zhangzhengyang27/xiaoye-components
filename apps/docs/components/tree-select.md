---
title: TreeSelect 树选择
description: 用于组织、目录和权限树单选的层级选择组件。
outline: deep
---

# TreeSelect 树选择

`xy-tree-select` 用于树形结构的值选择——值是单个节点 key，适合组织架构、权限树、菜单配置等"需要展开/折叠但只需要节点 key"的场景。当你的值是"从根到叶的完整路径数组"时用 `xy-cascader`；当选项是扁平枚举时用 `xy-select`。

## 实例级样式收口

- 后台项目如果只是想收口树面板的背景、边框、阴影和宽度，优先使用 `popper-class`、`popper-style`，不要在页面层 deep 到树节点、展开/折叠指示器和选中态的内部类名。
- TreeSelect 和 Select / Cascader 一样是筛选条/表单输入浮层；如果风格不统一，优先回到组件库层处理。

## 基础用法

:::demo 通过 `node-key` 标识节点主键，组件会在选择后回显节点标签。
tree-select/basic
:::

## 过滤与清空

:::demo 开启 `filterable` 后，可以在面板内搜索已加载节点，并结合 `clearable` 清空当前值。
tree-select/filterable
:::

## 实例级样式收口

:::demo 当后台项目只想统一树筛选面板的背景、搜索区和节点 hover 状态时，优先通过 `popper-class` 和实例级变量收口，而不是继续 deep 到内部类名。
tree-select/popper-class
:::

## 表单场景

:::demo 放在 `xy-form-item` 中时，树选择会在选择和关闭时参与表单校验。
tree-select/form
:::

## 组件边界与场景选择

- **TreeSelect**：树节点值选择，值是单个 `TreeKey`（节点唯一标识），适合组织架构、权限树、菜单配置。节点可展开/折叠但不需要跨级回显路径。
- **Cascader**：路径选择，值是 `CascaderKey[]`（从根到叶的完整路径数组），适合地区、目录、分类体系。触发器按路径回显。
- **Select**：扁平枚举值选择，值是单个或多个 `option.value`，适合状态、角色等简单枚举。没有层级结构。
- 如果你需要"从根到叶的完整路径"作为值，用 Cascader；如果只需要树中某个节点的 key，用 TreeSelect；如果选项没有层级，用 Select。

## 值形态

- `model-value` 类型为 `TreeKey | null`（`TreeKey` = `string | number`）
- 当前 v1 只做单选，值是单个节点 key
- `props.label`、`props.children`、`props.disabled` 与 Cascader 的 `CascaderFieldNames` 类似，但 TreeSelect 的值是单节点 key 而非路径数组

## 行为约定

- 当前版本只做单选树选，`model-value` 是当前节点的单个 key，不是路径数组。
- `filterable` 打开后，会在面板顶部展示搜索框；默认会直接调用内部 `tree.filter()`。
- 如果你需要定制过滤逻辑，可以通过 `filter-node-method` 复用 `xy-tree` 的节点过滤协议。

## 命名映射

Vue 模板中 props 和 events 使用 kebab-case，源码 / TS 类型层使用 camelCase，两者由 Vue 自动转换，等价：

### Props 映射

| 模板写法（kebab-case） | 源码 / TS 写法（camelCase） |
| ---------------------- | --------------------------- |
| `model-value`          | `modelValue`                |
| `node-key`             | `nodeKey`                   |
| `filter-node-method`   | `filterNodeMethod`          |
| `empty-text`           | `emptyText`                 |
| `search-placeholder`   | `searchPlaceholder`         |
| `append-to`            | `appendTo`                  |
| `popper-class`         | `popperClass`               |
| `popper-style`         | `popperStyle`               |

其余属性（`data`、`placeholder`、`disabled`、`clearable`、`filterable`、`lazy`、`load`、`size`、`teleported`、`placement`、`offset`）为单词形式，模板与源码写法一致。

### Events 映射

| 模板写法（kebab-case） | 源码 emit 写法（camelCase） |
| ---------------------- | --------------------------- |
| `update:model-value`   | `update:modelValue`         |
| `visible-change`       | `visibleChange`             |

其余事件（`change`、`clear`、`focus`、`blur`）为单单词，模板与源码写法一致。

下方 API 表格统一按模板层推荐写法列出。

## API

### TreeSelect Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 当前选中节点 key | `TreeKey \| null` | `null` |
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
