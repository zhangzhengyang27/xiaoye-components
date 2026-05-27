---
title: AutoComplete 自动完成
description: 用于搜索建议、命中提示和远程联想输入的轻量组件。
outline: deep
---

# AutoComplete 自动完成

`xy-auto-complete` 用于搜索建议、命中提示和远程联想输入。它的核心是”受控输入 + 建议列表”，不承担多选或 mention 这类更重的职责。当用户只能从预设列表中选值时用 `xy-select`；当需要自由输入并给出建议时用 AutoComplete。

## 基础用法

:::demo 默认会按标签文案做本地过滤，并在选择建议项后把标签文案回填到输入框。
auto-complete/basic
:::

## 远程建议

:::demo 开启 `remote` 后，组件只派发 `search-change`，列表内容完全由外部控制。
auto-complete/remote
:::

## 实例级样式收口

> 后台项目如果只是想收口建议面板的背景、边框、阴影、宽度或加载态视觉，优先使用 `popper-class`、`popper-style` 和 `dropdown-min-width / dropdown-max-width`。不建议继续在页面层 deep 到建议项、空态、加载态或输入框和面板的衔接结构类名。

:::demo 当后台项目只想统一联想面板的背景、边框和选中态时，优先通过 `popper-class` 和实例级变量收口，而不是继续 deep 到内部类名。
auto-complete/popper-class
:::

## 表单场景

:::demo 放到 `xy-form-item` 中时，自动完成会在选择和关闭时参与表单校验。
auto-complete/form
:::

## 组件边界与场景选择

- **AutoComplete**：带建议的输入框，`model-value` 是 `string`，用户可以输入任意值，下拉列表只是辅助建议。适合搜索联想、邮箱补全等场景。
- **Select**：预定义枚举选择，值必须是选项之一，不允许自由输入不在列表中的值。
- **Cascader**：路径式选择，值是完整路径数组。
- **TreeSelect**：树节点值选择，值是单个节点 key。
- 如果你要求用户只能从列表中选一个值，用 Select；如果允许自由输入并希望给出建议，用 AutoComplete。

## 值形态

- `model-value` 始终为 `string`，用户输入什么就回传什么
- `remote` 模式下组件不做本地过滤，只派发 `search-change`，外部负责更新 `options`
- 选中建议项后，组件会把该选项的 `label` 回填到输入框（即 `model-value`）

## 行为约定

- `remote` 打开后，组件不再做本地过滤，只负责派发 `search-change` 并渲染外部传入的 `options`。
- `ArrowDown / ArrowUp` 在建议项之间移动，`Enter` 选择当前高亮项。
- `Escape / Tab` 会关闭下拉；关闭后会参与 `xy-form-item` 的 blur 校验链路。

## 命名映射

Vue 模板中 props 和 events 使用 kebab-case，源码 / TS 类型层使用 camelCase，两者由 Vue 自动转换，等价：

### Props 映射

| 模板写法（kebab-case） | 源码 / TS 写法（camelCase） |
| ---------------------- | --------------------------- |
| `model-value`          | `modelValue`                |
| `loading-text`         | `loadingText`               |
| `prefix-icon`          | `prefixIcon`                |
| `suffix-icon`          | `suffixIcon`                |
| `append-to`            | `appendTo`                  |
| `popper-class`         | `popperClass`               |
| `popper-style`         | `popperStyle`               |
| `dropdown-min-width`   | `dropdownMinWidth`          |
| `dropdown-max-width`   | `dropdownMaxWidth`          |

其余属性（`options`、`placeholder`、`disabled`、`clearable`、`remote`、`loading`、`size`、`teleported`、`placement`、`offset`）为单词形式，模板与源码写法一致。

### Events 映射

| 模板写法（kebab-case） | 源码 emit 写法（camelCase） |
| ---------------------- | --------------------------- |
| `update:model-value`   | `update:modelValue`         |
| `visible-change`       | `visibleChange`             |
| `search-change`        | `searchChange`              |

其余事件（`change`、`clear`、`focus`、`blur`、`select`）为单单词，模板与源码写法一致。

下方 API 表格统一按模板层推荐写法列出。

## API

### AutoComplete Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 当前输入值 | `string` | `''` |
| `options` | 建议项列表 | `AutoCompleteOption<T>[]` | — |
| `placeholder` | 输入占位提示 | `string` | `'请输入关键词'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `clearable` | 是否允许清空 | `boolean` | `false` |
| `remote` | 是否启用远程建议模式 | `boolean` | `false` |
| `loading` | 是否展示加载态 | `boolean` | `false` |
| `loading-text` | 加载态文案 | `string` | `'加载中'` |
| `size` | 组件尺寸 | `ComponentSize` | 跟随全局配置 |
| `prefix-icon` | 输入框前缀图标 | `string` | `''` |
| `suffix-icon` | 输入框后缀图标 | `string` | `''` |
| `teleported` | 是否把下拉面板传送到 `body` | `boolean` | `true` |
| `append-to` | 下拉面板挂载目标 | `string \| HTMLElement` | `'body'` |
| `placement` | 下拉面板弹出位置 | `Placement` | `'bottom-start'` |
| `offset` | 下拉面板偏移量 | `number` | `8` |
| `popper-class` | 下拉面板自定义类名 | `string` | `''` |
| `popper-style` | 下拉面板自定义样式 | `StyleValue` | `''` |
| `dropdown-min-width` | 下拉面板最小宽度 | `string \| number` | — |
| `dropdown-max-width` | 下拉面板最大宽度 | `string \| number` | — |

### AutoComplete Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:model-value` | 输入值变化时触发 | `AutoCompleteValueChangeHandler` |
| `change` | 选择建议项或点击清空后触发 | `AutoCompleteValueChangeHandler` |
| `clear` | 点击清空按钮时触发 | — |
| `visible-change` | 下拉打开或关闭时触发 | `AutoCompleteVisibleChangeHandler` |
| `focus` | 打开下拉面板时触发 | — |
| `blur` | 关闭下拉面板时触发 | — |
| `search-change` | 搜索关键词变化时触发 | `AutoCompleteSearchChangeHandler` |
| `select` | 选择某个建议项时触发 | `AutoCompleteSelectHandler<T>` |

### AutoComplete Option

建议项类型为 `AutoCompleteOption<T>`。

### AutoComplete Slots

| 插槽 | 说明 |
| --- | --- |
| `prefix` | 输入框前缀内容 |
| `suffix` | 输入框后缀内容 |
| `loading` | 自定义加载态内容 |
| `empty` | 自定义空态内容 |
| `option` | 自定义建议项内容，接收 `AutoCompleteOptionSlotProps<T>` |

### AutoComplete Exposes

| 暴露项 | 说明 | 类型 |
| --- | --- | --- |
| `focus` | 聚焦输入框 | `AutoCompleteInstance["focus"]` |
| `blur` | 关闭下拉并让输入框失焦 | `AutoCompleteInstance["blur"]` |
| `open` | 打开下拉面板 | `AutoCompleteInstance["open"]` |
| `close` | 关闭下拉面板 | `AutoCompleteInstance["close"]` |
