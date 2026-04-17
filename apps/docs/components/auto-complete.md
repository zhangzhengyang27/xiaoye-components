---
title: AutoComplete 自动完成
description: 用于搜索建议、命中提示和远程联想输入的轻量组件。
outline: deep
---

# AutoComplete 自动完成

`xy-auto-complete` 适合搜索建议、命中提示和远程联想输入。它的核心是“受控输入 + 建议列表”，不承担多选或 mention 这类更重的职责。

## 基础用法

:::demo 默认会按标签文案做本地过滤，并在选择建议项后把标签文案回填到输入框。
auto-complete/basic
:::

## 远程建议

:::demo 开启 `remote` 后，组件只派发 `search-change`，列表内容完全由外部控制。
auto-complete/remote
:::

## 表单场景

:::demo 放到 `xy-form-item` 中时，自动完成会在选择和关闭时参与表单校验。
auto-complete/form
:::

## 行为约定

- `remote` 打开后，组件不再做本地过滤，只负责派发 `search-change` 并渲染外部传入的 `options`。
- `ArrowDown / ArrowUp` 在建议项之间移动，`Enter` 选择当前高亮项。
- `Escape / Tab` 会关闭下拉；关闭后会参与 `xy-form-item` 的 blur 校验链路。

## API

### AutoComplete Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 当前输入值 | `AutoCompleteProps<T>["modelValue"]` | `''` |
| `options` | 建议项列表 | `AutoCompleteProps<T>["options"]` | `[]` |
| `placeholder` | 输入占位提示 | `AutoCompleteProps<T>["placeholder"]` | `'请输入关键词'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `clearable` | 是否允许清空 | `boolean` | `false` |
| `remote` | 是否启用远程建议模式 | `boolean` | `false` |
| `loading` | 是否展示加载态 | `boolean` | `false` |
| `loading-text` | 加载态文案 | `string` | `'加载中'` |
| `size` | 组件尺寸 | `AutoCompleteProps<T>["size"]` | 跟随全局配置 |
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
