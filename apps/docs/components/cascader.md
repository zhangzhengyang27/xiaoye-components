---
title: Cascader 级联选择
description: 用于地区、目录和路径式分类选择的级联选择组件。
outline: deep
---

# Cascader 级联选择

`xy-cascader` 适合地区、目录和路径式分类选择。当前 v1 只做单选，值固定为完整路径数组。

## 基础用法

:::demo 逐级点击选项后，组件会在触发器里按路径回显，并对外输出完整路径值。
cascader/basic
:::

## 搜索过滤

:::demo 开启 `filterable` 后，会在当前已加载节点中按路径文本搜索。
cascader/filterable
:::

## 懒加载

:::demo `lazy + load` 适合大型目录或按需加载的分类体系。
cascader/lazy
:::

## 行为约定

- 当前版本只做单选，组件输出的值固定为“从根到当前节点的完整路径数组”。
- `filterable` 打开后，会在当前已加载节点中按路径文案搜索，不会替代懒加载逻辑。
- `lazy + load` 模式下，组件会在需要展开子节点时调用 `load(option, resolve)`，业务侧通过 `resolve` 回填子节点。

## API

### Cascader Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 当前选中路径值 | `CascaderProps["modelValue"]` | `null` |
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
