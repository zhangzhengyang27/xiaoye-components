---
title: Cascader 级联选择
description: 用于地区、目录和路径式分类选择的级联选择组件。
outline: deep
---

# Cascader 级联选择

`xy-cascader` 用于地区、目录和路径式分类选择——当你的值是从根到叶的完整路径数组时，用 Cascader；当你只需要树中某个节点的 key 时，用 `xy-tree-select`；当你的选项是扁平枚举值时，用 `xy-select`。

## 基础用法

:::demo 逐级点击选项后，组件会在触发器里按路径回显，并对外输出完整路径值。
cascader/basic
:::

## 搜索过滤

:::demo 开启 `filterable` 后，会在当前已加载节点中按路径文本搜索。
cascader/filterable
:::

## 实例级样式收口

:::demo 当后台项目只想统一级联面板的列区层次、搜索结果和选中态时，优先通过 `popper-class` / `popper-style` 收口，不要 deep 到内部类名。
cascader/popper-class
:::

## 懒加载

:::demo `lazy + load` 适合大型目录或按需加载的分类体系。
cascader/lazy
:::

## 组件边界与场景选择

- **Cascader**：路径选择，值是 `CascaderKey[]`（从根到叶的完整路径数组），适合地区、目录、分类体系。触发器按路径回显，如 `浙江 / 杭州 / 西湖`。
- **TreeSelect**：树节点值选择，值是单个 `TreeKey`（节点唯一标识），适合组织架构、权限树、菜单配置。节点可展开/折叠但不跨级回显路径。
- **Select**：扁平枚举值选择，值是单个或多个 `option.value`，适合状态、角色等简单枚举。不需要路径回显。
- **AutoComplete**：输入联想，值是搜索字符串，适合远程搜索和建议补全。

如果你发现自己在 Cascader 里只关心最后一层节点的 key，大概率应该用 TreeSelect。

## 值形态与字段映射

### model-value 类型

- `CascaderValue` = `CascaderKey[] | null`（`CascaderKey` = `string | number`）
- 单选时，值始终是从根到当前节点的完整路径数组，例如 `['zhejiang', 'hangzhou', 'xihu']`
- 当前 v1 只做单选，不支持多选；值永远不会是单个 key

### props 字段映射（CascaderFieldNames）

通过 `props` 属性可以自定义选项数据的字段名，默认映射为：

```ts
{ label: 'label', value: 'value', children: 'children', disabled: 'disabled', leaf: 'leaf' }
```

- `label`：选项展示文案对应的字段
- `value`：选项值对应的字段（路径数组中每一项取此字段）
- `children`：子选项列表字段
- `disabled`：禁用标识字段
- `leaf`：叶子节点标识字段（懒加载模式下用于判断是否需要继续加载）

## 行为约定与优先级

- 当前版本只做单选，组件输出的值固定为完整路径数组（见上方「值形态」）。
- `filterable` 打开后，会在当前已加载节点中按路径文案搜索，不会替代懒加载逻辑。
- `lazy + load` 模式下，组件会在需要展开子节点时调用 `load(option, resolve)`，业务侧通过 `resolve` 回填子节点。
- 如果需要限制节点可选性，通过 `props.disabled` 字段或自定义 options 中的 `disabled` 控制，不提供 `disabled-date` 类函数 props。
- `clearable` 会清空整条路径（`model-value` 回到 `null`），不会只清空最后一层。

## 命名映射

Vue 模板中 props 和 events 使用 kebab-case，源码 / TS 类型层使用 camelCase，两者由 Vue 自动转换，等价：

### Props 映射

| 模板写法（kebab-case） | 源码 / TS 写法（camelCase） |
| ---------------------- | --------------------------- |
| `model-value`          | `modelValue`                |
| `search-placeholder`   | `searchPlaceholder`         |
| `append-to`            | `appendTo`                  |
| `popper-class`         | `popperClass`               |
| `popper-style`         | `popperStyle`               |

其余属性（`options`、`placeholder`、`disabled`、`clearable`、`filterable`、`lazy`、`load`、`size`、`teleported`、`placement`、`offset`、`props`）为单词形式，模板与源码写法一致。

### Events 映射

| 模板写法（kebab-case） | 源码 emit 写法（camelCase） |
| ---------------------- | --------------------------- |
| `update:model-value`   | `update:modelValue`         |
| `visible-change`       | `visibleChange`             |
| `search-change`        | `searchChange`              |

其余事件（`change`、`clear`、`focus`、`blur`）为单单词，模板与源码写法一致。

下方 API 表格统一按模板层推荐写法列出。

## API

### Cascader Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 当前选中路径值 | `CascaderKey[] \| null` | `null` |
| `options` | 级联选项树 | `CascaderProps["options"]` | `[]` |
| `props` | 字段映射配置 | `CascaderFieldNames` | `{ label: 'label', value: 'value', children: 'children', disabled: 'disabled', leaf: 'leaf' }` |
| `placeholder` | 未选择时的占位提示 | `CascaderProps["placeholder"]` | `'请选择'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `clearable` | 是否允许清空 | `boolean` | `false` |
| `filterable` | 是否启用搜索过滤 | `boolean` | `false` |
| `lazy` | 是否启用懒加载 | `boolean` | `false` |
| `load` | 懒加载回调 | `CascaderLoadFunction` | `undefined` |
| `size` | 组件尺寸 | `CascaderProps["size"]` | 跟随全局配置 |
| `search-placeholder` | 搜索框占位文案 | `string` | `'搜索选项'` |
| `teleported` | 是否把下拉面板传送到 `body` | `boolean` | `true` |
| `append-to` | 下拉面板挂载目标 | `string \| HTMLElement` | `'body'` |
| `placement` | 下拉面板弹出位置 | `Placement` | `'bottom-start'` |
| `offset` | 下拉面板偏移量 | `number` | `8` |
| `popper-class` | 下拉面板自定义类名 | `string` | `''` |
| `popper-style` | 下拉面板自定义样式 | `StyleValue` | `''` |

### Cascader Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:model-value` | 选中路径变化时触发 | `CascaderValueChangeHandler` |
| `change` | 选中路径确认变化或点击清空后触发 | `CascaderValueChangeHandler` |
| `clear` | 点击清空按钮时触发 | — |
| `visible-change` | 面板打开或关闭时触发 | `CascaderVisibleChangeHandler` |
| `focus` | 打开面板时触发 | — |
| `blur` | 关闭面板时触发 | — |
| `search-change` | 搜索关键词变化时触发 | `CascaderSearchChangeHandler` |

### Cascader FieldNames

`props` 字段映射配置的类型为 `CascaderFieldNames`：

```ts
type CascaderFieldNames = CascaderProps["props"];
```

### Cascader Exposes

| 暴露项 | 说明 | 类型 |
| --- | --- | --- |
| `focus` | 聚焦触发器 | `CascaderInstance["focus"]` |
| `blur` | 关闭面板并让触发器失焦 | `CascaderInstance["blur"]` |
| `open` | 打开下拉面板 | `CascaderInstance["open"]` |
| `close` | 关闭下拉面板 | `CascaderInstance["close"]` |
